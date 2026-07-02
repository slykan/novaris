<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

date_default_timezone_set('Europe/Zagreb');

$lock = fopen(sys_get_temp_dir() . '/novaris-meeting-reminders.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    fwrite(STDOUT, "Podsjetnici se već obrađuju.\n");
    exit;
}

function fail(string $message): never
{
    fwrite(STDERR, $message . "\n");
    exit(1);
}

function contact_setting(string $source, string $name): string
{
    $pattern = "/define\\(\\s*'" . preg_quote($name, '/') . "'\\s*,\\s*(?:'([^']*)'|(\\d+))\\s*\\)/";
    if (!preg_match($pattern, $source, $matches)) {
        fail("Nije pronađena SMTP postavka {$name}.");
    }
    return $matches[1] !== '' ? $matches[1] : $matches[2];
}

function smtp_read_response($socket): string
{
    $response = '';
    while (($line = fgets($socket, 512)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $response;
}

function smtp_command($socket, string $command, array $expectedCodes): bool
{
    fwrite($socket, $command . "\r\n");
    $response = smtp_read_response($socket);
    return in_array(substr($response, 0, 3), $expectedCodes, true);
}

function send_smtp(array $smtp, string $to, string $subject, string $html, string $toName = 'Novaris Tech'): bool
{
    $socket = @stream_socket_client(
        'ssl://' . $smtp['host'] . ':' . $smtp['port'],
        $errorNumber,
        $errorMessage,
        20
    );
    if (!$socket) {
        return false;
    }
    stream_set_timeout($socket, 20);

    if (substr(smtp_read_response($socket), 0, 3) !== '220'
        || !smtp_command($socket, 'EHLO novaristech.hr', ['250'])
        || !smtp_command($socket, 'AUTH LOGIN', ['334'])
        || !smtp_command($socket, base64_encode($smtp['user']), ['334'])
        || !smtp_command($socket, base64_encode($smtp['password']), ['235'])
        || !smtp_command($socket, 'MAIL FROM:<' . $smtp['user'] . '>', ['250'])
        || !smtp_command($socket, 'RCPT TO:<' . $to . '>', ['250', '251'])
        || !smtp_command($socket, 'DATA', ['354'])) {
        fclose($socket);
        return false;
    }

    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedToName = '=?UTF-8?B?' . base64_encode($toName) . '?=';
    $message = "From: Novaris Tech <{$smtp['user']}>\r\n";
    $message .= "To: {$encodedToName} <{$to}>\r\n";
    $message .= "Subject: {$encodedSubject}\r\n";
    $message .= "MIME-Version: 1.0\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= chunk_split(base64_encode($html)) . "\r\n.";

    $sent = smtp_command($socket, $message, ['250']);
    smtp_command($socket, 'QUIT', ['221']);
    fclose($socket);
    return $sent;
}

function reminder_email(array $meeting): string
{
    $escape = static fn (?string $value): string =>
        htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

    $company = $escape($meeting['company_name']);
    $contact = $escape($meeting['contact_name']);
    $email = $escape($meeting['email']);
    $phone = $escape($meeting['phone'] ?: '—');
    $notes = nl2br($escape($meeting['meeting_notes'] ?: '—'));
    $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
    $time = substr((string) $meeting['meeting_time'], 0, 5);
    $duration = $escape([
        '30m' => '30 min',
        '1h' => '1 h',
        '2h' => '2 h',
        'as_needed' => 'Po potrebi',
    ][$meeting['duration']] ?? $meeting['duration']);

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:28px 34px;background:#06172a;color:#fff">
          <div style="color:#20aaff;font-size:12px;font-weight:bold;text-transform:uppercase">Novaris Tech</div>
          <h1 style="margin:8px 0 0;font-size:24px">Podsjetnik za sastanak</h1>
        </td></tr>
        <tr><td style="padding:30px 34px">
          <p style="margin:0 0 22px;color:#657386">Planirani sastanak je <strong style="color:#132238">{$date} u {$time}</strong>.</p>
          <h2 style="margin:0 0 18px;font-size:21px">{$company}</h2>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Kontakt osoba</td><td style="border-bottom:1px solid #e7edf3"><strong>{$contact}</strong></td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Telefon</td><td style="border-bottom:1px solid #e7edf3">{$phone}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Email</td><td style="border-bottom:1px solid #e7edf3">{$email}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Trajanje</td><td style="border-bottom:1px solid #e7edf3">{$duration}</td></tr>
            <tr><td style="color:#788596;vertical-align:top">Bilješke</td><td>{$notes}</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function client_reminder_email(array $meeting): string
{
    $escape = static fn (?string $value): string =>
        htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

    $contact = $escape($meeting['contact_name']);
    $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
    $time = substr((string) $meeting['meeting_time'], 0, 5);
    $duration = $escape([
        '30m' => '30 min',
        '1h' => '1 h',
        '2h' => '2 h',
        'as_needed' => 'Po potrebi',
    ][$meeting['duration']] ?? $meeting['duration']);
    $notesText = trim((string) $meeting['meeting_notes']);
    $notesBlock = $notesText === '' ? '' : (
        '<p style="margin:22px 0 0;color:#657386">Napomena: ' . nl2br($escape($notesText)) . '</p>'
    );

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:28px 34px;background:#06172a;color:#fff">
          <div style="color:#20aaff;font-size:12px;font-weight:bold;text-transform:uppercase">Novaris Tech</div>
          <h1 style="margin:8px 0 0;font-size:24px">Podsjetnik za sastanak</h1>
        </td></tr>
        <tr><td style="padding:30px 34px">
          <p style="margin:0;color:#657386">Poštovani/a {$contact}, podsjećamo vas na sastanak s Novaris Tech zakazan za <strong style="color:#132238">{$date} u {$time}</strong> (trajanje: {$duration}).</p>
          {$notesBlock}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

$root = dirname(__DIR__, 2);
$databaseConfigPath = getenv('NOVARIS_CONFIG') ?: '/home/novaris/public_html/api/config.php';
$contactPath = getenv('NOVARIS_CONTACT') ?: $root . '/public/api/contact.php';

if (!is_file($databaseConfigPath)) {
    fail("Nije pronađena konfiguracija baze: {$databaseConfigPath}");
}
if (!is_file($contactPath)) {
    fail("Nije pronađena SMTP konfiguracija: {$contactPath}");
}

$databaseConfig = require $databaseConfigPath;
$contactSource = (string) file_get_contents($contactPath);
$smtp = [
    'host' => contact_setting($contactSource, 'SMTP_HOST'),
    'port' => (int) contact_setting($contactSource, 'SMTP_PORT'),
    'user' => contact_setting($contactSource, 'SMTP_USER'),
    'password' => contact_setting($contactSource, 'SMTP_PASS'),
];

try {
    $pdo = new PDO(
        sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            $databaseConfig['host'],
            $databaseConfig['database']
        ),
        $databaseConfig['username'],
        $databaseConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    $pdo->exec("SET time_zone = '" . date('P') . "'");

    $meetings = $pdo->query(
        "SELECT meetings.id, meetings.meeting_date, meetings.meeting_time, meetings.duration,
                meetings.notes AS meeting_notes, clients.company_name,
                clients.contact_name, clients.phone, clients.email
         FROM meetings
         INNER JOIN clients ON clients.id = meetings.client_id
         WHERE meetings.reminder_enabled = 1
           AND meetings.reminder_sent_at IS NULL
           AND TIMESTAMP(meetings.meeting_date, meetings.meeting_time) > NOW()
           AND CASE meetings.reminder_offset
                 WHEN '1h' THEN TIMESTAMP(meetings.meeting_date, meetings.meeting_time) - INTERVAL 1 HOUR
                 WHEN '5h' THEN TIMESTAMP(meetings.meeting_date, meetings.meeting_time) - INTERVAL 5 HOUR
                 WHEN '1d' THEN TIMESTAMP(meetings.meeting_date, meetings.meeting_time) - INTERVAL 1 DAY
               END <= NOW()
         ORDER BY meetings.meeting_date, meetings.meeting_time"
    )->fetchAll();

    $markSent = $pdo->prepare('UPDATE meetings SET reminder_sent_at = NOW() WHERE id = :id AND reminder_sent_at IS NULL');
    $sentCount = 0;

    foreach ($meetings as $meeting) {
        $subject = sprintf(
            'Podsjetnik: %s, %s u %s',
            $meeting['company_name'],
            (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.'),
            substr((string) $meeting['meeting_time'], 0, 5)
        );

        if (!send_smtp($smtp, 'info@novaristech.hr', $subject, reminder_email($meeting))) {
            fwrite(STDERR, "Slanje podsjetnika za sastanak #{$meeting['id']} nije uspjelo.\n");
            continue;
        }

        $markSent->execute(['id' => $meeting['id']]);
        $sentCount++;
    }

    $clientMeetings = $pdo->query(
        "SELECT meetings.id, meetings.meeting_date, meetings.meeting_time, meetings.duration,
                meetings.notes AS meeting_notes, clients.company_name,
                clients.contact_name, clients.phone, clients.email
         FROM meetings
         INNER JOIN clients ON clients.id = meetings.client_id
         WHERE meetings.client_reminder_enabled = 1
           AND meetings.client_reminder_sent_at IS NULL
           AND TIMESTAMP(meetings.meeting_date, meetings.meeting_time) > NOW()
           AND CASE meetings.client_reminder_offset
                 WHEN '1h' THEN TIMESTAMP(meetings.meeting_date, meetings.meeting_time) - INTERVAL 1 HOUR
                 WHEN '5h' THEN TIMESTAMP(meetings.meeting_date, meetings.meeting_time) - INTERVAL 5 HOUR
                 WHEN '1d' THEN TIMESTAMP(meetings.meeting_date, meetings.meeting_time) - INTERVAL 1 DAY
               END <= NOW()
         ORDER BY meetings.meeting_date, meetings.meeting_time"
    )->fetchAll();

    $markClientSent = $pdo->prepare('UPDATE meetings SET client_reminder_sent_at = NOW() WHERE id = :id AND client_reminder_sent_at IS NULL');
    $clientSentCount = 0;

    foreach ($clientMeetings as $meeting) {
        if (!filter_var($meeting['email'], FILTER_VALIDATE_EMAIL)) {
            fwrite(STDERR, "Preskočen podsjetnik klijentu za sastanak #{$meeting['id']}: neispravan email.\n");
            continue;
        }

        $subject = sprintf(
            'Podsjetnik za sastanak: %s u %s',
            (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.'),
            substr((string) $meeting['meeting_time'], 0, 5)
        );

        if (!send_smtp($smtp, $meeting['email'], $subject, client_reminder_email($meeting), $meeting['contact_name'])) {
            fwrite(STDERR, "Slanje podsjetnika klijentu za sastanak #{$meeting['id']} nije uspjelo.\n");
            continue;
        }

        $markClientSent->execute(['id' => $meeting['id']]);
        $clientSentCount++;
    }

    fwrite(STDOUT, "Poslano podsjetnika: {$sentCount}, klijentima: {$clientSentCount}\n");
} catch (Throwable $error) {
    fail('Obrada podsjetnika nije uspjela: ' . $error->getMessage());
}
