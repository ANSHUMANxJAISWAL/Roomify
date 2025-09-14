-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    household_id VARCHAR(36)
);

-- Create households table if it doesn't exist
CREATE TABLE IF NOT EXISTS households (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Insert a default household if it doesn't exist
INSERT INTO households (id, name, description, created_at, updated_at)
SELECT '00000000-0000-0000-0000-000000000000', 'Admin Household', 'Default household for admin user', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM households WHERE id = '00000000-0000-0000-0000-000000000000');

-- Insert a default admin user if it doesn't exist
-- Password: 'admin123' (BCrypt hashed)
INSERT INTO users (id, email, password, first_name, last_name, role, status, email_verified, created_at, updated_at, household_id)
SELECT 
    '11111111-1111-1111-1111-111111111111',
    'admin@roomify.com',
    '$2a$10$E5sLv8U2JwHXpVpWJ5YhIeX9zJ9ZvY8WQkXpVrHq1W2s3d4f5g6h7',
    'Admin',
    'User',
    'ADMIN',
    'ACTIVE',
    true,
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000000'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@roomify.com');
