<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'error' => 'Nije dozvoljeno']));
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'Neispravan zahtjev']));
}

// ── Config ─────────────────────────────────────────────────────
define('SMTP_HOST',     'mail.novaristech.hr');
define('SMTP_PORT',     465);
define('SMTP_USER',     'no-reply@novaristech.hr');
define('SMTP_PASS',     'Noreply-01-!!');
define('MAIL_TO',       'info@novaristech.hr');
// Registriraj domenu na https://www.google.com/recaptcha/admin
// i zamijeni donji ključ tajnim (Secret Key):
define('RECAPTCHA_SECRET', '6LcINwotAAAAAIh0Nk4pkmCt0p2Z8xm4o0DwJMuv');

// ── reCAPTCHA provjera ─────────────────────────────────────────
$captcha = trim($body['captcha'] ?? '');
if (!$captcha) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'Molimo riješite CAPTCHA provjeru.']));
}

function verify_captcha(string $token): bool {
    $post = http_build_query(['secret' => RECAPTCHA_SECRET, 'response' => $token]);
    $ctx  = stream_context_create(['http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => $post,
    ]]);
    $res = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $ctx);
    if ($res === false && function_exists('curl_init')) {
        $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $post]);
        $res = curl_exec($ch);
        curl_close($ch);
    }
    return !empty(json_decode((string)$res, true)['success']);
}

if (!verify_captcha($captcha)) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'CAPTCHA provjera nije uspjela. Pokušajte ponovo.']));
}

// ── Validacija ─────────────────────────────────────────────────
function s(string $v): string {
    return htmlspecialchars(trim($v), ENT_QUOTES, 'UTF-8');
}

$ime    = s($body['ime']    ?? '');
$email  = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$tvrtka = s($body['tvrtka'] ?? '');
$oib    = preg_replace('/\D/', '', $body['oib'] ?? '');
$poruka = s($body['poruka'] ?? '');
$kopija = !empty($body['kopija']);

if (!$ime || !$email || !$tvrtka || !$poruka) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'Sva polja su obavezna.']));
}
if (strlen($oib) !== 11) {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'OIB mora sadržavati točno 11 znamenki.']));
}

// ── SMTP slanje ────────────────────────────────────────────────
function smtp_read($sock): string {
    $out = '';
    while ($line = fgets($sock, 512)) {
        $out .= $line;
        if (isset($line[3]) && $line[3] === ' ') break;
    }
    return $out;
}

function smtp_send(string $to, string $toName, string $subject, string $html): bool {
    $sock = @stream_socket_client('ssl://' . SMTP_HOST . ':' . SMTP_PORT, $errno, $errstr, 15);
    if (!$sock) return false;
    stream_set_timeout($sock, 15);

    smtp_read($sock);
    fputs($sock, "EHLO localhost\r\n");        smtp_read($sock);
    fputs($sock, "AUTH LOGIN\r\n");            smtp_read($sock);
    fputs($sock, base64_encode(SMTP_USER) . "\r\n"); smtp_read($sock);
    fputs($sock, base64_encode(SMTP_PASS) . "\r\n");
    $auth = smtp_read($sock);
    if (strpos($auth, '235') === false) { fclose($sock); return false; }

    fputs($sock, 'MAIL FROM:<' . SMTP_USER . ">\r\n"); smtp_read($sock);
    fputs($sock, "RCPT TO:<{$to}>\r\n");               smtp_read($sock);
    fputs($sock, "DATA\r\n");                          smtp_read($sock);

    $from_enc    = '=?UTF-8?B?' . base64_encode('Novaris Tech') . '?=';
    $to_enc      = '=?UTF-8?B?' . base64_encode($toName) . '?=';
    $subject_enc = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    $msg  = "From: {$from_enc} <" . SMTP_USER . ">\r\n";
    $msg .= "To: {$to_enc} <{$to}>\r\n";
    $msg .= "Subject: {$subject_enc}\r\n";
    $msg .= "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n";
    $msg .= chunk_split(base64_encode($html)) . "\r\n.\r\n";

    fputs($sock, $msg);
    smtp_read($sock);
    fputs($sock, "QUIT\r\n");
    fclose($sock);
    return true;
}

