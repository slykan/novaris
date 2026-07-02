<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (($_GET['resource'] ?? '') === 'meetings') {
        $statement = database()->query(
            'SELECT meetings.id, meetings.meeting_date, meetings.meeting_time,
                    meetings.reminder_enabled, meetings.reminder_offset,
                    clients.id AS client_id, clients.company_name, clients.oib,
                    clients.contact_name, clients.phone, clients.email, clients.notes
             FROM meetings
             INNER JOIN clients ON clients.id = meetings.client_id
             ORDER BY meetings.meeting_date ASC, meetings.meeting_time ASC, meetings.id ASC'
        );
        respond(['meetings' => $statement->fetchAll()]);
    }

    $statement = database()->query(
        'SELECT id, company_name, oib, contact_name, phone, email, notes, created_at
         FROM clients
         ORDER BY created_at DESC, id DESC'
    );
    respond(['clients' => $statement->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(['message' => 'Metoda nije dopuštena.'], 405);
}

$data = request_data();

if (($data['resource'] ?? '') === 'meeting') {
    $clientId = filter_var($data['clientId'] ?? null, FILTER_VALIDATE_INT);
    $meetingDate = trim((string) ($data['date'] ?? ''));
    $meetingTime = trim((string) ($data['time'] ?? ''));
    $reminderEnabled = !empty($data['reminderEnabled']);
    $reminderOffset = $reminderEnabled ? (string) ($data['reminderOffset'] ?? '') : null;

    $dateIsValid = DateTimeImmutable::createFromFormat('!Y-m-d', $meetingDate);
    $timeIsValid = DateTimeImmutable::createFromFormat('!H:i', $meetingTime);
    if (!$clientId || !$dateIsValid || $dateIsValid->format('Y-m-d') !== $meetingDate
        || !$timeIsValid || $timeIsValid->format('H:i') !== $meetingTime) {
        respond(['message' => 'Odaberite klijenta, datum i vrijeme sastanka.'], 422);
    }
    if ($reminderEnabled && !in_array($reminderOffset, ['1h', '5h', '1d'], true)) {
        respond(['message' => 'Odaberite kada želite primiti obavijest.'], 422);
    }

    $clientStatement = database()->prepare('SELECT id FROM clients WHERE id = :id LIMIT 1');
    $clientStatement->execute(['id' => $clientId]);
    if (!$clientStatement->fetch()) {
        respond(['message' => 'Odabrani klijent ne postoji.'], 422);
    }

    $statement = database()->prepare(
        'INSERT INTO meetings (
            client_id, meeting_date, meeting_time, reminder_enabled, reminder_offset, created_by
         ) VALUES (
            :client_id, :meeting_date, :meeting_time, :reminder_enabled, :reminder_offset, :created_by
         )'
    );
    $statement->execute([
        'client_id' => $clientId,
        'meeting_date' => $meetingDate,
        'meeting_time' => $meetingTime . ':00',
        'reminder_enabled' => $reminderEnabled ? 1 : 0,
        'reminder_offset' => $reminderOffset,
        'created_by' => $user['id'],
    ]);

    $id = (int) database()->lastInsertId();
    $statement = database()->prepare(
        'SELECT meetings.id, meetings.meeting_date, meetings.meeting_time,
                meetings.reminder_enabled, meetings.reminder_offset,
                clients.id AS client_id, clients.company_name, clients.oib,
                clients.contact_name, clients.phone, clients.email, clients.notes
         FROM meetings
         INNER JOIN clients ON clients.id = meetings.client_id
         WHERE meetings.id = :id'
    );
    $statement->execute(['id' => $id]);
    respond(['meeting' => $statement->fetch()], 201);
}

$client = [
    'company_name' => trim((string) ($data['companyName'] ?? '')),
    'oib' => trim((string) ($data['oib'] ?? '')),
    'contact_name' => trim((string) ($data['contactName'] ?? '')),
    'phone' => trim((string) ($data['phone'] ?? '')),
    'email' => strtolower(trim((string) ($data['email'] ?? ''))),
    'notes' => trim((string) ($data['notes'] ?? '')),
];

if ($client['company_name'] === '' || $client['contact_name'] === '' || !preg_match('/^\d{11}$/', $client['oib'])) {
    respond(['message' => 'Provjerite naziv tvrtke, OIB i kontakt osobu.'], 422);
}
if (!filter_var($client['email'], FILTER_VALIDATE_EMAIL)) {
    respond(['message' => 'Email adresa nije ispravna.'], 422);
}

try {
    $statement = database()->prepare(
        'INSERT INTO clients (company_name, oib, contact_name, phone, email, notes, created_by)
         VALUES (:company_name, :oib, :contact_name, :phone, :email, :notes, :created_by)'
    );
    $statement->execute($client + ['created_by' => $user['id']]);
} catch (PDOException $error) {
    if ((int) $error->getCode() === 23000) {
        respond(['message' => 'Klijent s tim OIB-om već postoji.'], 409);
    }
    respond(['message' => 'Klijenta trenutačno nije moguće spremiti.'], 500);
}

$id = (int) database()->lastInsertId();
$statement = database()->prepare(
    'SELECT id, company_name, oib, contact_name, phone, email, notes, created_at
     FROM clients WHERE id = :id'
);
$statement->execute(['id' => $id]);

respond(['client' => $statement->fetch()], 201);
