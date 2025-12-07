-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_login TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_status ON users(status);

-- Create households table if it doesn't exist
CREATE TABLE IF NOT EXISTS households (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    invite_code VARCHAR(10) NOT NULL UNIQUE,
    max_members INT DEFAULT 10,
    status VARCHAR(20) NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100)
);

-- Create indexes for households
CREATE INDEX IF NOT EXISTS idx_household_invite_code ON households(invite_code);
CREATE INDEX IF NOT EXISTS idx_household_status ON households(status);

-- Create household_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS household_members (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    user_id VARCHAR(36) NOT NULL,
    household_id VARCHAR(36) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (household_id) REFERENCES households(id)
);

-- Create indexes for household_members
CREATE INDEX IF NOT EXISTS idx_household_member_user ON household_members(user_id);
CREATE INDEX IF NOT EXISTS idx_household_member_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_member_status ON household_members(status);

-- Create expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_by_id VARCHAR(36) NOT NULL,
    household_id VARCHAR(36) NOT NULL,
    receipt_url VARCHAR(500),
    FOREIGN KEY (paid_by_id) REFERENCES users(id),
    FOREIGN KEY (household_id) REFERENCES households(id)
);

-- Create indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expense_household ON expenses(household_id);
CREATE INDEX IF NOT EXISTS idx_expense_paid_by ON expenses(paid_by_id);
CREATE INDEX IF NOT EXISTS idx_expense_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expense_status ON expenses(status);

-- Create expense_splits table if it doesn't exist
CREATE TABLE IF NOT EXISTS expense_splits (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    expense_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for expense_splits
CREATE INDEX IF NOT EXISTS idx_expense_split_expense ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_split_user ON expense_splits(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_split_status ON expense_splits(status);

-- Create expense_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS expense_tags (
    expense_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(id)
);
