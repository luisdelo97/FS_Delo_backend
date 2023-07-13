import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  //Prevenir usuarios duplicados
  const existeUsuario = await Veterinario.findOne({ email: email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Guardar un nuevo usuario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();
    res.json(veterinarioGuardado);

    //Enviar el email de registro
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json(veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido..");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    const usuarioGuardado = await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmando correctamente..." });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email: email });

  if (!usuario) {
    const error = new Error("Usuario no valido..");
    return res.status(403).json({ msg: error.message });
  }
  //Comprobar si el email esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada..");
    return res.status(403).json({ msg: error.message });
  }
  //Revisar el password
  if (await usuario.comprobarPassword(password)) {
    // Autenticar
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("El password es incorrecto..");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email: email });

  if (!existeVeterinario) {
    const error = new Error("No existe este usuario..");
    return res.status(404).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarID();
    await existeVeterinario.save();

    //Enviar el email de olvide password
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });

    res.json({ msg: "Hemos enviado el email con las instrucciones.." });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token: token });
  if (tokenValido) {
    // el token es valido el usuario existe
    res.json({ msg: "el token es valido el usuario existe" });
  } else {
    const error = new Error("Token no valido...");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });
  if (!veterinario) {
    const error = new Error("Token no valido..");
    return res.status(404).json({ msg: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: "La contraseña ha sido cambiada correctamente.." });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("No existe este veterinario..");
    return res.status(404).json({ msg: error.message });
  }

  if (veterinario.email !== req.body.email) {
    const { email } = req.body;
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
      const error = new Error("Email ya registrado..");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.telefono = req.body.telefono;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  //Leer los datos
  const { _id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body;
  //Comprobar que el veterinario existe
  const veterinario = await Veterinario.findById(_id);
  if (!veterinario) {
    const error = new Error("No existe este veterinario..");
    return res.status(404).json({ msg: error.message });
  }
  //Comprobar el password
  if (await veterinario.comprobarPassword(pwd_actual)) {
    //Almacenar el nuevo password
    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({ msg: "Password almacenado correctamente.." });
  } else {
    const error = new Error("Password incorrecto..");
    return res.status(404).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
