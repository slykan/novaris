<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ticket-mail.php';
$user = require_user();

const TICKET_CATEGORIES = ['it', 'web', 'security', 'support', 'other'];
const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];
const TICKET_MAX_FILES = 5;
const TICKET_MAX_FILE_SIZE = 10 * 1024 * 1024;
const TICKET_ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'];

function ticket_upload_dir(): string
{
    return dirname(__DIR__) . '/uploads/tickets';
}

function notify_ticket_created(array $ticket): void
{
    try {
        $contactPath = getenv('NOVARIS_CONTACT') ?: __DIR__ . '/contact.php';
        $smtp = smtp_credentials($contactPath);
        send_smtp(
            $smtp,
            'info@novaristech.hr',
            sprintf('Novi upit za podršku: %s (%s)', $ticket['title'], ticket_priority_label((string) $ticket['priority'])),
            ticket_admin_created_email($ticket)
        );
    } catch (Throwable $error) {
        error_log('Slanje obavijesti o upitu nije uspjelo: ' . $error->getMessage());
    }
}

function notify_ticket_reply(array $ticket, string $replyMessage, array $replier): void
{
    $isAdminReply = $replier['role'] === 'admin';

    try {
        $contactPath = getenv('NOVARIS_CONTACT') ?: __DIR__ . '/contact.php';
        $smtp = smtp_credentials($contactPath);

        if ($isAdminReply) {
            if (filter_var($ticket['user_email'], FILTER_VALIDATE_EMAIL)) {
                send_smtp(
                    $smtp,
                    $ticket['user_email'],
                    sprintf('Odgovor na upit: %s', $ticket['title']),
                    ticket_reply_email($ticket, $replyMessage, $replier['name'], true),
                    $ticket['user_name']
                );
            }
        } else {
            send_smtp(
                $smtp,
                'info@novaristech.hr',
                sprintf('Novi odgovor na upit: %s (%s)', $ticket['title'], $replier['name']),
                ticket_reply_email($ticket, $replyMessage, $replier['name'], false)
            );
        }
    } catch (Throwable $error) {
        error_log('Slanje obavijesti o odgovoru nije uspjelo: ' . $error->getMessage());
    }
}

function ticket_replies(int $ticketId): array
{
    $statement = database()->prepare(
        'SELECT ticket_replies.id, ticket_replies.message, ticket_replies.created_at,
                users.id AS user_id, users.name AS user_name, users.role AS user_role
         FROM ticket_replies
         INNER JOIN users ON users.id = ticket_replies.user_id
         WHERE ticket_replies.ticket_id = :id
         ORDER BY ticket_replies.id ASC'
    );
    $statement->execute(['id' => $ticketId]);
    return $statement->fetchAll();
}

function ticket_attachments(int $ticketId): array
{
    $statement = database()->prepare(
        'SELECT id, file_name, file_size, mime_type, created_at FROM ticket_attachments WHERE ticket_id = :id ORDER BY id ASC'
    );
    $statement->execute(['id' => $ticketId]);
    return $statement->fetchAll();
}

function ticket_row(int $id): array|false
{
    $statement = database()->prepare(
        'SELECT tickets.id, tickets.title, tickets.message, tickets.category, tickets.priority, tickets.status,
                tickets.created_at, tickets.updated_at,
                users.id AS user_id, users.name AS user_name, users.email AS user_email,
                users.company_name AS user_company_name, users.oib AS user_oib, users.phone AS user_phone
         FROM tickets
         INNER JOIN users ON users.id = tickets.created_by
         WHERE tickets.id = :id'
    );
    $statement->execute(['id' => $id]);
    $ticket = $statement->fetch();
    if ($ticket) {
        $ticket['attachments'] = ticket_attachments($id);
        $ticket['replies'] = ticket_replies($id);
    }
    return $ticket;
}

