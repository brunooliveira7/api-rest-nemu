//leitura da planilha e o processamento das jornadas
import * as XLSX from "xlsx";

// Verificar a planilha para outros campos - se necessário
interface TouchPoint {
  sessionId: string;
  created_at: Date;
  channel: string;
}

interface Journey {
  sessionId: string;
  touchPoints: { channel: string; created_at: Date }[];
}

//BD - memória para armazenar as jornadas processadas
let processedJourneys: Journey[] = [];

//Processa o buffer do arquivo Excel, extrai e trata as jornadas.
export const processExcelFile = (buffer: Buffer): void => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Converte a planilha para JSON - ajuste o 'header' se os nomes das colunas estiverem errados
  const data: TouchPoint[] = XLSX.utils.sheet_to_json(worksheet, {
    raw: false, // para formatar datas corretamente
    dateNF: "yyyy-mm-dd hh:mm:ss",
  });

  //Agrupar eventos por sessionId
  const journeysMap = new Map<string, TouchPoint[]>();
  for (const event of data) {
    if (!journeysMap.has(event.sessionId)) {
      journeysMap.set(event.sessionId, []);
    }

    // Converte a string de data para um objeto Date para ordenação
    event.created_at = new Date(event.created_at);
    journeysMap.get(event.sessionId)!.push(event);
  }

  const finalJourneys: Journey[] = [];

  //Processar cada jornada individualmente
  for (const [sessionId, events] of journeysMap.entries()) {
    //Ordenar eventos - data de criação
    events.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    if (events.length <= 2) {
      //Se a jornada tem 2 ou menos pontos, não há "meio" para limpar
      finalJourneys.push({
        sessionId,
        touchPoints: events.map((e) => ({
          channel: e.channel,
          created_at: e.created_at,
        })),
      });
      continue;
    }

    // 3. Aplicar regras de limpeza
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

// Retorna as jornadas que foram processadas e estão em memória.
export const getJourneys = (): Journey[] => {
  return processedJourneys;
};
