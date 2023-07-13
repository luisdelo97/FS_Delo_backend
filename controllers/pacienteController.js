import Paciente from "../models/Pacientes.js";
import mongoose from "mongoose";
const agregarPacientes = async (req, res) => {
  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id;
  try {
    const pacienteAlmacenado = await paciente.save();
    res.json(pacienteAlmacenado);
  } catch (error) {
    console.log(error);
  }
};
const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.find()
    .where("veterinario")
    .equals(req.veterinario);
  res.json(pacientes);
};

const obtenerUnPaciente = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Id no válido");
    return res.status(403).json({ msg: error.message });
  }

  const paciente = await Paciente.findById(id);

  if (!paciente) {
    const error = new Error("Paciente no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ meg: "Accion no valida..." });
  }
  //si existe el paciente
  res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(400).json({ meg: "Paciente no encontrado..." });
  }

  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ meg: "Accion no valida..." });
  }

  //Actualizar paciente
  paciente.nombre = req.body.nombre ?? paciente.nombre;
  paciente.propietario = req.body.propietario ?? paciente.propietario;
  paciente.email = req.body.email ?? paciente.email;
  paciente.fecha = req.body.fecha ?? paciente.fecha;
  paciente.sintomas = req.body.sintomas ?? paciente.sintomas;

  try {
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Id no válido");
    return res.status(403).json({ msg: error.message });
  }

  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(400).json({ meg: "Paciente no encontrado..." });
  }

  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ meg: "Accion no valida..." });
  }

  try {
    await paciente.deleteOne();
    res.json({ msg: "Paciente eliminado.." });
  } catch (error) {
    console.log(error);
  }
};

export {
  agregarPacientes,
  obtenerPacientes,
  obtenerUnPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
