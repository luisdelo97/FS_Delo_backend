import express from "express";
import dotenv from "dotenv/config";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRouter.js";
import pacienteRoutes from "./routes/pacienteRouter.js";

const app = express();

// con esto le decimos que vamos a estar enviando datos tipo json
app.use(express.json());

//  conectar a la base de datos
conectarDB();

//soluciona el error del cors
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (dominiosPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use("/api/veterinarios", veterinarioRoutes);

app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});
