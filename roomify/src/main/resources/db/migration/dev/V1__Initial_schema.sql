-- H2 compatible schema for development
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_status ON users(status);

-- Insert sample data for testing
INSERT INTO users (email, password, first_name, last_name, role, status) VALUES
('admin@roomify.com', 'admin123', 'Admin', 'User', 'ADMIN', 'ACTIVE'),
('john@roomify.com', 'john123', 'John', 'Doe', 'USER', 'ACTIVE'),
('jane@roomify.com', 'jane123', 'Jane', 'Smith', 'USER', 'ACTIVE'),
('guest@roomify.com', 'guest123', 'Guest', 'User', 'USER', 'ACTIVE');
