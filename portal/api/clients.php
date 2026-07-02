<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/meeting-mail.php';
$user = require_user();

function notify_meeting_created(array $meeting): void
{
    try {
        $contactPath = getenv('NOVARIS_CONTACT') ?: __DIR__ . '/contact.php';
        $smtp = smtp_credentials($contactPath);
        $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
        $time = substr((string) $meeting['meeting_time'], 0, 5);

        send_smtp(
            $smtp,
            'info@novaristech.hr',
            sprintf('Novi sastanak: %s, %s u %s', $meeting['company_name'], $date, $time),
            meeting_admin_created_email($meeting)
        );

        if (filter_var($meeting['email'], FILTER_VALIDATE_EMAIL)) {
            send_smtp(
                $smtp,
                $meeting['email'],
                sprintf('Potvrda sastanka: %s u %s', $date, $time),
                meeting_client_created_email($meeting),
                $meeting['contact_name']
            );
        }
    } catch (Throwable $error) {
        error_log('Slanje obavijesti o sastanku nije uspjelo: ' . $error->getMessage());
    }
}

function notify_meeting_rescheduled(array $meeting): void
{
    try {
        $contactPath = getenv('NOVARIS_CONTACT') ?: __DIR__ . '/contact.php';
        $smtp = smtp_credentials($contactPath);
        $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
        $time = substr((string) $meeting['meeting_time'], 0, 5);

        send_smtp(
            $smtp,
            'info@novaristech.hr',
            sprintf('Izmjene termina sastanka: %s, %s u %s', $meeting['company_name'], $date, $time),
            meeting_admin_rescheduled_email($meeting)
        );

        if (filter_var($meeting['email'], FILTER_VALIDATE_EMAIL)) {
            send_smtp(
                $smtp,
                $meeting['email'],
                sprintf('Izmjene termina sastanka: %s u %s', $date, $time),
                meeting_client_rescheduled_email($meeting),
                $meeting['contact_name']
            );
        }
    } catch (Throwable $error) {
        error_log('Slanje obavijesti o izmjeni termina nije uspjelo: ' . $error->getMessage());
    }
}

function notify_meeting_outcome(array $meeting): void
{
    try {
        $contactPath = getenv('NOVARIS_CONTACT') ?: __DIR__ . '/contact.php';
        $smtp = smtp_credentials($contactPath);
        $date = (new DateTimeImmutable($meeting['meeting_date']))->format('d.m.Y.');
        $time = substr((string) $meeting['meeting_time'], 0, 5);

        send_smtp(
            $smtp,
            'info@novaristech.hr',
            sprintf('Ishod sastanka: %s, %s u %s (%s)', $meeting['company_name'], $date, $time, meeting_status_label((string) $meeting['status'])),
            meeting_admin_outcome_email($meeting)
        );
    } catch (Throwable $error) {
        error_log('Slanje obavijesti o ishodu sastanka nije uspjelo: ' . $error->getMessage());
    }
}

