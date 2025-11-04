-- Create enum types for users
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- Create users table (simplified for basic project)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'USER',
    status user_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_status ON users(status);

-- Insert sample data for testing
INSERT INTO users (email, password, first_name, last_name, role, status) VALUES
('admin@example.com', 'password123', 'Admin', 'User', 'ADMIN', 'ACTIVE'),
('user@example.com', 'password123', 'Regular', 'User', 'USER', 'ACTIVE');
