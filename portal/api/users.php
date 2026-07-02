<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
$currentUser = require_user();

function user_row(int $id): array|false
{
    $statement = database()->prepare(
        'SELECT id, name, email, role, active, created_at FROM users WHERE id = :id'
    );
    $statement->execute(['id' => $id]);
    return $statement->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = database()->query(
        'SELECT id, name, email, role, active, created_at FROM users ORDER BY created_at ASC, id ASC'
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

    if (!$id || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['message' => 'Provjerite ime i email adresu.'], 422);
    }

    try {
        $statement = database()->prepare('UPDATE users SET name = :name, email = :email WHERE id = :id');
        $statement->execute(['name' => $name, 'email' => $email, 'id' => $id]);
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

try {
    $statement = database()->prepare(
        'INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :password_hash, :role)'
    );
    $statement->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'role' => 'standard',
    ]);
} catch (PDOException $error) {
    if ((int) $error->getCode() === 23000) {
        respond(['message' => 'Korisnik s tom email adresom već postoji.'], 409);
    }
    respond(['message' => 'Korisnika trenutačno nije moguće spremiti.'], 500);
}

$id = (int) database()->lastInsertId();
respond(['user' => user_row($id)], 201);
