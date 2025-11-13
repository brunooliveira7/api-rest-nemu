import { Router } from "express";
import multer from "multer";
import {
  uploadJourneys,
  getProcessedJourneys,
} from "../controllers/journeyController";

const router = Router();

// Salvar o arquivo em memória
const upload = multer({ storage: multer.memoryStorage() });

// Rota para fazer o upload e processar a planilha
router.post("/journeys/upload", upload.single("sheet"), uploadJourneys);

// Rota para obter as jornadas processadas
router.get("/journeys", getProcessedJourneys);

export default router;
