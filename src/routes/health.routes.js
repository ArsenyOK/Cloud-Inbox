const express = require("express");

const healthRouter = express.Router();

healthRouter.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "cloud-inbox-api",
    time: new Date().toISOString(),
  });
});

module.exports = { healthRouter };
