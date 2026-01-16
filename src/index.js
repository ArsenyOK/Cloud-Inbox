require("dotenv").config();
const { createApp } = require("./app");

const PORT = process.env.PORT || 5000;

async function main() {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
