<?php
/**
 * EINMALIGER MAIL-TEST FÜR ALL-INKL
 *
 * Hochladen nach: /htdocs/api/_mail-test.php
 * Einmal aufrufen: https://www.curamain.de/api/_mail-test.php
 *
 * Du solltest in info@curamain.de eine Test-Mail bekommen.
 * Wenn ja → mail() funktioniert, contact.php und bewerbung.php gehen live.
 * Wenn nein → siehe Hinweise am Ende dieses Skripts.
 *
 * NACH DEM TEST UNBEDINGT WIEDER LÖSCHEN — sonst kann jeder Test-Mails
 * von deinem Server triggern.
 */

declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');

$to      = 'info@curamain.de';
$from    = 'no-reply@curamain.de';
$subject = '[CuraMain] PHP-mail()-Test ' . date('Y-m-d H:i:s');
$body    = "Wenn du diese Mail siehst, kann der All-Inkl-Webspace per PHP mail() versenden.\n\n"
         . "Server:    " . ($_SERVER['SERVER_NAME'] ?? 'unbekannt') . "\n"
         . "PHP:       " . phpversion() . "\n"
         . "Zeit:      " . date('c') . "\n"
         . "Aufrufer:  " . ($_SERVER['REMOTE_ADDR'] ?? 'unbekannt') . "\n";

$headers = implode("\r\n", [
    "From: CuraMain Test <$from>",
    "Reply-To: $from",
    "Content-Type: text/plain; charset=UTF-8",
    "X-Mailer: curamain-mailtest",
]);

$ok = mail($to, $subject, $body, $headers);

echo "Versand-Status: " . ($ok ? "OK (true)" : "FEHLGESCHLAGEN (false)") . "\n";
echo "Empfänger:      $to\n";
echo "Server:         " . ($_SERVER['SERVER_NAME'] ?? 'unbekannt') . "\n";
echo "PHP-Version:    " . phpversion() . "\n";
echo "Zeit:           " . date('c') . "\n";
echo "\n";
echo $ok
    ? "→ Schau in info@curamain.de. Wenn die Mail innerhalb 1-2 Minuten ankommt: alles gut.\n"
    : "→ mail() hat false zurückgegeben. PHP konnte nicht zustellen.\n";
echo "\n";
echo "WICHTIG: Diese Datei nach dem Test wieder löschen!\n";
echo "         (per FileZilla aus /htdocs/api/_mail-test.php entfernen)\n";
echo "\n";
echo "Falls keine Mail ankommt, in dieser Reihenfolge prüfen:\n";
echo "  1. Spam-Ordner von info@curamain.de checken\n";
echo "  2. All-Inkl KAS → 'Tools' → 'Mail-Logs' anschauen\n";
echo "  3. All-Inkl KAS → 'E-Mail' → Postfach info@ existiert + Passwort gesetzt?\n";
echo "  4. Domain curamain.de muss SPF / DKIM bei All-Inkl konfiguriert haben\n";
echo "     (KAS → 'Tools' → 'DNS-Einstellungen' → SPF-Record automatisch erzeugen)\n";
echo "  5. Im Zweifel All-Inkl Support kontaktieren — schnelle Antwortzeiten\n";
