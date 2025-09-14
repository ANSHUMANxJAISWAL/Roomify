-- Create households table
CREATE TABLE IF NOT EXISTS households (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create users table
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
    household_id VARCHAR(36),
    FOREIGN KEY (household_id) REFERENCES households(id)
);

-- Create other necessary tables
CREATE TABLE IF NOT EXISTS chores (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    assigned_to VARCHAR(36),
    household_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (household_id) REFERENCES households(id)
);

-- Insert default household
INSERT INTO households (id, name, description, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Admin Household',
    'Default household for admin user',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (
    id, email, password, first_name, last_name, 
    role, status, email_verified, created_at, updated_at, household_id
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'admin@roomify.com',
    '$2a$10$E5sLv8U2JwHXpVpWJ5YhIeX9zJ9ZvY8WQkXpVrHq1W2s3d4f5g6h7',
    'Admin',
    'User',
    'ADMIN',
    'ACTIVE',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT (email) DO NOTHING;
