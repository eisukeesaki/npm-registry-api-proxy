-- DATABASE
CREATE DATABASE "npm_registry_api_proxy";
\c npm_registry_api_proxy

-- FUNCTIONS
CREATE OR REPLACE FUNCTION update_modified_column() 
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.modified = now();
        RETURN NEW; 
    END;
    $$ language 'plpgsql';

-- USER
CREATE TABLE users (
    id bigint
        PRIMARY KEY,
    email VARCHAR(160)
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

-- KEY
CREATE TABLE keys (
    id bigint
        PRIMARY KEY,
    key UUID
        NOT NULL
        UNIQUE,
    user_id bigint
        REFERENCES users,
    created TIMESTAMP
        NOT NULL
        DEFAULT (CURRENT_TIMESTAMP), 
    modified TIMESTAMP
);
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE
    ON keys
    FOR EACH ROW
        EXECUTE PROCEDURE update_modified_column();

-- USAGE
CREATE TABLE usages (
    id bigint
        PRIMARY KEY,
    date_ VARCHAR(40)
        NOT NULL,
    count_ integer
        NOT NULL,
    api_key UUID
        REFERENCES keys(key)
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
    id bigint
        PRIMARY KEY,
    time VARCHAR(500)
        NOT NULL,
    headers jsonb,
    api_key UUID
        NOT NULL
        REFERENCES keys(key),
--    response_id bigint
--        REFERENCES responses,
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
    id bigint
        PRIMARY KEY,
    time VARCHAR(500)
        NOT NULL,
    headers jsonb,
    body jsonb,
    request_id bigint
        NOT NULL
        REFERENCES requests,
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
        response_id bigint
            REFERENCES responses;

