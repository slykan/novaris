<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    respond(['message' => 'Metoda nije dopuštena.'], 405);
}

respond(['user' => require_user()]);