// ── Email templati ─────────────────────────────────────────────
function tpl_internal(string $ime, string $email, string $tvrtka, string $oib, string $poruka): string {
    $now   = date('d.m.Y. \u\\ H:i');
    $pmsg  = nl2br($poruka);
    return <<<HTML
<!DOCTYPE html><html lang="hr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#eef3fb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,40,120,.09);">
  <tr><td style="background:linear-gradient(135deg,#006ee6,#004fc4);padding:30px 40px;">
    <p style="margin:0;color:rgba(255,255,255,.7);font-size:11px;text-transform:uppercase;letter-spacing:.1em;">Novaris Tech</p>
    <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">Novi upit s web stranice</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.65);font-size:13px;">{$now}</p>
  </td></tr>
  <tr><td style="padding:32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:10px 0 12px;border-bottom:1px solid #edf2f9;">
        <p style="margin:0;font-size:11px;color:#8fa3be;text-transform:uppercase;letter-spacing:.07em;">Ime i prezime</p>
        <p style="margin:5px 0 0;font-size:16px;color:#0d1e3a;font-weight:600;">{$ime}</p>
      </td></tr>
      <tr><td style="padding:10px 0 12px;border-bottom:1px solid #edf2f9;">
        <p style="margin:0;font-size:11px;color:#8fa3be;text-transform:uppercase;letter-spacing:.07em;">E-mail adresa</p>
        <p style="margin:5px 0 0;font-size:16px;font-weight:600;"><a href="mailto:{$email}" style="color:#1596ff;text-decoration:none;">{$email}</a></p>
      </td></tr>
      <tr><td style="padding:10px 0 12px;border-bottom:1px solid #edf2f9;">
        <p style="margin:0;font-size:11px;color:#8fa3be;text-transform:uppercase;letter-spacing:.07em;">Naziv tvrtke</p>
        <p style="margin:5px 0 0;font-size:16px;color:#0d1e3a;font-weight:600;">{$tvrtka}</p>
      </td></tr>
      <tr><td style="padding:10px 0 12px;border-bottom:1px solid #edf2f9;">
        <p style="margin:0;font-size:11px;color:#8fa3be;text-transform:uppercase;letter-spacing:.07em;">OIB tvrtke</p>
        <p style="margin:5px 0 0;font-size:16px;color:#0d1e3a;font-weight:600;">{$oib}</p>
      </td></tr>
      <tr><td style="padding:10px 0 0;">
        <p style="margin:0;font-size:11px;color:#8fa3be;text-transform:uppercase;letter-spacing:.07em;">Poruka</p>
        <div style="margin:8px 0 0;font-size:15px;color:#3a4d6a;line-height:1.75;">{$pmsg}</div>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#eef3fb;padding:16px 40px;border-top:1px solid #e3ecf7;">
    <p style="margin:0;font-size:12px;color:#8fa3be;">Primljeno s <strong style="color:#5a7a9a;">novaristech.hr</strong></p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>
HTML;
}

function tpl_confirm(string $ime, string $poruka): string {
    $pmsg = nl2br($poruka);
    return <<<HTML
<!DOCTYPE html><html lang="hr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#eef3fb;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,40,120,.09);">
  <tr><td style="background:linear-gradient(135deg,#020913,#081c3a);padding:36px 40px;text-align:center;">
    <p style="margin:0;color:#1596ff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;">Novaris Tech</p>
    <h1 style="margin:12px 0 8px;color:#fff;font-size:26px;font-weight:800;">Hvala na upitu, {$ime}!</h1>
    <p style="margin:0;color:rgba(255,255,255,.6);font-size:15px;">Vaša poruka je uspješno zaprimljena.</p>
  </td></tr>
  <tr><td style="padding:32px 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:#ebf5ff;border-left:4px solid #1596ff;border-radius:0 8px 8px 0;padding:16px 20px;">
        <p style="margin:0;font-size:11px;color:#1596ff;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Očekivano vrijeme odgovora</p>
        <p style="margin:6px 0 3px;font-size:26px;font-weight:800;color:#0d1e3a;">Unutar 1 sata</p>
        <p style="margin:0;font-size:13px;color:#5a7a9a;">Javit ćemo Vam se na e-mail adresu koju ste naveli u upitu.</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:0 40px 32px;">
    <p style="margin:0 0 12px;font-size:11px;color:#8fa3be;text-transform:uppercase;font-weight:700;letter-spacing:.07em;">Vaša poruka</p>
    <div style="background:#f5f8ff;border:1px solid #dce8f5;border-radius:8px;padding:20px;font-size:15px;color:#3a4d6a;line-height:1.8;">{$pmsg}</div>
  </td></tr>
  <tr><td style="background:#020913;padding:28px 40px;">
    <p style="margin:0 0 4px;color:#1596ff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">NOVARIS TECH d.o.o.</p>
    <p style="margin:0 0 2px;color:rgba(255,255,255,.55);font-size:13px;">Reisnerova ulica 91A, 31000 Osijek, Hrvatska</p>
    <p style="margin:0 0 2px;color:rgba(255,255,255,.55);font-size:13px;">OIB: 23096866887 &nbsp;&bull;&nbsp; info@novaristech.hr</p>
    <p style="margin:16px 0 0;font-size:11px;color:rgba(255,255,255,.3);">Ovaj e-mail je automatski generiran. Molimo ne odgovarajte na ovu poruku.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>
HTML;
}

// ── Slanje ─────────────────────────────────────────────────────
$ok = smtp_send(
    MAIL_TO, 'Novaris Tech Info',
    'Novi upit: ' . $ime . ' – ' . $tvrtka,
    tpl_internal($ime, $email, $tvrtka, $oib, $poruka)
);

if (!$ok) {
    http_response_code(500);
    exit(json_encode(['ok' => false, 'error' => 'Greška pri slanju. Pokušajte ponovo ili pišite na info@novaristech.hr']));
}

if ($kopija) {
    @smtp_send($email, $ime, 'Hvala na upitu – Novaris Tech', tpl_confirm($ime, $poruka));
}

echo json_encode(['ok' => true]);
