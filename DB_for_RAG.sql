-- 1. Users
CREATE TABLE login_credentials (
    user_id VARCHAR(10) PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    domain_role VARCHAR(50) NOT NULL
);

CREATE TABLE documents (
    doc_id SERIAL PRIMARY KEY,
    doc_name VARCHAR(100) NOT NULL,
    doc_path TEXT NOT NULL,
    allowed_roles TEXT NOT NULL,
    uploaded_by VARCHAR(10),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES login_credentials(user_id)
);

CREATE TABLE chunks_metadata (
    chunk_id BIGINT PRIMARY KEY,
    doc_id INT NOT NULL,
    page_number INT,
    chunk_text TEXT NOT NULL,
    allowed_roles TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_document
        FOREIGN KEY (doc_id)
        REFERENCES documents(doc_id)
        ON DELETE CASCADE
);