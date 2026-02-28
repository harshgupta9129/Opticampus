import express from "express";
import { getAllIssues, getEventsByTime, updateIssueStatus } from "../controllers/maintenance.controller.js";

const router = express.Router();

router.get("/get-all-issues", getAllIssues);
router.post("/update-status", updateIssueStatus);
router.get("/get-events", getEventsByTime);

export default router;
