import * as XLSX from "xlsx";

//como vem do Excel
interface Row {
  sessionId: string;
  createdAt: string;
  utm_source: string;
}

//tratamento
interface TouchPoint {
  sessionId: string;
  created_at: Date;
  channel: string;
}

//jornada do user
interface Journey {
  sessionId: string;
  touchPoints: { channel: string; created_at: Date }[];
}

let processedJourneys: Journey[] = [];

export const processExcelFile = (buffer: Buffer): void => {
  //XLSX lê o arquivo
  const workbook = XLSX.read(buffer, { type: "buffer" });
  //Garante leitura na primeira aba
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //Converte para array de objs
  const raw: Row[] = XLSX.utils.sheet_to_json(sheet);

  //Convert o dado bruto para formato - TouchPoint
  const events: TouchPoint[] = raw.map((r) => ({
    sessionId: r.sessionId,
    created_at: new Date(r.createdAt),
    channel: r.utm_source,
  }));

  //Agrupa por sessionId
  const groups = new Map<string, TouchPoint[]>();
  events.forEach((ev) => {
    if (!groups.has(ev.sessionId)) groups.set(ev.sessionId, []);
    groups.get(ev.sessionId)!.push(ev);
  });

  const journeys: Journey[] = [];

  groups.forEach((events, sessionId) => {
    //Ordena por data
    events.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    //Se tiver só 1 ou 2 eventos, não precisa limpar
    if (events.length <= 2) {
      journeys.push({
        sessionId,
        touchPoints: events.map(({ channel, created_at }) => ({
          channel,
          created_at,
        })),
      });
      return;
    }

    const first = events[0];
    const last = events[events.length - 1];

    //Remove canais duplicados - meio
    const seen = new Set<string>();
    const middle = events.slice(1, -1).filter((ev) => {
      if (seen.has(ev.channel)) return false;
      seen.add(ev.channel);
      return true;
    });

    const finalEvents = [first, ...middle, last];

    journeys.push({
      sessionId,
      touchPoints: finalEvents.map(({ channel, created_at }) => ({
        channel,
        created_at,
      })),
    });
  });

  processedJourneys = journeys;
};

export const getJourneys = (): Journey[] => processedJourneys;
