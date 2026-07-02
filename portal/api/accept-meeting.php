<?php

declare(strict_types=1);

require __DIR__ . '/meeting-mail.php';

function render_page(string $title, string $message, bool $ok = true): never
{
    http_response_code($ok ? 200 : 400);
    header('Content-Type: text/html; charset=utf-8');

    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $logoUrl = MEETING_MAIL_LOGO_URL;
    $accentColor = $ok ? '#0b8af4' : '#b42318';

    echo <<<HTML
<!doctype html>
<html lang="hr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{$safeTitle} | Novaris Tech</title>
</head>
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
  <div style="max-width:440px;width:100%;background:#fff;border-radius:14px;padding:38px 34px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.12)">
    <img src="{$logoUrl}" alt="Novaris Tech" width="46" height="46" style="border-radius:10px;margin-bottom:20px">
    <h1 style="margin:0 0 12px;font-size:21px;color:{$accentColor}">{$safeTitle}</h1>
    <p style="margin:0;color:#657386;line-height:1.6">{$safeMessage}</p>
  </div>
</body>
</html>
HTML;
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$token = (string) ($_GET['token'] ?? '');

if (!$id || $token === '') {
    render_page('Neispravna poveznica', 'Ova poveznica za potvrdu sastanka nije ispravna.', false);
}

try {
    $configPath = getenv('NOVARIS_CONFIG') ?: __DIR__ . '/config.php';
    $config = require $configPath;
    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['database']),
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (Throwable $error) {
    render_page('Greška', 'Potvrda trenutačno nije moguća. Pokušajte kasnije ili nas kontaktirajte na info@novaristech.hr.', false);
}

$statement = $pdo->prepare(
    'SELECT meetings.id, meetings.meeting_date, meetings.meeting_time, meetings.accept_token, meetings.client_accepted_at,
            clients.company_name, clients.contact_name
     FROM meetings
     INNER JOIN clients ON clients.id = meetings.client_id
     WHERE meetings.id = :id
     LIMIT 1'
);
$statement->execute(['id' => $id]);
$meeting = $statement->fetch();

if (!$meeting || (string) $meeting['accept_token'] === '' || !hash_equals((string) $meeting['accept_token'], $token)) {
    render_page('Poveznica nije pronađena', 'Ova poveznica za potvrdu sastanka nije ispravna ili je istekla.', false);
}

$date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
$time = substr((string) $meeting['meeting_time'], 0, 5);

if ($meeting['client_accepted_at']) {
    render_page('Već potvrđeno', "Dolazak na sastanak {$date} u {$time} je već potvrđen. Vidimo se uskoro!");
}

$update = $pdo->prepare('UPDATE meetings SET client_accepted_at = NOW() WHERE id = :id AND client_accepted_at IS NULL');
$update->execute(['id' => $id]);

try {
    $contactPath = getenv('NOVARIS_CONTACT') ?: __DIR__ . '/contact.php';
    $smtp = smtp_credentials($contactPath);
    send_smtp(
        $smtp,
        'info@novaristech.hr',
        sprintf('Klijent potvrdio dolazak: %s, %s u %s', $meeting['company_name'], $date, $time),
        meeting_admin_accepted_email($meeting)
    );
} catch (Throwable $error) {
    error_log('Slanje obavijesti o potvrdi sastanka nije uspjelo: ' . $error->getMessage());
}

render_page('Hvala!', "Potvrdili ste dolazak na sastanak {$date} u {$time}. Vidimo se uskoro!");
