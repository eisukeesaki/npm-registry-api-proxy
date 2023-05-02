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

-- REQUESTS
CREATE TABLE requests (
    id
        UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid()
        NOT NULL,
    headers
        jsonb,
    time
        VARCHAR(500)
        NOT NULL,
    created
        TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified
        TIMESTAMP
);
CREATE TRIGGER update_requests_modtime
    BEFORE UPDATE
    ON requests
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();

-- RESPONSES
CREATE TABLE responses (
    id
        UUID
        PRIMARY KEY
        DEFAULT gen_random_uuid()
        NOT NULL,
    request_id
        UUID
        REFERENCES requests
        NOT NULL,
    headers
        jsonb,
    time
        VARCHAR(500)
        NOT NULL,
   body
        jsonb,
   created
        TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified
        TIMESTAMP
);
CREATE TRIGGER update_responses_modtime
    BEFORE UPDATE
    ON responses
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();
