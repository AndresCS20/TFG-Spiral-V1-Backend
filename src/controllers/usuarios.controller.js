const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");

const getAllUsers = async(req, res)=>{
    const usuarios = await User.findAll(
      {
        attributes: { exclude: ["password"] },
      });
    res.status(200).json({
        ok: true,
        status: 200,
        body: usuarios
    })
}

const getOneUser = async(req, res)=>{
    const username = req.params.username;
    const usuario = await User.findOne({
        where: {username: username},
        attributes: { exclude: ["password"] }
    });
    res.status(200).json({
        ok: true,
        status: 200,
        body: usuario
    })
}

const createUser = async(req, res)=>{
    await User.sync();
    const dataUser = req.body;
    const createUser = await User.create({
        id: dataUser.id,
        username: dataUser.username,
        fullname: dataUser.fullname,
        email: dataUser.email,
        password: dataUser.password
    });
    res.status(201).json({
        ok: true,
        status: 201,
        message: "Usuario creado exitosamente"
    })
}

const updateUser = async(req, res)=>{
    await User.sync();
    const username = req.params.username;
    const dataUser = req.body;
    let passwordHashed;
    if (dataUser.password) {
      passwordHashed = bcrypt.hashSync(dataUser.password, 8);
    }
    const createUser = await User.update({
        username: dataUser.username,
        fullname: dataUser.fullname,
        email: dataUser.email,
        password: passwordHashed,
        bio: dataUser.bio,
        profile_pic: dataUser.profile_pic,
        banner_pic: dataUser.banner_pic,
        ubication: dataUser.ubication,
        interests: dataUser.interests,
        link: dataUser.link,
        spotify_playlist: dataUser.spotify_playlist
    },
    {
        where: {username: username}
    });
    res.status(201).json({
        ok: true,
        status: 201,
        body: updateUser,
        message: "Usuario actualizado exitosamente"
        
    })
}

const deleteUser = async(req, res)=>{
    const username = req.params.username;
    const deleteUser = await User.destroy({
        where: {username: username}
    })
    res.status(204).json({
        ok: true,
        status: 204,
        body: deleteUser,
        message: "Usuario eliminado exitosamente"
       

})};

module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}