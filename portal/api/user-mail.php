<?php

declare(strict_types=1);

require_once __DIR__ . '/meeting-mail.php';

function user_welcome_access_button(): string
{
    $url = MEETING_MAIL_BASE_URL . '/portal.html';
    $safeUrl = meeting_mail_escape($url);

    return <<<HTML
          <div style="margin:28px 0 4px;text-align:center">
            <a href="{$safeUrl}" style="display:inline-block;background:#0b8af4;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 30px;border-radius:8px">PRISTUP</a>
          </div>
HTML;
}

function user_welcome_email(array $user, string $password): string
{
    $name = meeting_mail_escape($user['name']);
    $email = meeting_mail_escape($user['email']);
    $company = meeting_mail_escape($user['company_name'] ?: '—');
    $oib = meeting_mail_escape($user['oib'] ?: '—');
    $phone = meeting_mail_escape($user['phone'] ?: '—');
    $safePassword = meeting_mail_escape($password);
    $header = meeting_mail_header('Novaris Tech', 'Dobrodošli u portal');
    $footer = meeting_mail_footer();
    $button = user_welcome_access_button();

    return <<<HTML
<!doctype html>
<html lang="hr">
<body style="margin:0;background:#eef3f8;font-family:Arial,sans-serif;color:#132238">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:36px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
{$header}
        <tr><td style="padding:30px 34px">
          <p style="margin:0 0 22px;color:#657386">Poštovani/a {$name}, zahvaljujemo Vam od srca što ste odabrali baš nas — veseli nas što ćemo surađivati i od danas smo Vam u potpunosti na usluzi.</p>
          <h2 style="margin:0 0 18px;font-size:21px">Vaš pristup portalu</h2>
          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Ime i prezime</td><td style="border-bottom:1px solid #e7edf3"><strong>{$name}</strong></td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Tvrtka</td><td style="border-bottom:1px solid #e7edf3">{$company}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">OIB</td><td style="border-bottom:1px solid #e7edf3">{$oib}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Kontakt telefon</td><td style="border-bottom:1px solid #e7edf3">{$phone}</td></tr>
            <tr><td style="color:#788596;border-bottom:1px solid #e7edf3">Email za prijavu</td><td style="border-bottom:1px solid #e7edf3">{$email}</td></tr>
            <tr><td style="color:#788596">Lozinka</td><td><strong>{$safePassword}</strong></td></tr>
          </table>
          {$button}
        </td></tr>
{$footer}
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
