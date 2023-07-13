import express from "express";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
} from "../controllers/veterinarioControllers.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();
//Area publica
router.post("/", registrar);

router.get("/confirmar/:token", confirmar);

router.post("/login", autenticar);
//validar el email del usuario
router.post("/olvide-password", olvidePassword);
//para leer el token
// router.get("/olvide-password/:token", comprobarToken);
//almacenar el nueva password
// router.post("/olvide-password/:token", nuevoPassword);
//sintaxis simplificada;
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

//Area privada
router.get("/perfil", checkAuth, perfil);

router.put("/perfil/:id", checkAuth, actualizarPerfil);

router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;
