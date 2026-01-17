# Cloud Inbox (Backend)

Mini project for demonstrating how to use **Node.js + Express + MongoDB Atlas + Azure Blob Storage + Async Worker (Queue)**

Main idea:
✅ **The file uploaded directly to the cloud (Azure Blob) via a SAS URL**

✅ **Creating a task with a link to the file (storageKey)**

✅ **Worker asynchronously processes the Task and updates the result**

## Stack:

- **Node.js + Express**
- **MongoDB Atlas** (Mongoose)
- **Validation**: Zod
- **Logging**: Pino + pino-http
- **Cloud Storage**: Azure Blob Storage (SAS / presign)
- **Async processing**: Queue (MongoQueue) + Worker
- **Config**: `.env`
