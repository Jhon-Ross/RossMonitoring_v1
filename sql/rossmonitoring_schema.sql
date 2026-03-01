CREATE TABLE IF NOT EXISTS monitoring_active (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(50) NOT NULL UNIQUE,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  zone_type VARCHAR(16) NOT NULL DEFAULT 'circle',
  zone_data LONGTEXT NOT NULL,
  battery_level INT NOT NULL DEFAULT 100,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  last_seen_at BIGINT NULL,
  last_x DOUBLE NULL,
  last_y DOUBLE NULL,
  last_z DOUBLE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_end_time (end_time),
  INDEX idx_last_seen_at (last_seen_at)
);

CREATE TABLE IF NOT EXISTS monitoring_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(50) NOT NULL,
  officer_identifier VARCHAR(50) NULL,
  applied_at BIGINT NOT NULL,
  removed_at BIGINT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  violations_count INT NOT NULL DEFAULT 0,
  reason VARCHAR(255) NULL,
  meta LONGTEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_identifier (identifier),
  INDEX idx_officer_identifier (officer_identifier),
  INDEX idx_applied_at (applied_at),
  INDEX idx_removed_at (removed_at)
);

CREATE TABLE IF NOT EXISTS monitoring_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(50) NOT NULL,
  officer_identifier VARCHAR(50) NULL,
  event_type VARCHAR(32) NOT NULL,
  event_at BIGINT NOT NULL,
  x DOUBLE NULL,
  y DOUBLE NULL,
  z DOUBLE NULL,
  zone_snapshot LONGTEXT NULL,
  details LONGTEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_identifier (identifier),
  INDEX idx_event_type (event_type),
  INDEX idx_event_at (event_at),
  INDEX idx_officer_identifier (officer_identifier)
);

CREATE TABLE IF NOT EXISTS monitoring_officers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NULL,
  badge VARCHAR(20) NULL,
  department VARCHAR(32) NULL,
  level TINYINT NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_level (level)
);

CREATE TABLE IF NOT EXISTS monitoring_settings (
  setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
  setting_value LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
