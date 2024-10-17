const db = require("../models");
const Community = db.community;
const CommunityMembers = db.community.members;
const CommunityStaff = db.community.staffs;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize; 



const getAllCommunities = async (req, res) => {
  try {
    const query = `
      SELECT c.*, COUNT(cm.usuario_id) AS num_miembros
      FROM comunidades AS c
      LEFT JOIN comunidades_miembros AS cm ON c.id = cm.comunidad_id
      GROUP BY c.id
    `;

    const communities = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      body: communities,
    });
  } catch (error) {
    console.error("Error al obtener las comunidades:", error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener las comunidades",
    });
  }
};

const getOneCommunity = async(req, res)=>{
    const nombre_comunidad = req.params.nombre_comunidad;
    const communities = await Community.findOne({
        where: {nombre_comunidad: nombre_comunidad},
        attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json({
        ok: true,
        status: 200,
        body: communities
    })
}

const joinCommunity = async (req, res) => {
  try {
    const { username, nombre_comunidad } = req.body;

    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ where: { username } });

    // Validar si se encontró el usuario
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Usuario no encontrado',
      });
    }

    // Buscar la comunidad por su nombre
    const community = await Community.findOne({ where: { nombre_comunidad } });

    // Validar si se encontró la comunidad
    if (!community) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Comunidad no encontrada',
      });
    }

    // Verificar si el usuario ya es miembro de la comunidad
    const isMember = await CommunityMembers.findOne({
      where: {
        usuario_id: user.id,
        comunidad_id: community.id,
      },
    });

    if (isMember) {
      return res.status(200).json({
        ok: true,
        status: 200,
        message: 'El usuario ya es miembro de la comunidad',
      });
    }

    // Crear una nueva entrada en la tabla de miembros de la comunidad
    await CommunityMembers.create({
      usuario_id: user.id,
      comunidad_id: community.id,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      message: 'El usuario se ha unido a la comunidad exitosamente',
    });
  } catch (error) {
    console.error('Error al unir al usuario a la comunidad:', error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: 'Error al unir al usuario a la comunidad',
    });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { username, nombre_comunidad } = req.body;

    // Buscar el usuario por su nombre de usuario
    const user = await User.findOne({ where: { username } });

    // Validar si se encontró el usuario
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Usuario no encontrado',
      });
    }

    // Buscar la comunidad por su nombre
    const community = await Community.findOne({ where: { nombre_comunidad } });

    // Validar si se encontró la comunidad
    if (!community) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: 'Comunidad no encontrada',
      });
    }

    // Verificar si el usuario es miembro de la comunidad
    const isMember = await CommunityMembers.findOne({
      where: {
        usuario_id: user.id,
        comunidad_id: community.id,
      },
    });

    if (!isMember) {
      return res.status(200).json({
        ok: true,
        status: 200,
        message: 'El usuario no es miembro de la comunidad',
      });
    }

    // Eliminar la entrada de la tabla de miembros de la comunidad
    await CommunityMembers.destroy({
      where: {
        usuario_id: user.id,
        comunidad_id: community.id,
      },
    });

    res.status(200).json({
      ok: true,
      status: 200,
      message: 'El usuario ha salido de la comunidad exitosamente',
    });
  } catch (error) {
    console.error('Error al salir de la comunidad:', error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: 'Error al salir de la comunidad',
    });
  }
};

