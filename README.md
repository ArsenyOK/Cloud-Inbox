# Cloud Inbox (Backend)

Mini-project for demonstrating how to use **Node.js + Express + MongoDB Atlas + Azure Blob Storage + Async Worker (Queue)**

---

Main idea:

✅ **Files are uploaded directly to cloud storage (Azure Blob) using a SAS URL**

✅ **A task is created with a reference to the uploaded file (`storageKey`)**

✅ **A background worker asynchronously processes the task and updates the result**

---

## Stack:

- **Node.js + Express**
- **MongoDB Atlas** (Mongoose)
- **Validation**: Zod
- **Logging**: Pino + pino-http
- **Cloud Storage**: Azure Blob Storage (SAS / presign)
- **Async processing**: Queue (MongoQueue) + Worker
- **Config**: `.env`

---

## What the project can do

### 1) Tasks

- Create tasks (`PENDING` status)
- Processing by worker (`PROCESSING -> DONE`)
- Fetch a task by ID and check processing result

### 2) Files (Azure Blob)

- Generate **SAS upload URL** (temporary upload link)
- Client uploads files **directly to Azure Blob**, backend does not handle file data
- Worker reads file metadata and a small preview

---

## Architecture

**Flow:**

1. Client → `POST /files/presign` → get `uploadUrl` и `storageKey`
2. Client → `PUT uploadUrl` → file exists on **Azure Blob**
3. Client → `POST /tasks` with `{ title, storageKey }`
4. API → puts `taskId` в **Queue**
5. Worker → reads `taskId`, pulls a file from Azure, updates the Task → `DONE`

**Upload file -> Azure blob -> Create Task -> Worker -> Done**

---

## Requirements

- Node.js 18+
- Account MongoDB Atlas + connection string
- Azure Storage Account + Container + Access Key

**On the `env.simple` you can find all variables what you need**
