# IIIT Dharwad Offline RAG Knowledge Portal
A backend project for uploading institutional documents, indexing them for retrieval, and querying them with role-based access control (RBAC).
## What this project does
This project provides two FastAPI services:
- **Ingestion/Indexing API** (`web_text_embedding.py`)
  - Upload PDF, DOCX, and TXT files
  - Extract and chunk text
  - Generate embeddings using `all-MiniLM-L6-v2`
  - Store metadata in PostgreSQL
  - Store vectors in a FAISS index (`halx_index.faiss`)
- **Query API** (`web_query.py`)
  - Accept query + user role
  - Retrieve top candidate chunks from FAISS
  - Enforce RBAC and active-record filtering from PostgreSQL
  - Re-rank with hybrid FAISS + BM25 scoring
  - Return top results with document name and page number
---
## Repository structure
```text
.
├── DB_for_RAG.sql            # PostgreSQL schema (users, documents, chunks metadata)
├── web_query.py              # Query/retrieval FastAPI service
└── web_text_embedding.py     # Upload/indexing FastAPI service
```
Runtime-generated artifacts (not tracked initially):
- `uploads/` — uploaded source files
- `halx_index.faiss` — FAISS vector index
---
## Tech stack
- Python
- FastAPI
- PostgreSQL (`psycopg2`)
- FAISS
- SentenceTransformers (`all-MiniLM-L6-v2`)
- BM25 (`rank_bm25`)
- PDF parsing (`pypdfium2`)
- DOCX parsing (`python-docx`)
---
## Database schema
Apply `DB_for_RAG.sql` to create the required tables:
- `login_credentials`
  - Stores users and their domain roles
- `documents`
  - Stores uploaded document metadata, allowed roles, uploader, and active state
- `chunks_metadata`
  - Stores chunk text, page mapping, allowed roles, and active state
Relationships:
- `documents.uploaded_by -> login_credentials.user_id`
- `chunks_metadata.doc_id -> documents.doc_id`
---
## Prerequisites
- Python 3.9+
- PostgreSQL running locally
- A database named `RAGY`
- Access to install Python packages
> Note: Current code uses hardcoded DB connection values in both Python files.
---
## Setup
1. **Clone repository and enter project**
   ```bash
   git clone <repo-url>
   cd IIIT_DHARWAD--OFFLINE-RAG-KNOWLEDGE-PORTAL
   ```
2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. **Install dependencies**
   ```bash
   pip install fastapi uvicorn sentence-transformers rank-bm25 faiss-cpu psycopg2-binary pypdfium2 python-docx numpy
   ```
4. **Create database schema**
   ```bash
   psql -U postgres -d RAGY -f DB_for_RAG.sql
   ```
5. **(Optional) seed users**
   Insert records into `login_credentials` so `uploaded_by` can reference existing users.
---
## Running the services
Run in separate terminals:
### 1) Ingestion service
```bash
uvicorn web_text_embedding:app --reload --port 8000
```
### 2) Query service
```bash
uvicorn web_query:app --reload --port 8001
```
---
## API reference
### `POST /upload` (Ingestion API)
**File:** `web_text_embedding.py`  
**Form fields:**
- `files`: one or more `.pdf`, `.docx`, `.txt`
- `allowed_roles`: string describing roles allowed to access chunks
- `uploaded_by`: user id (default: `admin`)
**Behavior:**
- Saves files to `uploads/`
- Extracts/chunks text
- Adds records to `documents` and `chunks_metadata`
- Updates/writes `halx_index.faiss`
### `POST /delete-document` (Ingestion API)
Soft-deletes a document by setting `is_active = FALSE` in `documents` and `chunks_metadata`.
### `POST /query` (Query API)
**File:** `web_query.py`  
**JSON body:**
```json
{
  "query": "your question",
  "role": "student"
}
```
**Behavior:**
- Embeds user query and searches FAISS
- Filters chunks by:
  - matching chunk IDs
  - `is_active = TRUE`
  - role match (`allowed_roles ILIKE`)
- Applies BM25 re-ranking
- Returns top 3 results
---
