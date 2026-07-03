<?php

declare(strict_types=1);

require_once __DIR__ . '/meeting-mail.php';

function ticket_category_label(string $category): string
{
    return [
        'it' => 'IT / Infrastruktura',
        'web' => 'Web',
        'security' => 'Sigurnost',
        'support' => 'Računalna podrška',
        'other' => 'Ostalo',
    ][$category] ?? $category;
}

function ticket_priority_label(string $priority): string
{
    return [
        'low' => 'Niska',
        'medium' => 'Srednja',
        'high' => 'Visoka',
        'urgent' => 'Hitno',
    ][$priority] ?? $priority;
}

function ticket_admin_created_email(array $ticket): string
{
    $priorityColors = [
        'low' => '#586679',
        'medium' => '#0874cc',
        'high' => '#9a6214',
        'urgent' => '#b42318',
    ];

    $name = meeting_mail_escape($ticket['user_name']);
    $email = meeting_mail_escape($ticket['user_email']);
    $company = meeting_mail_escape($ticket['user_company_name'] ?: '—');
    $phone = meeting_mail_escape($ticket['user_phone'] ?: '—');
    $title = meeting_mail_escape($ticket['title']);
    $category = meeting_mail_escape(ticket_category_label((string) $ticket['category']));
    $priority = (string) $ticket['priority'];
    $priorityLabel = meeting_mail_escape(ticket_priority_label($priority));
    $priorityColor = $priorityColors[$priority] ?? '#132238';
    $message = meeting_mail_linkify(nl2br(meeting_mail_escape($ticket['message'])));
    $createdDate = (new DateTimeImmutable($ticket['created_at']))->format('d.m.Y.');
    $createdTime = (new DateTimeImmutable($ticket['created_at']))->format('H:i');

    $attachmentsBlock = '';
    if (!empty($ticket['attachments'])) {
        $items = '';
        foreach ($ticket['attachments'] as $attachment) {
            $items .= '<li>' . meeting_mail_escape($attachment['file_name']) . '</li>';
        }
        $attachmentsBlock = '<h2 style="margin:22px 0 10px;font-size:12px;color:#788596;text-transform:uppercase;letter-spacing:.03em">Privitci</h2>'
            . '<ul style="margin:0;padding-left:18px;color:#3c4b5f">' . $items . '</ul>';
    }

    $header = meeting_mail_header('Novaris Tech', 'Novi upit za podršku');
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
          <p style="margin:0 0 22px;color:#657386">Zaprimljen je novi upit za podršku, {$createdDate} u {$createdTime}.</p>
          <h2 style="margin:0 0 18px;font-size:21px">{$title}</h2>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Korisnik</td><td style="border-bottom:1px solid #e7edf3"><strong>{$name}</strong></td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Tvrtka</td><td style="border-bottom:1px solid #e7edf3">{$company}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Email</td><td style="border-bottom:1px solid #e7edf3">{$email}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Telefon</td><td style="border-bottom:1px solid #e7edf3">{$phone}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Kategorija</td><td style="border-bottom:1px solid #e7edf3">{$category}</td></tr>
            <tr><td style="color:#788596">Prioritet</td><td><strong style="color:{$priorityColor}">{$priorityLabel}</strong></td></tr>
          </table>
          <h2 style="margin:22px 0 10px;font-size:12px;color:#788596;text-transform:uppercase;letter-spacing:.03em">Poruka</h2>
          <div style="background:#ebf5ff;border-left:4px solid #1596ff;border-radius:0 8px 8px 0;padding:14px 18px;color:#3c4b5f;line-height:1.6">{$message}</div>
          {$attachmentsBlock}
        </td></tr>
{$footer}
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

function ticket_reply_email(array $ticket, string $replyMessage, string $replierName, bool $isAdminReply): string
{
    $title = meeting_mail_escape($ticket['title']);
    $body = meeting_mail_linkify(nl2br(meeting_mail_escape($replyMessage)));
    $name = meeting_mail_escape($replierName);
    $heading = $isAdminReply ? 'Odgovor na vaš upit' : 'Novi odgovor korisnika';
    $intro = $isAdminReply
        ? 'Novaris Tech je odgovorio na vaš upit'
        : $name . ' je odgovorio/la na upit';
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
          <p style="margin:0 0 22px;color:#657386">{$intro} <strong style="color:#132238">{$title}</strong>.</p>
          <div style="background:#ebf5ff;border-left:4px solid #1596ff;border-radius:0 8px 8px 0;padding:14px 18px;color:#3c4b5f;line-height:1.6">{$body}</div>
        </td></tr>
{$footer}
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
