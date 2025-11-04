-- Insert sample users
INSERT INTO users (id, email, password, first_name, last_name, role, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@roomify.com', 'admin123', 'Admin', 'User', 'ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'john@roomify.com', 'john123', 'John', 'Doe', 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440003', 'jane@roomify.com', 'jane123', 'Jane', 'Smith', 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'guest@roomify.com', 'guest123', 'Guest', 'User', 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
