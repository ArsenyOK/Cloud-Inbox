const { createAzureBlobProvider } = require("./azure.blob");

function createStorage() {
  if (process.env.STORAGE_PROVIDER === "azure") {
    return createAzureBlobProvider();
  }

  throw new Error("Storage provider not configured");
}

module.exports = { createStorage };
