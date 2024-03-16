import express from "express";

const router = express.Router();
const {
  getCodeSnippet,
  verifyCodeOutput,
} = require("../controllers/code-snippet-controller");

router.route("/").get(getCodeSnippet).post(verifyCodeOutput);

module.exports = router;
