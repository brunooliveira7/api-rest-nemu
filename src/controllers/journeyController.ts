//receber o arquivo, enviar a resposta
import { Request, Response } from "express";
import { processExcelFile, getJourneys } from "../services/journeyService";

// Função para o upload
export const uploadJourneys = (req: Request, res: Response) => {
  try {
    // O arquivo vem em req.file graças ao Multer
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    // Passa o buffer do arquivo para o serviço processar
    processExcelFile(req.file.buffer);

    res
      .status(200)
      .json({
        message:
          "Arquivo processado com sucesso!",
      });
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Função para obter os dados
export const getProcessedJourneys = (req: Request, res: Response) => {
  try {
    const journeys = getJourneys();
    res.status(200).json(journeys);
  } catch (error) {
    console.error("Erro ao obter jornadas:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};
