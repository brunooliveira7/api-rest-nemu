import express from "express";
import journeyRoutes from "./routes/journeyRoutes";

const PORT = 3333;
const app = express();

app.use(express.json());

//Rotas de jornadas
app.use("/api", journeyRoutes);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
