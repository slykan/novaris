<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$user = require_user();

$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) {
    respond(['message' => 'Privitak ne postoji.'], 404);
}

$statement = database()->prepare(
    'SELECT ticket_attachments.file_name, ticket_attachments.file_path, ticket_attachments.mime_type,
            tickets.created_by
     FROM ticket_attachments
     INNER JOIN tickets ON tickets.id = ticket_attachments.ticket_id
     WHERE ticket_attachments.id = :id'
);
$statement->execute(['id' => $id]);
$attachment = $statement->fetch();

if (!$attachment) {
    respond(['message' => 'Privitak ne postoji.'], 404);
}
if ($user['role'] !== 'admin' && (int) $attachment['created_by'] !== $user['id']) {
    respond(['message' => 'Nemate pristup ovom privitku.'], 403);
}

$path = dirname(__DIR__) . '/uploads/tickets/' . $attachment['file_path'];
if (!is_file($path)) {
    respond(['message' => 'Datoteka nije pronađena.'], 404);
}

$safeName = str_replace('"', '', $attachment['file_name']);
header('Content-Type: ' . ($attachment['mime_type'] ?: 'application/octet-stream'));
header('Content-Disposition: attachment; filename="' . $safeName . '"; filename*=UTF-8\'\'' . rawurlencode($attachment['file_name']));
header('Content-Length: ' . filesize($path));
header('Cache-Control: private, max-age=0, must-revalidate');
readfile($path);
exit;
