CREATE TABLE IF NOT EXISTS forgot_password (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    code_otp int,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp,
    deleted_at timestamp
);