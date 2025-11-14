import { Request, Response } from "express";
import { processExcelFile, getJourneys } from "../services/journeyService";

//Para o upload
export const uploadJourneys = (req: Request, res: Response) => {
  try {
    //Arquivo vem em req.file - Multer
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    //Passa o buffer do arquivo para o serviço processar
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

//Obter os dados
export const getProcessedJourneys = (req: Request, res: Response) => {
  try {
    const journeys = getJourneys();
    res.status(200).json(journeys);
  } catch (error) {
    console.error("Erro ao obter jornadas:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};
