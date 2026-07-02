<?php

declare(strict_types=1);

require_once __DIR__ . '/mailer.php';

const MEETING_MAIL_LOGO_URL = 'https://novaristech.hr/logo3_small.png';

function meeting_duration_label(string $duration): string
{
    return [
        '30m' => '30 min',
        '1h' => '1 h',
        '2h' => '2 h',
        'as_needed' => 'Po potrebi',
    ][$duration] ?? $duration;
}

function meeting_mail_escape(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function meeting_mail_linkify(string $escapedHtml): string
{
    return preg_replace(
        '#(https?://[^\s<]+)#i',
        '<a href="$1" style="color:#1596ff;text-decoration:underline">$1</a>',
        $escapedHtml
    );
}

function meeting_mail_header(string $eyebrow, string $heading): string
{
    $logoUrl = MEETING_MAIL_LOGO_URL;

    return <<<HTML
        <tr><td style="padding:28px 34px;background:#06172a;color:#fff">
          <img src="{$logoUrl}" alt="Novaris Tech" width="42" height="42" style="display:block;margin-bottom:16px;border-radius:9px">
          <div style="color:#20aaff;font-size:12px;font-weight:bold;text-transform:uppercase">{$eyebrow}</div>
          <h1 style="margin:8px 0 0;font-size:24px;color:#fff">{$heading}</h1>
        </td></tr>
HTML;
}

function meeting_mail_footer(): string
{
    return <<<HTML
        <tr><td style="background:#020913;padding:22px 34px">
          <p style="margin:0 0 4px;color:#1596ff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">NOVARIS TECH d.o.o.</p>
          <p style="margin:0;color:rgba(255,255,255,.55);font-size:12px">Reisnerova ulica 91A, 31000 Osijek &bull; info@novaristech.hr</p>
        </td></tr>
HTML;
}

function meeting_admin_email(array $meeting, string $eyebrow, string $heading, string $intro): string
{
    $company = meeting_mail_escape($meeting['company_name']);
    $contact = meeting_mail_escape($meeting['contact_name']);
    $email = meeting_mail_escape($meeting['email']);
    $phone = meeting_mail_escape($meeting['phone'] ?: '—');
    $notes = meeting_mail_linkify(nl2br(meeting_mail_escape($meeting['meeting_notes'] ?: '—')));
    $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
    $time = substr((string) $meeting['meeting_time'], 0, 5);
    $duration = meeting_mail_escape(meeting_duration_label((string) $meeting['duration']));
    $header = meeting_mail_header($eyebrow, $heading);
    $footer = meeting_mail_footer();

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
{$header}
        <tr><td style="padding:30px 34px">
          <p style="margin:0 0 22px;color:#657386">{$intro} <strong style="color:#132238">{$date} u {$time}</strong>.</p>
          <h2 style="margin:0 0 18px;font-size:21px">{$company}</h2>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Kontakt osoba</td><td style="border-bottom:1px solid #e7edf3"><strong>{$contact}</strong></td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Telefon</td><td style="border-bottom:1px solid #e7edf3">{$phone}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Email</td><td style="border-bottom:1px solid #e7edf3">{$email}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Trajanje</td><td style="border-bottom:1px solid #e7edf3">{$duration}</td></tr>
          </table>
          <h2 style="margin:22px 0 10px;font-size:12px;color:#788596;text-transform:uppercase;letter-spacing:.03em">Bilješke</h2>
          <div style="background:#ebf5ff;border-left:4px solid #1596ff;border-radius:0 8px 8px 0;padding:14px 18px;color:#3c4b5f;line-height:1.6">{$notes}</div>
        </td></tr>
{$footer}
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function meeting_client_email(array $meeting, string $heading, string $intro): string
{
    $contact = meeting_mail_escape($meeting['contact_name']);
    $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
    $time = substr((string) $meeting['meeting_time'], 0, 5);
    $duration = meeting_mail_escape(meeting_duration_label((string) $meeting['duration']));
    $notesText = trim((string) $meeting['meeting_notes']);
    $notesBlock = $notesText === '' ? '' : (
        '<h2 style="margin:22px 0 10px;font-size:12px;color:#788596;text-transform:uppercase;letter-spacing:.03em">Bilješke</h2>'
        . '<div style="background:#ebf5ff;border-left:4px solid #1596ff;border-radius:0 8px 8px 0;padding:14px 18px;color:#3c4b5f;line-height:1.6">'
        . meeting_mail_linkify(nl2br(meeting_mail_escape($notesText)))
        . '</div>'
    );
    $header = meeting_mail_header('Novaris Tech', $heading);
    $footer = meeting_mail_footer();

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
{$header}
        <tr><td style="padding:30px 34px">
          <p style="margin:0;color:#657386">Poštovani/a {$contact}, {$intro} <strong style="color:#132238">{$date} u {$time}</strong> (trajanje: {$duration}).</p>
          {$notesBlock}
        </td></tr>
{$footer}
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

function meeting_admin_rescheduled_email(array $meeting): string
{
    return meeting_admin_email($meeting, 'Novaris Tech', 'Izmjena termina sastanka', 'Termin sastanka je promijenjen na');
}

function meeting_client_rescheduled_email(array $meeting): string
{
    return meeting_client_email($meeting, 'Izmjena termina sastanka', 'vaš sastanak s Novaris Tech je pomaknut na');
}

function meeting_status_label(string $status): string
{
    return [
        'agreed' => 'Dogovoreno',
        'cancelled' => 'Odustajemo',
        'follow_up' => 'Nastavak',
    ][$status] ?? $status;
}

function meeting_admin_outcome_email(array $meeting): string
{
    $statusColors = [
        'agreed' => '#19704d',
        'cancelled' => '#b42318',
        'follow_up' => '#9a6214',
    ];

    $company = meeting_mail_escape($meeting['company_name']);
    $contact = meeting_mail_escape($meeting['contact_name']);
    $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
    $time = substr((string) $meeting['meeting_time'], 0, 5);
    $status = (string) $meeting['status'];
    $statusLabel = meeting_mail_escape(meeting_status_label($status));
    $statusColor = $statusColors[$status] ?? '#132238';
    $outcomeNotes = meeting_mail_linkify(nl2br(meeting_mail_escape($meeting['outcome_notes'] ?: '—')));
    $header = meeting_mail_header('Novaris Tech', 'Ishod sastanka');
    $footer = meeting_mail_footer();

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
{$header}
        <tr><td style="padding:30px 34px">
          <p style="margin:0 0 22px;color:#657386">Sastanak s <strong style="color:#132238">{$company}</strong> ({$date} u {$time}, kontakt: {$contact}) označen je kao <strong style="color:{$statusColor}">{$statusLabel}</strong>.</p>
          <h2 style="margin:0 0 10px;font-size:12px;color:#788596;text-transform:uppercase;letter-spacing:.03em">Bilješka</h2>
          <div style="background:#ebf5ff;border-left:4px solid #1596ff;border-radius:0 8px 8px 0;padding:14px 18px;color:#3c4b5f;line-height:1.6">{$outcomeNotes}</div>
        </td></tr>
{$footer}
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