const createCommunity = async (req, res) => {
    try {
      await Community.sync();
      const dataCommunity = req.body;
  
      // Validar el parámetro 'username'
      const { username } = dataCommunity;
      if (!username) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: "Falta el parámetro 'username'",
        });
      }
  
      // Crear la comunidad
      const createdCommunity = await Community.create(
        {
          nombre_comunidad: dataCommunity.nombre_comunidad,
          nombre_completo_comunidad: dataCommunity.nombre_completo_comunidad,
          descripcion: dataCommunity.descripcion,
          imagen_perfil: dataCommunity.imagen_perfil,
          imagen_portada: dataCommunity.imagen_portada,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
      );
  
      // Obtener el usuario basado en el nombre de usuario
      const user = await User.findOne({
        where: { username: username },
      });
  
      // Validar si se encontró el usuario
      if (!user) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: "Usuario no encontrado",
        });
      }
  
      const community = await Community.findOne({
        where: { nombre_comunidad: dataCommunity.nombre_comunidad },
      });
  
      // Crear el registro en CommunityMembers
      await CommunityMembers.create(
        {
          usuario_id: user.id,
          comunidad_id: community.id,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
      );
  
      // Crear el registro en CommunityStaff
      await CommunityStaff.create(
        {
          usuario_id: user.id,
          comunidad_id: community.id,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
      );
  
      res.status(201).json({
        ok: true,
        status: 201,
        message: "Comunidad creada exitosamente",
      });
    } catch (error) {
      console.error("Error al crear la comunidad:", error);
      res.status(500).json({
        ok: false,
        status: 500,
        message: "Error al crear la comunidad",
      });
    }
  };
  
  const getUserCommunities = async (req, res) => {
    try {
      const { username } = req.params;
  
      const query = `
      SELECT c.*, cm.fecha_union, COUNT(cm.usuario_id) AS num_miembros
      FROM comunidades AS c
      INNER JOIN comunidades_miembros AS cm ON c.id = cm.comunidad_id
      INNER JOIN usuarios AS u ON cm.usuario_id = u.id
      WHERE u.username = :username
      GROUP BY c.id, cm.fecha_union
      `;
  
      const communities = await sequelize.query(query, {
        replacements: { username: username },
        type: sequelize.QueryTypes.SELECT,
      });
  
      res.status(200).json({
        ok: true,
        status: 200,
        communities: communities,
      });
    } catch (error) {
      console.error("Error al obtener las comunidades del usuario:", error);
      res.status(500).json({
        ok: false,
        status: 500,
        message: "Error al obtener las comunidades del usuario",
      });
    }
  };

  const isUserMemberOfCommunity = async (req, res) => {
    try {
      const username = req.body.username;
      const nombre_comunidad = req.body.nombre_comunidad;
  
      const user = await User.findOne({ where: { username: username } });
  
      // Validar si se encontró el usuario
      if (!user) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: "Usuario no encontrado",
        });
      }
  
      const userId = user.id;
  
      const query = `
        SELECT cm.fecha_union, COUNT(cm.usuario_id) AS contador_miembros
        FROM comunidades AS c
        INNER JOIN comunidades_miembros AS cm ON c.id = cm.comunidad_id
        WHERE cm.usuario_id = :userId AND c.nombre_comunidad = :nombre_comunidad
        GROUP BY cm.fecha_union
      `;
  
      const result = await sequelize.query(query, {
        replacements: { userId: userId, nombre_comunidad: nombre_comunidad },
        type: sequelize.QueryTypes.SELECT,
      });
  
      const count = result.length > 0 ? result[0].contador_miembros : 0;
      const isMember = count > 0;
  
      res.status(200).json({
        ok: true,
        status: 200,
        isMember: isMember,
      });
    } catch (error) {
      console.error("Error al comprobar si el usuario es miembro de la comunidad:", error);
      res.status(500).json({
        ok: false,
        status: 500,
        message: "Error al comprobar si el usuario es miembro de la comunidad",
      });
    }
  };
  

  const isUserStaffOfCommunity = async (req, res) => {
    try {
      const username = req.body.username;
      const nombre_comunidad = req.body.nombre_comunidad;
  
      const user = await User.findOne({ where: { username: username } });
  
      // Validar si se encontró el usuario
      if (!user) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: "Usuario no encontrado",
        });
      }
  
      const userId = user.id;
  
      const query = `
        SELECT cm.fecha_asignacion, COUNT(cm.usuario_id) AS contador_miembros
        FROM comunidades AS c
        INNER JOIN comunidades_staffs AS cm ON c.id = cm.comunidad_id
        WHERE cm.usuario_id = :userId AND c.nombre_comunidad = :nombre_comunidad
        GROUP BY cm.fecha_asignacion
      `;
  
      const result = await sequelize.query(query, {
        replacements: { userId: userId, nombre_comunidad: nombre_comunidad },
        type: sequelize.QueryTypes.SELECT,
      });
  
      const count = result.length > 0 ? result[0].contador_miembros : 0;
      const isStaff = count > 0;
  
      res.status(200).json({
        ok: true,
        status: 200,
        isStaff: isStaff,
      });
    } catch (error) {
      console.error("Error al comprobar si el usuario es staff de la comunidad:", error);
      res.status(500).json({
        ok: false,
        status: 500,
        message: "Error al comprobar si el usuario es staff de la comunidad",
      });
    }
  };  

  const getCommunityMembers = async (req, res) => {
    try {

      const communityName = req.params.nombre_comunidad;

      // Obtener la ID de la comunidad basada en el nombre
      const community = await Community.findOne({
        where: { nombre_comunidad: communityName },
        attributes: ['id'],
      });
  
      if (!community) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: "La comunidad no existe",
        });
      }
  
      const communityId = community.id;

      const query = `
        SELECT u.username, u.fullname, u.profile_pic, u.banner_pic,cm.fecha_union, CASE WHEN cs.usuario_id IS NOT NULL THEN true ELSE false END AS administrador
        FROM comunidades_miembros AS cm
        INNER JOIN usuarios AS u ON cm.usuario_id = u.id
        LEFT JOIN comunidades_staffs AS cs ON cm.usuario_id = cs.usuario_id AND cm.comunidad_id = cs.comunidad_id
        WHERE cm.comunidad_id = :communityId
      `;
  
      const members = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { communityId },
      });
  
      res.status(200).json({
        ok: true,
        status: 200,
        body: members,
      });
    } catch (error) {
      console.error("Error al obtener los miembros de la comunidad:", error);
      res.status(500).json({
        ok: false,
        status: 500,
        message: "Error al obtener los miembros de la comunidad",
      });
    }
  };

const updateCommunity = async(req, res)=>{
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

const deleteCommunity = async(req, res)=>{
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
    getAllCommunities,
    getOneCommunity,
    getCommunityMembers,
    createCommunity,
    getUserCommunities,
    isUserMemberOfCommunity,
    isUserStaffOfCommunity,
    joinCommunity,
    leaveCommunity,
    updateCommunity,
    deleteCommunity

}