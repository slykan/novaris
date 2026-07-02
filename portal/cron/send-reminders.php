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

require dirname(__DIR__) . '/api/meeting-mail.php';

$root = dirname(__DIR__, 2);
$databaseConfigPath = getenv('NOVARIS_CONFIG') ?: '/home/novaris/public_html/api/config.php';
$contactPath = getenv('NOVARIS_CONTACT') ?: $root . '/public/api/contact.php';

if (!is_file($databaseConfigPath)) {
    fail("Nije pronađena konfiguracija baze: {$databaseConfigPath}");
}

try {
    $smtp = smtp_credentials($contactPath);
} catch (Throwable $error) {
    fail($error->getMessage());
}

$databaseConfig = require $databaseConfigPath;

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

        if (!send_smtp($smtp, 'info@novaristech.hr', $subject, meeting_admin_reminder_email($meeting))) {
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

        if (!send_smtp($smtp, $meeting['email'], $subject, meeting_client_reminder_email($meeting), $meeting['contact_name'])) {
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
