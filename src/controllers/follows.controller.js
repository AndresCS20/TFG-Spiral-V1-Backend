const db = require("../models");
const Follower = db.follower;
const Op = db.Sequelize.Op;
const User = db.user;
const sequelize = db.sequelize;


const getAllFollowersFromUser = async(req,res)=>{

  const query = `
  SELECT usuarios.*, seguidores.fecha_seguimiento
  FROM seguidores
  INNER JOIN usuarios ON seguidores.seguidor_id = usuarios.id
  WHERE seguidores.seguido_id = :userId
`; 
    const username = req.params.username;
    const user = await User.findOne({ where: { username: username } });
    const userId = user.id;

    const [results, metadata] = await sequelize.query(query, {
      replacements: { userId },
    });
    res.status(200).json({
        ok: true,
        status: 200,
        body: results
    });

}

const getAllFollowersFromUserCount = async(req,res)=>{

    const query = `
        SELECT COUNT(*) AS followersCount
        FROM seguidores
        WHERE seguidores.seguido_id = :userId`;
    const username = req.params.username;
    const user = await User.findOne({ where: { username: username } });
    const userId = user.id;

    const [results, metadata] = await sequelize.query(query, {
      replacements: { userId },
    });
    res.status(200).json({
        ok: true,
        status: 200,
        body: results
    });
}

const getAllFollowingFromUser = async(req,res)=>{

    const query = `
    SELECT usuarios.*, seguidores.fecha_seguimiento
    FROM seguidores
    INNER JOIN usuarios ON seguidores.seguido_id = usuarios.id
    WHERE seguidores.seguidor_id = :userId
  `;
    const username = req.params.username;
    const user = await User.findOne({ where: { username: username } });
    const userId = user.id;

    const [results, metadata] = await sequelize.query(query, {
      replacements: { userId },
    });
    res.status(200).json({
        ok: true,
        status: 200,
        body: results
    });

}
const getAllFollowingFromUserCount = async(req,res)=>{

    const query = `
        SELECT COUNT(*) AS followingCount
        FROM seguidores
        WHERE seguidores.seguidor_id = :userId`;
    
    const username = req.params.username;
    const user = await User.findOne({ where: { username: username } });
    const userId = user.id;

    const [results, metadata] = await sequelize.query(query, {
      replacements: { userId },
    });
    res.status(200).json({
        ok: true,
        status: 200,
        body: results
    });
}


const isFollowingThisUser = async (req, res) => {
  const usernameFollower = req.body.usernameFollower;
  const usernameFollowing = req.body.usernameFollowing;

  try {
    const userFollower = await User.findOne({
      where: { username: usernameFollower }
    });

    const userFollowing = await User.findOne({
      where: { username: usernameFollowing }
    });

    const idFollower = userFollower.id;
    const idFollowing = userFollowing.id;

    const query = `
    SELECT COUNT(*) AS isFollowing
      FROM seguidores
      WHERE seguidor_id = :idFollower AND seguido_id = :idFollowing
    `;

    const results = await sequelize.query(query, {
        replacements: {
          idFollower ,
          idFollowing
        },
        type: sequelize.QueryTypes.SELECT
      });

    res.status(200).json({
      ok: true,
      status: 200,
      //body: idFollower
      body: results
    });
  } catch (error) {
    console.error("Error al verificar si el usuario sigue a otro:", error);
    res.status(500).json({ error: "Ocurrió un error al verificar si el usuario sigue a otro" });
  }
};

const createFollow = async (req, res) => {
  const usernameFollower = req.body.usernameFollower;
  const usernameFollowing = req.body.usernameFollowing;

  const userFollower = await User.findOne({
    where: { username: usernameFollower },
  });

  const userFollowing = await User.findOne({
    where: { username: usernameFollowing },
  });

  const idFollower = userFollower.id;
  const idFollowing = userFollowing.id;

  try {
    const createUser = await Follower.create(
      {
        seguidor_id: idFollower,
        seguido_id: idFollowing,
      },
      { timestamps: false } // Para desactivar automáticamente los campos createdAt y updatedAt
    );

    res.status(201).json({
      ok: true,
      status: 201,
      message: 'Usuario seguido correctamente',
    });
  } catch (error) {
    console.error('Error al crear el seguimiento:', error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: 'Error al crear el seguimiento',
    });
  }
};

const deleteFollow = async (req, res) => {
  const usernameFollower = req.body.usernameFollower;
  const usernameFollowing = req.body.usernameFollowing;

  const userFollower = await User.findOne({
    where: { username: usernameFollower },
  });

  const userFollowing = await User.findOne({
    where: { username: usernameFollowing },
  });

  const idFollower = userFollower.id;
  const idFollowing = userFollowing.id;

  try {
    const deleteUser = await Follower.destroy({
      where: {
        seguidor_id: idFollower,
        seguido_id: idFollowing,
      },
      timestamps: false, // Para desactivar automáticamente los campos createdAt y updatedAt
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: 'Usuario dejado de seguir correctamente',
    });
  } catch (error) {
    console.error('Error al dejar de seguir:', error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: 'Error al eliminar el seguimiento',
    });
  }
};

const updatePublication = async(req, res)=>{
    await Usuarios.sync();
    const id = req.params.id;
    const dataUser = req.body;
    const createUser = await Usuarios.update({
        nombre_usuario: dataUser.nombre_usuario,
        nombre_completo: dataUser.nombre_completo,
        correo_electronico: dataUser.correo_electronico,
        contrasena: dataUser.contrasena
    },
    {
        where: {id: id}
    });
    res.status(201).json({
        ok: true,
        status: 201,
        body: updateUser,
        message: "Usuario actualizado exitosamente"
        
    })
}

const deletePublication = async(req, res)=>{
    const id = req.params.id;
    const deleteUser = await Usuarios.destroy({
        where: {id: id}
    })
    res.status(204).json({
        ok: true,
        status: 204,
        body: deleteUser,
        message: "Usuario eliminado exitosamente"
       

})};


module.exports = {
    getAllFollowersFromUser,
    getAllFollowersFromUserCount,
    getAllFollowingFromUser,
    getAllFollowingFromUserCount,
    isFollowingThisUser,
    createFollow,
    deleteFollow,

}