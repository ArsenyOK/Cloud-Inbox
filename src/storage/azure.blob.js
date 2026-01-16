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

  function getContainerClient() {
    return serviceClient.getContainerClient(container);
  }

  async function ensureContainerExists() {
    const containerClient = getContainerClient();
    await containerClient.createIfNotExists();
  }

  async function createUploadUrl(storageKey) {
    const expiresOn = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    const permissions = BlobSASPermissions.parse("cw"); // create + write

    const sas = generateBlobSASQueryParameters(
      {
        containerName: container,
        blobName: storageKey,
        permissions,
        expiresOn,
      },
      credential
    ).toString();

    return `https://${account}.blob.core.windows.net/${container}/${storageKey}?${sas}`;
  }

  async function getBlobInfo(storageKey) {
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(storageKey);

    const props = await blobClient.getProperties();

    return {
      url: blobClient.url,
      size: props.contentLength ?? null,
      contentType: props.contentType ?? null,
      lastModified: props.lastModified
        ? props.lastModified.toISOString()
        : null,
      etag: props.etag ?? null,
    };
  }

  async function downloadTextPreview(storageKey, maxBytes = 200) {
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(storageKey);

    // Important: it's working only for small files
    const downloadResp = await blobClient.download(0, maxBytes);
    const buf = await streamToBuffer(downloadResp.readableStreamBody);
    return buf.toString("utf8");
  }

  return {
    ensureContainerExists,
    createUploadUrl,
    getBlobInfo,
    downloadTextPreview,
  };
}

function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => chunks.push(data));
    readableStream.on("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", reject);
  });
}

module.exports = { createAzureBlobProvider };
