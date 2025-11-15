import { Router } from "express";
import multer from "multer";
import {
  uploadJourneys,
  getProcessedJourneys,
} from "../controllers/journeyController";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/journeys/upload", upload.single("sheet"), uploadJourneys);
router.get("/journeys", getProcessedJourneys);

export default router;
