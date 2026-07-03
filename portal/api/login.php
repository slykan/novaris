<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require_post();

$data = request_data();
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    respond(['message' => 'Unesite ispravnu email adresu i lozinku.'], 422);
}

$statement = database()->prepare(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = :email AND active = 1 LIMIT 1'
);
$statement->execute(['email' => $email]);
$user = $statement->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    usleep(350000);
    respond(['message' => 'Email adresa ili lozinka nisu ispravni.'], 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['user_name'] = (string) $user['name'];
$_SESSION['user_email'] = (string) $user['email'];
$_SESSION['user_role'] = (string) $user['role'];

respond([
    'user' => [
        'id' => (int) $user['id'],
        'name' => (string) $user['name'],
        'email' => (string) $user['email'],
        'role' => (string) $user['role'],
    ],
]);
