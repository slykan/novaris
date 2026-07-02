<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$user = require_user();

function audit_row(int $id): array|false
{
    $statement = database()->prepare(
        'SELECT audits.id, audits.status, audits.checklist, audits.notes,
                audits.completed_at, audits.created_at, audits.updated_at,
                clients.id AS client_id, clients.company_name, clients.oib,
                clients.contact_name, clients.phone, clients.email
         FROM audits
         INNER JOIN clients ON clients.id = audits.client_id
         WHERE audits.id = :id'
    );
    $statement->execute(['id' => $id]);
    $row = $statement->fetch();
    if ($row) {
        $row['checklist'] = $row['checklist'] !== null ? json_decode((string) $row['checklist'], true) : null;
    }
    return $row;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $statement = database()->query(
            'SELECT audits.id, audits.status, audits.checklist, audits.notes,
                    audits.completed_at, audits.created_at, audits.updated_at,
                    clients.id AS client_id, clients.company_name, clients.oib,
                    clients.contact_name, clients.phone, clients.email
             FROM audits
             INNER JOIN clients ON clients.id = audits.client_id
             ORDER BY audits.created_at DESC, audits.id DESC'
        );
        $audits = $statement->fetchAll();
    } catch (PDOException $error) {
        if ($error->getCode() === '42S02') {
            respond(['audits' => []]);
        }
        throw $error;
    }
    foreach ($audits as &$audit) {
        $audit['checklist'] = $audit['checklist'] !== null ? json_decode((string) $audit['checklist'], true) : null;
    }
    unset($audit);
    respond(['audits' => $audits]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(['message' => 'Metoda nije dopuštena.'], 405);
}

$data = request_data();

$auditId = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT) ?: null;
$clientId = filter_var($data['clientId'] ?? null, FILTER_VALIDATE_INT);
$status = (string) ($data['status'] ?? 'in_progress');
$notes = trim((string) ($data['notes'] ?? ''));
$checklist = $data['checklist'] ?? null;

if (!$clientId) {
    respond(['message' => 'Odaberite tvrtku za audit.'], 422);
}
if (!in_array($status, ['in_progress', 'completed'], true)) {
    respond(['message' => 'Nepoznat status audita.'], 422);
}
if (!is_array($checklist)) {
    respond(['message' => 'Checklist nije ispravan.'], 422);
}

$clientStatement = database()->prepare('SELECT id FROM clients WHERE id = :id LIMIT 1');
$clientStatement->execute(['id' => $clientId]);
if (!$clientStatement->fetch()) {
    respond(['message' => 'Odabrani klijent ne postoji.'], 422);
}

$checklistJson = json_encode($checklist, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($auditId) {
    $existingStatement = database()->prepare('SELECT id FROM audits WHERE id = :id LIMIT 1');
    $existingStatement->execute(['id' => $auditId]);
    if (!$existingStatement->fetch()) {
        respond(['message' => 'Audit ne postoji.'], 404);
    }

    $statement = database()->prepare(
        'UPDATE audits SET
            client_id = :client_id,
            status = :status,
            checklist = :checklist,
            notes = :notes,
            completed_at = ' . ($status === 'completed' ? 'COALESCE(completed_at, NOW())' : 'NULL') . '
         WHERE id = :id'
    );
    $statement->execute([
        'client_id' => $clientId,
        'status' => $status,
        'checklist' => $checklistJson,
        'notes' => $notes,
        'id' => $auditId,
    ]);

    respond(['audit' => audit_row($auditId)]);
}

$statement = database()->prepare(
    'INSERT INTO audits (client_id, status, checklist, notes, completed_at, created_by)
     VALUES (:client_id, :status, :checklist, :notes, ' . ($status === 'completed' ? 'NOW()' : 'NULL') . ', :created_by)'
);
$statement->execute([
    'client_id' => $clientId,
    'status' => $status,
    'checklist' => $checklistJson,
    'notes' => $notes,
    'created_by' => $user['id'],
]);

$id = (int) database()->lastInsertId();
respond(['audit' => audit_row($id)], 201);
