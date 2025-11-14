import { Request, Response } from "express";
import { processExcelFile, getJourneys } from "../services/journeyService";

export const uploadJourneys = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nenhum arquivo enviado." });
  }

  processExcelFile(req.file.buffer);

  return res.json({ message: "Arquivo processado com sucesso!" });
};

export const getProcessedJourneys = (req: Request, res: Response) => {
  return res.json(getJourneys());
};
