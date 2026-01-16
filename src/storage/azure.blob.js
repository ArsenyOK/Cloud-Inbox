const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");

function createAzureBlobProvider() {
  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const key = process.env.AZURE_STORAGE_KEY;
  const container = process.env.AZURE_CONTAINER;

  if (!account || !key || !container) {
    throw new Error("Azure storage env vars are missing");
  }

  const credential = new StorageSharedKeyCredential(account, key);
  const serviceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    credential
  );

  async function ensureContainerExists() {
    const containerClient = serviceClient.getContainerClient(container);
    await containerClient.createIfNotExists();
  }

  async function createUploadUrl(storageKey, contentType) {
    const expiresOn = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    const permissions = BlobSASPermissions.parse("cw"); // create + write

    const sas = generateBlobSASQueryParameters(
      {
        containerName: container,
        blobName: storageKey,
        permissions,
        expiresOn,
        contentType,
      },
      credential
    ).toString();

    const uploadUrl = `https://${account}.blob.core.windows.net/${container}/${storageKey}?${sas}`;
    return uploadUrl;
  }

  return { ensureContainerExists, createUploadUrl };
}

module.exports = { createAzureBlobProvider };
