<?php
/**
 * CuraMain – Bewerbungs-Endpoint mit Lebenslauf-Upload.
 *
 * Erwartet multipart/form-data:
 *   firstName, lastName, email, phone?, message?, jobTitle?, jobPostingId?
 *   cv (Datei, optional, max. 10 MB, .pdf/.doc/.docx)
 *
 * Speichert die Datei in /uploads/bewerbungen/{token}-{slug}.{ext}
 * (Verzeichnis ist via .htaccess vor öffentlichem Zugriff geschützt) und
 * verschickt eine E-Mail an bewerbung@curamain.de mit der Datei als Anhang.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// === Konfiguration ============================================================
$ALLOWED_HOSTS  = ['curamain.de', 'www.curamain.de'];
$TO             = 'bewerbung@curamain.de';
$FROM           = 'no-reply@curamain.de';
$UPLOAD_DIR     = __DIR__ . '/../uploads/bewerbungen';
$MAX_BYTES      = 10 * 1024 * 1024;
$ALLOWED_EXT    = ['pdf', 'doc', 'docx'];
$ALLOWED_MIMES  = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
$RL_DIR    = sys_get_temp_dir() . '/curamain-rl-bw';
$RL_LIMIT  = 3;
$RL_WINDOW = 3600;

// === Origin-Check ============================================================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = parse_url($origin, PHP_URL_HOST) ?: '';
if ($origin !== '' && !in_array($host, $ALLOWED_HOSTS, true)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Forbidden origin']);
    exit;
}

// === Rate-Limiting ===========================================================
@mkdir($RL_DIR, 0700, true);
$ip     = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ipHash = sha1($ip);
$rlFile = "$RL_DIR/$ipHash";
$now    = time();
$att    = [];
if (is_file($rlFile)) {
    $raw = @file_get_contents($rlFile);
    $att = $raw ? json_decode($raw, true) : [];
    if (!is_array($att)) $att = [];
    $att = array_filter($att, fn($t) => $t > $now - $RL_WINDOW);
}
if (count($att) >= $RL_LIMIT) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Zu viele Bewerbungen. Bitte später erneut.']);
    exit;
}

// === Felder ==================================================================
function s($v): string {
    return is_string($v) ? trim($v) : '';
}

if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

$firstName    = s($_POST['firstName'] ?? '');
$lastName     = s($_POST['lastName'] ?? '');
$email        = s($_POST['email'] ?? '');
$phone        = s($_POST['phone'] ?? '');
$message      = s($_POST['message'] ?? '');
$jobTitle     = s($_POST['jobTitle'] ?? '');
$jobPostingId = s($_POST['jobPostingId'] ?? '');

if ($firstName === '' || $lastName === '' || $email === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Pflichtfelder fehlen.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ungültige E-Mail-Adresse.']);
    exit;
}
// Header-Injection-Schutz: alle einzeiligen Felder dürfen kein CR/LF enthalten
foreach ([$firstName, $lastName, $email, $phone, $jobTitle, $jobPostingId] as $f) {
    if (preg_match("/[\r\n]/", $f)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Ungültige Zeichen.']);
        exit;
    }
}
// Mehrzeiliges Feld: CRLF auf LF normalisieren (verhindert MIME-Strukturbruch)
$message = str_replace(["\r\n", "\r"], "\n", $message);

// === CV verarbeiten ==========================================================
$cvAttachment = null;     // ['name'=>..., 'path'=>..., 'mime'=>...]
$cvStoredPath = null;

if (!empty($_FILES['cv']) && ($_FILES['cv']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $cv = $_FILES['cv'];
    if ($cv['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Upload-Fehler']);
        exit;
    }
    if (($cv['size'] ?? 0) > $MAX_BYTES) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Datei zu groß (max. 10 MB).']);
        exit;
    }
    $origName = basename($cv['name'] ?? 'lebenslauf');
    $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    if (!in_array($ext, $ALLOWED_EXT, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Nur PDF, DOC oder DOCX erlaubt.']);
        exit;
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($cv['tmp_name']) ?: 'application/octet-stream';
    if (!in_array($mime, $ALLOWED_MIMES, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'MIME-Typ nicht erlaubt.']);
        exit;
    }

    @mkdir($UPLOAD_DIR, 0700, true);
    if (!is_writable($UPLOAD_DIR)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Upload-Verzeichnis nicht beschreibbar.']);
        exit;
    }

    $token = bin2hex(random_bytes(8));
    $slug  = preg_replace('/[^a-zA-Z0-9_-]+/', '_', "{$firstName}_{$lastName}");
    $stored = "$UPLOAD_DIR/{$token}_{$slug}.{$ext}";

    if (!move_uploaded_file($cv['tmp_name'], $stored)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Datei konnte nicht gespeichert werden.']);
        exit;
    }

    $cvStoredPath = $stored;
    $cvAttachment = [
        'name' => "{$firstName}_{$lastName}_Lebenslauf.{$ext}",
        'path' => $stored,
        'mime' => $mime,
    ];
}

// === Mail-Body & Anhang ======================================================
$subjectLine = "[CuraMain] Bewerbung " . ($jobTitle !== '' ? "($jobTitle)" : '(Initiativ)');

$bodyLines = [
    "Neue Bewerbung über curamain.de",
    str_repeat('=', 60),
    "Name:    $firstName $lastName",
    "E-Mail:  $email",
];
if ($phone !== '')        $bodyLines[] = "Telefon: $phone";
if ($jobTitle !== '')     $bodyLines[] = "Stelle:  $jobTitle";
if ($jobPostingId !== '') $bodyLines[] = "Job-ID:  $jobPostingId";
$bodyLines[] = '';
if ($message !== '') {
    $bodyLines[] = "Anschreiben/Nachricht:";
    $bodyLines[] = $message;
    $bodyLines[] = '';
}
$bodyLines[] = str_repeat('-', 60);
$bodyLines[] = "IP:    $ip";
$bodyLines[] = "Datum: " . date('Y-m-d H:i:s T');
if ($cvStoredPath) {
    $bodyLines[] = "CV:    " . basename($cvStoredPath);
}
$plain = implode("\n", $bodyLines);

$boundary  = '=_curamain_' . bin2hex(random_bytes(8));
$headers   = [
    "From: CuraMain <$FROM>",
    "Reply-To: $firstName $lastName <$email>",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=\"$boundary\"",
];

$msg  = "--$boundary\r\n";
$msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
$msg .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$msg .= $plain . "\r\n";

if ($cvAttachment) {
    $data = base64_encode((string) file_get_contents($cvAttachment['path']));
    $data = chunk_split($data, 76, "\r\n");
    $msg .= "--$boundary\r\n";
    $msg .= "Content-Type: {$cvAttachment['mime']}; name=\"{$cvAttachment['name']}\"\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n";
    $msg .= "Content-Disposition: attachment; filename=\"{$cvAttachment['name']}\"\r\n\r\n";
    $msg .= $data . "\r\n";
}

$msg .= "--$boundary--\r\n";

$ok = mail($TO, $subjectLine, $msg, implode("\r\n", $headers));

if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'E-Mail konnte nicht versendet werden.']);
    exit;
}

$att[] = $now;
@file_put_contents($rlFile, json_encode(array_values($att)), LOCK_EX);

echo json_encode(['success' => true]);