function meeting_row(int $id): array|false
{
    $statement = database()->prepare(
        'SELECT meetings.id, meetings.meeting_date, meetings.meeting_time, meetings.duration,
                meetings.reminder_enabled, meetings.reminder_offset,
                meetings.client_reminder_enabled, meetings.client_reminder_offset,
                meetings.status, meetings.outcome_notes, meetings.completed_at,
                meetings.notes AS meeting_notes,
                clients.id AS client_id, clients.company_name, clients.oib,
                clients.contact_name, clients.phone, clients.email, clients.notes
         FROM meetings
         INNER JOIN clients ON clients.id = meetings.client_id
         WHERE meetings.id = :id'
    );
    $statement->execute(['id' => $id]);
    return $statement->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (($_GET['resource'] ?? '') === 'meetings') {
        $statement = database()->query(
            'SELECT meetings.id, meetings.meeting_date, meetings.meeting_time, meetings.duration,
                    meetings.reminder_enabled, meetings.reminder_offset,
                    meetings.client_reminder_enabled, meetings.client_reminder_offset,
                    meetings.status, meetings.outcome_notes, meetings.completed_at,
                    meetings.notes AS meeting_notes,
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

if (($data['resource'] ?? '') === 'meeting-status') {
    $meetingId = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $status = (string) ($data['status'] ?? '');
    $outcomeNotes = trim((string) ($data['notes'] ?? ''));

    if (!$meetingId || !in_array($status, ['agreed', 'cancelled', 'follow_up'], true)) {
        respond(['message' => 'Odaberite ishod sastanka.'], 422);
    }

    $statement = database()->prepare(
        'UPDATE meetings SET status = :status, outcome_notes = :notes, completed_at = NOW() WHERE id = :id'
    );
    $statement->execute(['status' => $status, 'notes' => $outcomeNotes, 'id' => $meetingId]);

    $meeting = meeting_row($meetingId);
    if (!$meeting) {
        respond(['message' => 'Sastanak ne postoji.'], 404);
    }

    notify_meeting_outcome($meeting);
    respond(['meeting' => $meeting]);
}

if (($data['resource'] ?? '') === 'meeting') {
    $meetingId = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT) ?: null;
    $clientId = filter_var($data['clientId'] ?? null, FILTER_VALIDATE_INT);
    $meetingDate = trim((string) ($data['date'] ?? ''));
    $meetingTime = trim((string) ($data['time'] ?? ''));
    $duration = (string) ($data['duration'] ?? '');
    $reminderEnabled = !empty($data['reminderEnabled']);
    $reminderOffset = $reminderEnabled ? (string) ($data['reminderOffset'] ?? '') : null;
    $clientReminderEnabled = !empty($data['clientReminderEnabled']);
    $clientReminderOffset = $clientReminderEnabled ? (string) ($data['clientReminderOffset'] ?? '') : null;
    $meetingNotes = trim((string) ($data['notes'] ?? ''));

    $dateIsValid = DateTimeImmutable::createFromFormat('!Y-m-d', $meetingDate);
    $timeIsValid = DateTimeImmutable::createFromFormat('!H:i', $meetingTime);
    if (!$clientId || !$dateIsValid || $dateIsValid->format('Y-m-d') !== $meetingDate
        || !$timeIsValid || $timeIsValid->format('H:i') !== $meetingTime) {
        respond(['message' => 'Odaberite klijenta, datum i vrijeme sastanka.'], 422);
    }
    if ($reminderEnabled && !in_array($reminderOffset, ['1h', '5h', '1d'], true)) {
        respond(['message' => 'Odaberite kada želite primiti obavijest.'], 422);
    }
    if ($clientReminderEnabled && !in_array($clientReminderOffset, ['1h', '5h', '1d'], true)) {
        respond(['message' => 'Odaberite kada klijent želi primiti obavijest.'], 422);
    }
    if (!in_array($duration, ['30m', '1h', '2h', 'as_needed'], true)) {
        respond(['message' => 'Odaberite trajanje sastanka.'], 422);
    }

    $clientStatement = database()->prepare('SELECT id FROM clients WHERE id = :id LIMIT 1');
    $clientStatement->execute(['id' => $clientId]);
    if (!$clientStatement->fetch()) {
        respond(['message' => 'Odabrani klijent ne postoji.'], 422);
    }

    if ($meetingId) {
        $existingStatement = database()->prepare('SELECT meeting_date, meeting_time FROM meetings WHERE id = :id LIMIT 1');
        $existingStatement->execute(['id' => $meetingId]);
        $existing = $existingStatement->fetch();
        if (!$existing) {
            respond(['message' => 'Sastanak ne postoji.'], 404);
        }
        $timeChanged = $existing['meeting_date'] !== $meetingDate
            || substr((string) $existing['meeting_time'], 0, 5) !== $meetingTime;

        $statement = database()->prepare(
            'UPDATE meetings SET
                client_id = :client_id,
                meeting_date = :meeting_date,
                meeting_time = :meeting_time,
                duration = :duration,
                reminder_enabled = :reminder_enabled,
                reminder_offset = :reminder_offset,
                client_reminder_enabled = :client_reminder_enabled,
                client_reminder_offset = :client_reminder_offset,
                notes = :notes'
            . ($timeChanged ? ', reminder_sent_at = NULL, client_reminder_sent_at = NULL' : '') . '
             WHERE id = :id'
        );
        $statement->execute([
            'client_id' => $clientId,
            'meeting_date' => $meetingDate,
            'meeting_time' => $meetingTime . ':00',
            'duration' => $duration,
            'reminder_enabled' => $reminderEnabled ? 1 : 0,
            'reminder_offset' => $reminderOffset,
            'client_reminder_enabled' => $clientReminderEnabled ? 1 : 0,
            'client_reminder_offset' => $clientReminderOffset,
            'notes' => $meetingNotes,
            'id' => $meetingId,
        ]);

        $updatedMeeting = meeting_row($meetingId);
        if ($timeChanged) {
            notify_meeting_rescheduled($updatedMeeting);
        }
        respond(['meeting' => $updatedMeeting]);
    }

    $statement = database()->prepare(
        'INSERT INTO meetings (
            client_id, meeting_date, meeting_time, duration, reminder_enabled, reminder_offset,
            client_reminder_enabled, client_reminder_offset, notes, created_by
         ) VALUES (
            :client_id, :meeting_date, :meeting_time, :duration, :reminder_enabled, :reminder_offset,
            :client_reminder_enabled, :client_reminder_offset, :notes, :created_by
         )'
    );
    $statement->execute([
        'client_id' => $clientId,
        'meeting_date' => $meetingDate,
        'meeting_time' => $meetingTime . ':00',
        'duration' => $duration,
        'reminder_enabled' => $reminderEnabled ? 1 : 0,
        'reminder_offset' => $reminderOffset,
        'client_reminder_enabled' => $clientReminderEnabled ? 1 : 0,
        'client_reminder_offset' => $clientReminderOffset,
        'notes' => $meetingNotes,
        'created_by' => $user['id'],
    ]);

    $id = (int) database()->lastInsertId();
    $createdMeeting = meeting_row($id);
    notify_meeting_created($createdMeeting);
    respond(['meeting' => $createdMeeting], 201);
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
