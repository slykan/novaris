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

    $columnStatement = $pdo->prepare(
        'SELECT COUNT(*)
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = :database
           AND TABLE_NAME = :table
           AND COLUMN_NAME = :column'
    );

    $meetingColumns = [
        'duration' => "VARCHAR(20) NOT NULL DEFAULT '30m' AFTER meeting_time",
        'reminder_enabled' => 'TINYINT(1) NOT NULL DEFAULT 0 AFTER meeting_time',
        'reminder_offset' => 'VARCHAR(10) NULL AFTER reminder_enabled',
        'client_reminder_enabled' => 'TINYINT(1) NOT NULL DEFAULT 0 AFTER reminder_offset',
        'client_reminder_offset' => 'VARCHAR(10) NULL AFTER client_reminder_enabled',
        'notes' => 'TEXT NULL AFTER client_reminder_offset',
        'reminder_sent_at' => 'DATETIME NULL AFTER notes',
        'client_reminder_sent_at' => 'DATETIME NULL AFTER reminder_sent_at',
        'status' => "VARCHAR(20) NOT NULL DEFAULT 'planned' AFTER client_reminder_sent_at",
        'outcome_notes' => 'TEXT NULL AFTER status',
        'completed_at' => 'DATETIME NULL AFTER outcome_notes',
        'accept_token' => 'VARCHAR(64) NULL AFTER completed_at',
        'client_accepted_at' => 'DATETIME NULL AFTER accept_token',
    ];

    foreach ($meetingColumns as $column => $definition) {
        $columnStatement->execute([
            'database' => $config['database'],
            'table' => 'meetings',
            'column' => $column,
        ]);

        if ((int) $columnStatement->fetchColumn() === 0) {
            $pdo->exec(sprintf(
                'ALTER TABLE meetings ADD COLUMN `%s` %s',
                $column,
                $definition
            ));
        }
    }

    $userColumns = [
        'role' => "VARCHAR(20) NOT NULL DEFAULT 'standard' AFTER password_hash",
    ];

    foreach ($userColumns as $column => $definition) {
        $columnStatement->execute([
            'database' => $config['database'],
            'table' => 'users',
            'column' => $column,
        ]);

        if ((int) $columnStatement->fetchColumn() === 0) {
            $pdo->exec(sprintf(
                'ALTER TABLE users ADD COLUMN `%s` %s',
                $column,
                $definition
            ));
        }
    }

    fwrite(STDOUT, "Baza je spremna.\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Migracija baze nije uspjela: {$error->getMessage()}\n");
    exit(1);
}