function normalize_uploaded_files(array $filesField): array
{
    if (!isset($filesField['name'])) {
        return [];
    }
    if (!is_array($filesField['name'])) {
        return $filesField['name'] === '' ? [] : [$filesField];
    }

    $normalized = [];
    foreach ($filesField['name'] as $index => $name) {
        if ($name === '') {
            continue;
        }
        $normalized[] = [
            'name' => $name,
            'type' => $filesField['type'][$index] ?? '',
            'tmp_name' => $filesField['tmp_name'][$index] ?? '',
            'error' => $filesField['error'][$index] ?? UPLOAD_ERR_NO_FILE,
            'size' => $filesField['size'][$index] ?? 0,
        ];
    }
    return $normalized;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($user['role'] === 'admin') {
        $statement = database()->query(
            'SELECT tickets.id, tickets.title, tickets.message, tickets.category, tickets.priority, tickets.status,
                    tickets.created_at, tickets.updated_at,
                    users.id AS user_id, users.name AS user_name, users.email AS user_email,
                    users.company_name AS user_company_name, users.oib AS user_oib, users.phone AS user_phone
             FROM tickets
             INNER JOIN users ON users.id = tickets.created_by
             ORDER BY tickets.created_at DESC, tickets.id DESC'
        );
        $tickets = $statement->fetchAll();
    } else {
        $statement = database()->prepare(
            'SELECT tickets.id, tickets.title, tickets.message, tickets.category, tickets.priority, tickets.status,
                    tickets.created_at, tickets.updated_at,
                    users.id AS user_id, users.name AS user_name, users.email AS user_email,
                    users.company_name AS user_company_name, users.oib AS user_oib, users.phone AS user_phone
             FROM tickets
             INNER JOIN users ON users.id = tickets.created_by
             WHERE tickets.created_by = :id
             ORDER BY tickets.created_at DESC, tickets.id DESC'
        );
        $statement->execute(['id' => $user['id']]);
        $tickets = $statement->fetchAll();
    }

    if ($tickets) {
        $ids = array_column($tickets, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $attachmentStatement = database()->prepare(
            "SELECT id, ticket_id, file_name, file_size, mime_type FROM ticket_attachments WHERE ticket_id IN ($placeholders) ORDER BY id ASC"
        );
        $attachmentStatement->execute($ids);
        $attachmentsByTicket = [];
        foreach ($attachmentStatement->fetchAll() as $attachment) {
            $attachmentsByTicket[$attachment['ticket_id']][] = $attachment;
        }

        $replyStatement = database()->prepare(
            "SELECT ticket_replies.id, ticket_replies.ticket_id, ticket_replies.message, ticket_replies.created_at,
                    users.id AS user_id, users.name AS user_name, users.role AS user_role
             FROM ticket_replies
             INNER JOIN users ON users.id = ticket_replies.user_id
             WHERE ticket_replies.ticket_id IN ($placeholders) ORDER BY ticket_replies.id ASC"
        );
        $replyStatement->execute($ids);
        $repliesByTicket = [];
        foreach ($replyStatement->fetchAll() as $reply) {
            $repliesByTicket[$reply['ticket_id']][] = $reply;
        }

        foreach ($tickets as &$ticket) {
            $ticket['attachments'] = $attachmentsByTicket[$ticket['id']] ?? [];
            $ticket['replies'] = $repliesByTicket[$ticket['id']] ?? [];
        }
        unset($ticket);
    }

    respond(['tickets' => $tickets]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(['message' => 'Metoda nije dopuštena.'], 405);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isMultipart = stripos($contentType, 'multipart/form-data') === 0;
$data = $isMultipart ? $_POST : request_data();
$resource = (string) ($data['resource'] ?? 'create');

if ($resource === 'reply') {
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $replyMessage = trim((string) ($data['message'] ?? ''));
    if (!$id || $replyMessage === '') {
        respond(['message' => 'Unesite poruku odgovora.'], 422);
    }

    $ownerStatement = database()->prepare('SELECT created_by FROM tickets WHERE id = :id');
    $ownerStatement->execute(['id' => $id]);
    $owner = $ownerStatement->fetch();
    if (!$owner) {
        respond(['message' => 'Upit ne postoji.'], 404);
    }
    if ($user['role'] !== 'admin' && (int) $owner['created_by'] !== $user['id']) {
        respond(['message' => 'Nemate pristup ovom upitu.'], 403);
    }

    $statement = database()->prepare(
        'INSERT INTO ticket_replies (ticket_id, user_id, message) VALUES (:ticket_id, :user_id, :message)'
    );
    $statement->execute(['ticket_id' => $id, 'user_id' => $user['id'], 'message' => $replyMessage]);
    database()->prepare('UPDATE tickets SET updated_at = NOW() WHERE id = :id')->execute(['id' => $id]);

    $updated = ticket_row($id);
    if (!$updated) {
        respond(['message' => 'Upit ne postoji.'], 404);
    }
    notify_ticket_reply($updated, $replyMessage, $user);
    respond(['ticket' => $updated]);
}

if ($resource === 'status') {
    if ($user['role'] !== 'admin') {
        respond(['message' => 'Nemate ovlasti za promjenu statusa upita.'], 403);
    }

    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $status = (string) ($data['status'] ?? '');
    if (!$id || !in_array($status, TICKET_STATUSES, true)) {
        respond(['message' => 'Odaberite ispravan status upita.'], 422);
    }

    $statement = database()->prepare('UPDATE tickets SET status = :status WHERE id = :id');
    $statement->execute(['status' => $status, 'id' => $id]);

    $updated = ticket_row($id);
    if (!$updated) {
        respond(['message' => 'Upit ne postoji.'], 404);
    }
    respond(['ticket' => $updated]);
}

$title = trim((string) ($data['title'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$category = (string) ($data['category'] ?? '');
$priority = (string) ($data['priority'] ?? 'medium');

if ($title === '' || $message === '') {
    respond(['message' => 'Unesite naslov i poruku upita.'], 422);
}
if (!in_array($category, TICKET_CATEGORIES, true)) {
    respond(['message' => 'Odaberite kategoriju upita.'], 422);
}
if (!in_array($priority, TICKET_PRIORITIES, true)) {
    respond(['message' => 'Odaberite prioritet upita.'], 422);
}

$files = $isMultipart && !empty($_FILES['attachments']) ? normalize_uploaded_files($_FILES['attachments']) : [];

if (count($files) > TICKET_MAX_FILES) {
    respond(['message' => 'Najviše ' . TICKET_MAX_FILES . ' privitaka po upitu.'], 422);
}
foreach ($files as $file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        respond(['message' => 'Greška prilikom uploada privitka "' . $file['name'] . '".'], 422);
    }
    if ($file['size'] > TICKET_MAX_FILE_SIZE) {
        respond(['message' => 'Privitak "' . $file['name'] . '" prelazi dozvoljenih 10 MB.'], 422);
    }
    $extension = strtolower((string) pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, TICKET_ALLOWED_EXTENSIONS, true)) {
        respond(['message' => 'Nedozvoljen tip datoteke: ' . $file['name']], 422);
    }
}

$statement = database()->prepare(
    'INSERT INTO tickets (title, message, category, priority, created_by) VALUES (:title, :message, :category, :priority, :created_by)'
);
$statement->execute([
    'title' => $title,
    'message' => $message,
    'category' => $category,
    'priority' => $priority,
    'created_by' => $user['id'],
]);

$id = (int) database()->lastInsertId();

if ($files) {
    $uploadDir = ticket_upload_dir();
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0750, true);
    }

    foreach ($files as $file) {
        $extension = strtolower((string) pathinfo($file['name'], PATHINFO_EXTENSION));
        $storedName = bin2hex(random_bytes(20)) . ($extension !== '' ? '.' . $extension : '');
        $destination = $uploadDir . '/' . $storedName;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            continue;
        }
        $attachmentStatement = database()->prepare(
            'INSERT INTO ticket_attachments (ticket_id, file_name, file_path, file_size, mime_type)
             VALUES (:ticket_id, :file_name, :file_path, :file_size, :mime_type)'
        );
        $attachmentStatement->execute([
            'ticket_id' => $id,
            'file_name' => $file['name'],
            'file_path' => $storedName,
            'file_size' => $file['size'],
            'mime_type' => $file['type'] ?: null,
        ]);
    }
}

$createdTicket = ticket_row($id);
notify_ticket_created($createdTicket);
respond(['ticket' => $createdTicket], 201);
