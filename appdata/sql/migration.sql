-- DATABASE
CREATE DATABASE "npm_registry_api_proxy";
\c npm_registry_api_proxy

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- FUNCTIONS
CREATE OR REPLACE FUNCTION update_modified_column() 
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.modified = now();
        RETURN NEW; 
    END;
    $$ language 'plpgsql';

-- USERS
CREATE TABLE users (
    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),
    username VARCHAR(80)
        NOT NULL
        UNIQUE,
    api_key VARCHAR(1000)
        NOT NULL
        UNIQUE,
    created TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified TIMESTAMP
);
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE
    ON users
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();

-- USAGE
CREATE TABLE usages (
    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),
    date_ VARCHAR(40)
        NOT NULL,
    count_ integer
        NOT NULL,
    user_id UUID
        REFERENCES users
        NOT NULL,
    created TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified TIMESTAMP
);
CREATE TRIGGER update_usages_modtime
    BEFORE UPDATE
    ON usages
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();
 
-- REQUESTS
CREATE TABLE requests (
    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),
    time VARCHAR(500)
        NOT NULL,
    headers jsonb,
    user_id UUID
        REFERENCES users
        NOT NULL,
    created TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified TIMESTAMP
);
CREATE TRIGGER update_requests_modtime
    BEFORE UPDATE
    ON requests
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();

-- RESPONSES
CREATE TABLE responses (
    id UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid(),
    time VARCHAR(500)
        NOT NULL,
    headers jsonb,
    body jsonb,
    request_id UUID
        REFERENCES requests
        NOT NULL,
    created TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified TIMESTAMP
);
CREATE TRIGGER update_responses_modtime
    BEFORE UPDATE
    ON responses
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();

ALTER TABLE requests
    ADD COLUMN
        response_id UUID
            REFERENCES responses;

