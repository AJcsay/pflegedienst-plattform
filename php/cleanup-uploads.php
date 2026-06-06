<?php
/**
 * CuraMain – Aufräum-Skript für Bewerbungs-Uploads (DSGVO-Löschfrist).
 *
 * Löscht Lebenslauf-Dateien in /uploads/bewerbungen/, die älter als die
 * Aufbewahrungsfrist sind. Setzt die in der Datenschutzerklärung zugesagte
 * Löschung nach ~6 Monaten technisch um.
 *
 * Aufruf per Cronjob im All-Inkl-KAS (empfohlen: täglich):
 *   CLI:  /usr/bin/php /www/htdocs/<konto>/curamain.de/api/cleanup-uploads.php
 *   URL:  https://www.curamain.de/api/cleanup-uploads.php?token=<GEHEIM>
 *
 * WICHTIG: $CRON_TOKEN unten vor dem Deploy auf einen geheimen Wert setzen
 * und denselben Wert im URL-Cron verwenden. CLI-Aufrufe (Cron) sind ohne
 * Token erlaubt; Web-Aufrufe ohne gültigen Token werden mit 403 abgewiesen.
 */
declare(strict_types=1);

$UPLOAD_DIR     = __DIR__ . '/../uploads/bewerbungen';
$RETENTION_DAYS = 183;                 // ~6 Monate (Zusage in der Datenschutzerklärung)
$ALLOWED_EXT    = ['pdf', 'doc', 'docx'];
$CRON_TOKEN     = 'BITTE-AENDERN-geheimer-cron-token'; // <-- vor Deploy ersetzen

// Web-Aufruf benötigt gültigen Token; CLI (Cron) ist immer erlaubt.
$isCli = (PHP_SAPI === 'cli');
if (!$isCli) {
    header('Content-Type: text/plain; charset=utf-8');
    $token = (string) ($_GET['token'] ?? '');
    if ($CRON_TOKEN === 'BITTE-AENDERN-geheimer-cron-token' || !hash_equals($CRON_TOKEN, $token)) {
        http_response_code(403);
        echo "Forbidden";
        exit;
    }
}

if (!is_dir($UPLOAD_DIR)) {
    echo "Kein Upload-Verzeichnis vorhanden – nichts zu tun.\n";
    exit;
}

$cutoff  = time() - $RETENTION_DAYS * 86400;
$deleted = 0;
$kept    = 0;
foreach (scandir($UPLOAD_DIR) ?: [] as $name) {
    if ($name === '.' || $name === '..') continue;
    $path = "$UPLOAD_DIR/$name";
    if (!is_file($path)) continue;
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, $ALLOWED_EXT, true)) continue; // nur CV-Dateitypen anfassen
    if (filemtime($path) < $cutoff) {
        if (@unlink($path)) {
            $deleted++;
        }
    } else {
        $kept++;
    }
}

echo "CuraMain Upload-Cleanup: {$deleted} gelöscht (älter als {$RETENTION_DAYS} Tage), {$kept} behalten.\n";
