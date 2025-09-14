-- RoomiFy Initial Data
-- This script populates the database with sample data

-- Insert sample households
INSERT INTO households (id, name, description, address, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sunset Apartments 3B', 'Cozy 2-bedroom apartment with great views', '123 Sunset Blvd, Apt 3B, Los Angeles, CA 90210', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'Downtown Loft', 'Modern loft in the heart of downtown', '456 Main St, Loft 5, Los Angeles, CA 90012', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample users (passwords are hashed versions of 'password123')
INSERT INTO users (id, email, password, first_name, last_name, phone_number, role, status, household_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '+1-555-0101', 'USER', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', '+1-555-0102', 'USER', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440005', 'mike@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike', 'Jones', '+1-555-0103', 'USER', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample chores
INSERT INTO chores (id, title, description, assigned_to, due_date, status, priority, frequency, household_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'Clean Kitchen', 'Wash dishes, wipe counters, sweep floor', '550e8400-e29b-41d4-a716-446655440003', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'PENDING', 'HIGH', 'DAILY', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440007', 'Take Out Trash', 'Empty all trash bins and take to dumpster', '550e8400-e29b-41d4-a716-446655440004', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'PENDING', 'MEDIUM', 'WEEKLY', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440008', 'Vacuum Living Room', 'Vacuum carpets and dust surfaces', '550e8400-e29b-41d4-a716-446655440003', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'PENDING', 'LOW', 'WEEKLY', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample expenses
INSERT INTO expenses (id, title, description, amount, category, status, due_date, created_by, household_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'Rent Payment', 'Monthly rent for apartment', 1200.00, 'RENT', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440010', 'Electricity Bill', 'Monthly electricity bill', 85.50, 'UTILITIES', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440011', 'Internet Bill', 'Monthly internet service', 65.00, 'UTILITIES', 'PENDING', DATE_ADD(CURDATE(), INTERVAL 10 DAY), '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample reminders
INSERT INTO reminders (id, title, description, priority, status, type, due_date, assigned_to, created_by, household_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440012', 'Pay Rent', 'Don\'t forget to pay rent this month', 'HIGH', 'PENDING', 'BILL', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440013', 'Grocery Shopping', 'Need to buy groceries for the week', 'MEDIUM', 'PENDING', 'SHOPPING', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, priority, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 'New Chore Assigned', 'You have been assigned a new chore: Clean Kitchen', 'CHORE', 'MEDIUM', CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440004', 'Expense Due Soon', 'Electricity bill is due in 3 days', 'EXPENSE', 'HIGH', CURRENT_TIMESTAMP);
