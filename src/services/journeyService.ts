import * as XLSX from "xlsx";

// Estruturas dos dados após o processamento
interface TouchPoint {
  sessionId: string;
  created_at: Date;
  channel: string;
}

interface Journey {
  sessionId: string;
  touchPoints: { channel: string; created_at: Date }[];
}

// "Banco de dados volátil" - jornadas processadas
let processedJourneys: Journey[] = [];

// Processa o buffer do arquivo Excel, extrai e trata as jornadas
export const processExcelFile = (buffer: Buffer): void => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Lê a planilha como JSON bruto
  const rawData = XLSX.utils.sheet_to_json(worksheet, {
    raw: false,
    dateNF: "yyyy-mm-dd hh:mm:ss",
  });

  // Mapeia os campos da planilha para o formato esperado pelo sistema
  const data: TouchPoint[] = rawData.map((row: any) => ({
    sessionId: row.sessionId,         
    created_at: new Date(row.createdAt), 
    channel: row.utm_source,           
  }));

  // Agrupar eventos por sessionId
  const journeysMap = new Map<string, TouchPoint[]>();

  for (const event of data) {
    if (!journeysMap.has(event.sessionId)) {
      journeysMap.set(event.sessionId, []);
    }

    journeysMap.get(event.sessionId)!.push(event);
  }

  const finalJourneys: Journey[] = [];

  // Processar cada jornada individualmente
  for (const [sessionId, events] of journeysMap.entries()) {
    // Ordenar eventos pela data
    events.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    // Se existem apenas 2 pontos ou menos, não há "meio" para limpar
    if (events.length <= 2) {
      finalJourneys.push({
        sessionId,
        touchPoints: events.map((e) => ({
          channel: e.channel,
          created_at: e.created_at,
        })),
      });
      continue;
    }

    // Regras de limpeza
    const firstTouchPoint = events[0];
    const lastTouchPoint = events[events.length - 1];
    const middleTouchPoints = events.slice(1, -1);

    const uniqueMiddleChannels = new Set<string>();
    const cleanedMiddle: TouchPoint[] = [];

    for (const event of middleTouchPoints) {
      if (!uniqueMiddleChannels.has(event.channel)) {
        uniqueMiddleChannels.add(event.channel);
        cleanedMiddle.push(event);
      }
    }

    const finalTouchPoints = [
      firstTouchPoint,
      ...cleanedMiddle,
      lastTouchPoint,
    ];

    finalJourneys.push({
      sessionId,
      touchPoints: finalTouchPoints.map((e) => ({
        channel: e.channel,
        created_at: e.created_at,
      })),
    });
  }

  processedJourneys = finalJourneys;
};

// Retorna as jornadas processadas em memória
export const getJourneys = (): Journey[] => {
  return processedJourneys;
};
