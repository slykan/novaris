<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$configPath = getenv('NOVARIS_CONFIG') ?: __DIR__ . '/config.php';
$schemaPath = getenv('NOVARIS_SCHEMA') ?: dirname(__DIR__) . '/database.sql';
$config = require $configPath;

if (!is_file($schemaPath)) {
    fwrite(STDERR, "database.sql nije pronađen.\n");
    exit(1);
}

try {
    $pdo = new PDO(
        sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            $config['host'],
            $config['database']
        ),
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    $pdo->exec((string) file_get_contents($schemaPath));
    fwrite(STDOUT, "Baza je spremna.\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Migracija baze nije uspjela: {$error->getMessage()}\n");
    exit(1);
}
