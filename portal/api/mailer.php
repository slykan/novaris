<?php

declare(strict_types=1);

function smtp_setting_from_source(string $source, string $name): string
{
    $pattern = "/define\\(\\s*'" . preg_quote($name, '/') . "'\\s*,\\s*(?:'([^']*)'|(\\d+))\\s*\\)/";
    if (!preg_match($pattern, $source, $matches)) {
        throw new RuntimeException("Nije pronađena SMTP postavka {$name}.");
    }
    return $matches[1] !== '' ? $matches[1] : $matches[2];
}

function smtp_credentials(string $contactPath): array
{
    if (!is_file($contactPath)) {
        throw new RuntimeException("Nije pronađena SMTP konfiguracija: {$contactPath}");
    }
    $source = (string) file_get_contents($contactPath);

    return [
        'host' => smtp_setting_from_source($source, 'SMTP_HOST'),
        'port' => (int) smtp_setting_from_source($source, 'SMTP_PORT'),
        'user' => smtp_setting_from_source($source, 'SMTP_USER'),
        'password' => smtp_setting_from_source($source, 'SMTP_PASS'),
    ];
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
