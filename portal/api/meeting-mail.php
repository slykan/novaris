<?php

declare(strict_types=1);

require_once __DIR__ . '/mailer.php';

function meeting_duration_label(string $duration): string
{
    return [
        '30m' => '30 min',
        '1h' => '1 h',
        '2h' => '2 h',
        'as_needed' => 'Po potrebi',
    ][$duration] ?? $duration;
}

function meeting_admin_email(array $meeting, string $eyebrow, string $heading, string $intro): string
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
    $duration = $escape(meeting_duration_label((string) $meeting['duration']));

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:28px 34px;background:#06172a;color:#fff">
          <div style="color:#20aaff;font-size:12px;font-weight:bold;text-transform:uppercase">{$eyebrow}</div>
          <h1 style="margin:8px 0 0;font-size:24px">{$heading}</h1>
        </td></tr>
        <tr><td style="padding:30px 34px">
          <p style="margin:0 0 22px;color:#657386">{$intro} <strong style="color:#132238">{$date} u {$time}</strong>.</p>
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

function meeting_client_email(array $meeting, string $heading, string $intro): string
{
    $escape = static fn (?string $value): string =>
        htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

    $contact = $escape($meeting['contact_name']);
    $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
    $time = substr((string) $meeting['meeting_time'], 0, 5);
    $duration = $escape(meeting_duration_label((string) $meeting['duration']));
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
          <h1 style="margin:8px 0 0;font-size:24px">{$heading}</h1>
        </td></tr>
        <tr><td style="padding:30px 34px">
          <p style="margin:0;color:#657386">Poštovani/a {$contact}, {$intro} <strong style="color:#132238">{$date} u {$time}</strong> (trajanje: {$duration}).</p>
          {$notesBlock}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function meeting_admin_created_email(array $meeting): string
{
    return meeting_admin_email($meeting, 'Novaris Tech', 'Novi sastanak zakazan', 'Novi sastanak je zakazan za');
}

function meeting_admin_reminder_email(array $meeting): string
{
    return meeting_admin_email($meeting, 'Novaris Tech', 'Podsjetnik za sastanak', 'Planirani sastanak je');
}

function meeting_client_created_email(array $meeting): string
{
    return meeting_client_email($meeting, 'Sastanak potvrđen', 'vaš sastanak s Novaris Tech je zakazan za');
}

function meeting_client_reminder_email(array $meeting): string
{
    return meeting_client_email($meeting, 'Podsjetnik za sastanak', 'podsjećamo vas na sastanak s Novaris Tech zakazan za');
}
