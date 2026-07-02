CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'standard',
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(190) NOT NULL,
    oib CHAR(11) NOT NULL UNIQUE,
    contact_name VARCHAR(190) NOT NULL,
    phone VARCHAR(60) NULL,
    email VARCHAR(190) NOT NULL,
    notes TEXT NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT clients_created_by_foreign
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX clients_company_name_index (company_name),
    INDEX clients_contact_name_index (contact_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meetings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    duration VARCHAR(20) NOT NULL DEFAULT '30m',
    reminder_enabled TINYINT(1) NOT NULL DEFAULT 0,
    reminder_offset VARCHAR(10) NULL,
    client_reminder_enabled TINYINT(1) NOT NULL DEFAULT 0,
    client_reminder_offset VARCHAR(10) NULL,
    notes TEXT NULL,
    reminder_sent_at DATETIME NULL,
    client_reminder_sent_at DATETIME NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    outcome_notes TEXT NULL,
    completed_at DATETIME NULL,
    accept_token VARCHAR(64) NULL,
    client_accepted_at DATETIME NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT meetings_client_foreign
        FOREIGN KEY (client_id) REFERENCES clients(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT meetings_created_by_foreign
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX meetings_schedule_index (meeting_date, meeting_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audits (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    checklist JSON NULL,
    notes TEXT NULL,
    completed_at DATETIME NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT audits_client_foreign
        FOREIGN KEY (client_id) REFERENCES clients(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT audits_created_by_foreign
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX audits_client_index (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

UPDATE IGNORE users
SET email = 'info@novaristech.hr'
WHERE email = 'admin@novaris.hr';

INSERT INTO users (name, email, password_hash)
VALUES (
    'Administrator',
    'info@novaristech.hr',
    '$2y$12$6cptmlg20e3EHw48BeQMwOx7WxhN32bTjg3giZGHfjBVB/aStYDx6'
)
ON DUPLICATE KEY UPDATE email = VALUES(email);
