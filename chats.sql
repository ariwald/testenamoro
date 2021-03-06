DROP TABLE IF EXISTS chats CASCADE;

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    message TEXT,
    user_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
