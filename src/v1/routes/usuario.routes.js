const express = require('express');
const router = express.Router();
const usuariosController = require("../../controllers/usuarios.controller");

const Usuarios = require("../../models/user.model");
router
    .get("/", usuariosController.getAllUsers)
    .get("/:username", usuariosController.getOneUser)
    .post("/",  usuariosController.createUser)
    .patch("/:username", usuariosController.updateUser)
    .delete("/:username",usuariosController.deleteUser);

    module.exports = router;
