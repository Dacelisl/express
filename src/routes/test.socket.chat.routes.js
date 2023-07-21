
import express from "express";

export const TestSocketChatRoutes = express.Router();

TestSocketChatRoutes.get("/", (req, res) => {
  return res.render("test-chat", {});
});