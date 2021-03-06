DROP TABLE IF EXISTS codes;

CREATE TABLE codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR REFERENCES users(email) NOT NULL UNIQUE CHECK (email != ''),
    secret VARCHAR NOT NULL CHECK (secret != ''),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
