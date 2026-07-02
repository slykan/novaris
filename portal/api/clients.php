<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$user = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
