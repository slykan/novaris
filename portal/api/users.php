<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$currentUser = require_user();

function user_row(int $id): array|false
{
    $statement = database()->prepare(
        'SELECT id, name, email, role, company_name, oib, phone, active, created_at FROM users WHERE id = :id'
    );
    $statement->execute(['id' => $id]);
    return $statement->fetch();
}

function contact_fields(array $data): array
{
    $companyName = trim((string) ($data['companyName'] ?? ''));
    $oib = trim((string) ($data['oib'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));

    if ($oib !== '' && !preg_match('/^\d{11}$/', $oib)) {
        respond(['message' => 'OIB mora sadržavati točno 11 znamenki.'], 422);
    }

    return [
        'company_name' => $companyName !== '' ? $companyName : null,
        'oib' => $oib !== '' ? $oib : null,
        'phone' => $phone !== '' ? $phone : null,
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = database()->query(
        'SELECT id, name, email, role, company_name, oib, phone, active, created_at FROM users ORDER BY created_at ASC, id ASC'
    );
    respond(['users' => $statement->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(['message' => 'Metoda nije dopuštena.'], 405);
}

$data = request_data();
$resource = (string) ($data['resource'] ?? 'create');

if ($resource === 'active') {
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    if (!$id) {
        respond(['message' => 'Nepoznat korisnik.'], 422);
    }
    if ($id === $currentUser['id']) {
        respond(['message' => 'Ne možete onemogućiti vlastiti korisnički račun.'], 422);
    }

    $active = !empty($data['active']) ? 1 : 0;
    $statement = database()->prepare('UPDATE users SET active = :active WHERE id = :id');
    $statement->execute(['active' => $active, 'id' => $id]);

    $updated = user_row($id);
    if (!$updated) {
        respond(['message' => 'Korisnik ne postoji.'], 404);
    }
    respond(['user' => $updated]);
}

if ($resource === 'role') {
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $role = (string) ($data['role'] ?? '');
    if (!$id || !in_array($role, ['standard', 'admin'], true)) {
        respond(['message' => 'Odaberite ispravnu grupu korisnika.'], 422);
    }
    if ($id === $currentUser['id']) {
        respond(['message' => 'Ne možete promijeniti grupu vlastitog računa.'], 422);
    }

    $statement = database()->prepare('UPDATE users SET role = :role WHERE id = :id');
    $statement->execute(['role' => $role, 'id' => $id]);

    $updated = user_row($id);
    if (!$updated) {
        respond(['message' => 'Korisnik ne postoji.'], 404);
    }
    respond(['user' => $updated]);
}

if ($resource === 'delete') {
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    if (!$id) {
        respond(['message' => 'Nepoznat korisnik.'], 422);
    }
    if ($id === $currentUser['id']) {
        respond(['message' => 'Ne možete obrisati vlastiti korisnički račun.'], 422);
    }

    try {
        $statement = database()->prepare('DELETE FROM users WHERE id = :id');
        $statement->execute(['id' => $id]);
    } catch (PDOException $error) {
        if ((int) $error->getCode() === 23000) {
            respond(['message' => 'Korisnika nije moguće obrisati jer ima povezane zapise (klijenti, sastanci ili auditi). Onemogućite ga umjesto brisanja.'], 409);
        }
        respond(['message' => 'Korisnika trenutačno nije moguće obrisati.'], 500);
    }

    if ($statement->rowCount() === 0) {
        respond(['message' => 'Korisnik ne postoji.'], 404);
    }
    respond(['deleted' => true]);
}

if ($resource === 'update') {
    $id = filter_var($data['id'] ?? null, FILTER_VALIDATE_INT);
    $name = trim((string) ($data['name'] ?? ''));
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    $password = trim((string) ($data['password'] ?? ''));

    if (!$id || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['message' => 'Provjerite ime i email adresu.'], 422);
    }
    if ($password !== '' && strlen($password) < 8) {
        respond(['message' => 'Nova lozinka mora imati najmanje 8 znakova.'], 422);
    }

    $contact = contact_fields($data);

    try {
        if ($password !== '') {
            $statement = database()->prepare(
                'UPDATE users SET name = :name, email = :email, password_hash = :password_hash,
                        company_name = :company_name, oib = :oib, phone = :phone
                 WHERE id = :id'
            );
            $statement->execute([
                'name' => $name,
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'id' => $id,
            ] + $contact);
        } else {
            $statement = database()->prepare(
                'UPDATE users SET name = :name, email = :email,
                        company_name = :company_name, oib = :oib, phone = :phone
                 WHERE id = :id'
            );
            $statement->execute(['name' => $name, 'email' => $email, 'id' => $id] + $contact);
        }
    } catch (PDOException $error) {
        if ((int) $error->getCode() === 23000) {
            respond(['message' => 'Korisnik s tom email adresom već postoji.'], 409);
        }
        respond(['message' => 'Korisnika trenutačno nije moguće spremiti.'], 500);
    }

    $updated = user_row($id);
    if (!$updated) {
        respond(['message' => 'Korisnik ne postoji.'], 404);
    }
    respond(['user' => $updated]);
}

$name = trim((string) ($data['name'] ?? ''));
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(['message' => 'Provjerite ime i email adresu.'], 422);
}
if (strlen($password) < 8) {
    respond(['message' => 'Lozinka mora imati najmanje 8 znakova.'], 422);
}

$contact = contact_fields($data);

try {
    $statement = database()->prepare(
        'INSERT INTO users (name, email, password_hash, role, company_name, oib, phone)
         VALUES (:name, :email, :password_hash, :role, :company_name, :oib, :phone)'
    );
    $statement->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'role' => 'standard',
    ] + $contact);
} catch (PDOException $error) {
    if ((int) $error->getCode() === 23000) {
        respond(['message' => 'Korisnik s tom email adresom već postoji.'], 409);
    }
    respond(['message' => 'Korisnika trenutačno nije moguće spremiti.'], 500);
}

$id = (int) database()->lastInsertId();
respond(['user' => user_row($id)], 201);
