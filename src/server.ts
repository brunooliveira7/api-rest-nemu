import express from "express";
import journeyRoutes from "./routes/journeyRoutes";
import cors from "cors";

const PORT = 3333;
const app = express();

app.use(cors());

app.use(express.json());

//Rotas de jornadas
app.use("/api", journeyRoutes);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
