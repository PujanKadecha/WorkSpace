const express = require("express");
const { authenticationToken } = require("../middlewares/auth.middleware");
const {
  getDocument,
  deleteDocument,
  saveDocument,
  saveDocumentToDashboard,
  getDocumentOwner,
} = require("../controllers/document.controller");

const router = express.Router();

router.get("/:documentId", authenticationToken, getDocument);
router.delete("/:documentId", authenticationToken, deleteDocument);
router.put("/:documentId/save", authenticationToken, saveDocument);
router.post(
  "/:documentId/save-to-dashboard",
  authenticationToken,
  saveDocumentToDashboard,
);
router.get("/:documentId/owner", authenticationToken, getDocumentOwner);

module.exports = router;
