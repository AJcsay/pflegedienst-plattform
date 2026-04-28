<?php
/**
 * CuraMain – Kontakt-Endpoint für patientennahe & partnernahe Anfragen.
 *
 * Empfängt JSON-Body und versendet Mail an info@curamain.de bzw.
 * partner@curamain.de (je nach Kategorie).
 *
 * Sicherheit:
 *  - Origin-Check (nur eigene Domain)
 *  - Rate-Limiting per IP (5 Einsendungen / Stunde)
 *  - Honeypot-Feld "website" (von Bots gefüllt → leise verworfen)
 *  - E-Mail-Format prüfen
 *  - Header-Injection per validem Empfänger ausschließen
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Pre-flight (CORS unnötig, da gleiche Domain — defensives 204 trotzdem)
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// === Konfiguration ============================================================
$ALLOWED_HOSTS = ['curamain.de', 'www.curamain.de'];
$INFO_TO       = 'info@curamain.de';
$PARTNER_TO    = 'partner@curamain.de';
$FROM          = 'no-reply@curamain.de';
$RL_DIR        = sys_get_temp_dir() . '/curamain-rl';
$RL_LIMIT      = 5;
$RL_WINDOW     = 3600; // 1 Stunde

// === Origin-Check =============================================================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = parse_url($origin, PHP_URL_HOST) ?: '';
if ($origin !== '' && !in_array($host, $ALLOWED_HOSTS, true)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Forbidden origin']);
    exit;
}

// === Rate-Limiting (file-based) ==============================================
@mkdir($RL_DIR, 0700, true);
$ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ipHash   = sha1($ip);
$rlFile   = "$RL_DIR/$ipHash";
$now      = time();
$attempts = [];
if (is_file($rlFile)) {
    $raw      = @file_get_contents($rlFile);
    $attempts = $raw ? json_decode($raw, true) : [];
    if (!is_array($attempts)) $attempts = [];
    $attempts = array_filter($attempts, fn($t) => $t > $now - $RL_WINDOW);
}
if (count($attempts) >= $RL_LIMIT) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Zu viele Anfragen. Bitte später erneut versuchen.']);
    exit;
}

// === Body parsen ==============================================================
$body = file_get_contents('php://input');
$data = json_decode($body ?: '', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Honeypot
if (!empty($data['website'])) {
    // Stille Erfolgsmeldung — Bots merken nicht, dass sie geblockt wurden
    echo json_encode(['success' => true]);
    exit;
}

// === Felder validieren =======================================================
function s($v): string {
    return is_string($v) ? trim($v) : '';
}

$firstName = s($data['firstName'] ?? '');
$lastName  = s($data['lastName'] ?? '');
$email     = s($data['email'] ?? '');
$phone     = s($data['phone'] ?? '');
$subject   = s($data['subject'] ?? '');
$message   = s($data['message'] ?? '');
$category  = s($data['category'] ?? 'general');
$organization = s($data['organization'] ?? '');

if ($firstName === '' || $email === '' || $message === '') {
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
foreach ([$firstName, $lastName, $email, $subject, $phone, $organization] as $f) {
    if (preg_match("/[\r\n]/", $f)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Ungültige Zeichen.']);
        exit;
    }
}
// Mehrzeilige Felder: CRLF auf LF normalisieren (verhindert MIME-Strukturbruch)
$message = str_replace(["\r\n", "\r"], "\n", $message);

// === Empfänger nach Kategorie ===============================================
$to = match ($category) {
    'referral', 'capacity', 'insurance' => $PARTNER_TO,
    default                              => $INFO_TO,
};

// === Mail bauen ==============================================================
$labels = [
    'patient'   => 'Patientenanfrage',
    'referral'  => 'Zuweiser-Anfrage',
    'capacity'  => 'Kapazitätsabfrage',
    'insurance' => 'Kassen-Anfrage',
    'general'   => 'Allgemeine Anfrage',
];
$catLabel = $labels[$category] ?? 'Anfrage';

$subjectLine = "[CuraMain] $catLabel" . ($subject !== '' ? " · $subject" : '');

$bodyLines = [
    "Neue Anfrage über curamain.de ($catLabel)",
    str_repeat('=', 60),
    "Name:         $firstName $lastName",
    "E-Mail:       $email",
];
if ($phone !== '')        $bodyLines[] = "Telefon:      $phone";
if ($organization !== '') $bodyLines[] = "Organisation: $organization";
if ($subject !== '')      $bodyLines[] = "Betreff:      $subject";
$bodyLines[] = '';
$bodyLines[] = "Nachricht:";
$bodyLines[] = $message;
$bodyLines[] = '';
$bodyLines[] = str_repeat('-', 60);
$bodyLines[] = "IP:    $ip";
$bodyLines[] = "Datum: " . date('Y-m-d H:i:s T');
$mailBody = implode("\n", $bodyLines);

$headers = [
    "From: CuraMain <$FROM>",
    "Reply-To: $email",
    "X-Mailer: curamain-website",
    "Content-Type: text/plain; charset=UTF-8",
];

$ok = mail($to, $subjectLine, $mailBody, implode("\r\n", $headers));

if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'E-Mail konnte nicht versendet werden.']);
    exit;
}

// Rate-Limit aktualisieren
$attempts[] = $now;
@file_put_contents($rlFile, json_encode(array_values($attempts)), LOCK_EX);

echo json_encode(['success' => true]);
