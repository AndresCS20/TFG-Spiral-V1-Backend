const db = require("../models");
const CommunityPublication = db.community.publications;
const Community = db.community;
const User = db.user;
const Op = db.Sequelize.Op;

const sequelize = db.sequelize; // Tu instancia de Sequelize

const getCommunitiesMemberPublications = async (req, res) => {
  try {
    const { username } = req.params;

    const publicationsQuery = `
      SELECT cp.*, u.username, u.fullname, u.profile_pic, c.nombre_comunidad,c.nombre_completo_comunidad, c.imagen_perfil
      FROM comunidades_publicaciones cp
      JOIN usuarios u ON cp.usuario_id = u.id
      JOIN comunidades_miembros cm ON cm.comunidad_id = cp.comunidad_id
      JOIN comunidades c ON cp.comunidad_id = c.id
      WHERE cm.usuario_id = (SELECT id FROM usuarios WHERE username = :username)
      ORDER BY cp.fecha_publicacion DESC;
    `;
    const publicationsResult = await sequelize.query(publicationsQuery, {
      replacements: { username },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      body: publicationsResult,
    });
  } catch (error) {
    console.error('Error al obtener las publicaciones de los seguidores:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las publicaciones de los seguidores' });
  }
};



const getAllPublicationsFromCommunity = async (req, res) => {
  try {
    const nombre_comunidad  = req.params.nombre_comunidad;
    const query = `
      SELECT CP.id AS "id_publicacion", CP.*, usuarios.fullname, usuarios.username, usuarios.profile_pic
      FROM comunidades_publicaciones AS CP
      INNER JOIN usuarios ON CP.usuario_id = usuarios.id
      INNER JOIN comunidades ON CP.comunidad_id = comunidades.id
      WHERE comunidades.nombre_comunidad = :nombre_comunidad
      ORDER BY CP.fecha_publicacion DESC
    `;
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { nombre_comunidad:nombre_comunidad },
    });

    res.status(200).json({
      ok: true,
      status: 200,
      body: results,
    });
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener las publicaciones" });
  }
};

const getOnePublication = async (req, res) => {
  try {
    const username = req.params.username;

    // Obtener la ID del usuario basado en el nombre de usuario
    const user = await User.findOne({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const query = `
      SELECT publicaciones.*, usuarios.*
      FROM publicaciones
      INNER JOIN usuarios ON publicaciones.usuario_id = usuarios.id
      WHERE usuarios.id = :userId
      ORDER BY publicaciones.fecha_publicacion DESC
    `;

    const results = await sequelize.query(query, {
      replacements: { userId: user.id },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      ok: true,
      status: 200,
      body: results,
    });
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    res.status(500).json({ error: "Ocurrió un error al obtener las publicaciones" });
  }
};

const createPublication = async (req, res) => {
  await CommunityPublication.sync();
  const dataPublication = req.body;

  const username = req.body.username;
  const nombre_comunidad = req.body.nombre_comunidad;
  if (!username) {
    return res.status(400).json({
      ok: false,
      status: 400,
      message: "Falta el parámetro 'username'",
    });
  }

  if (!nombre_comunidad) {
    return res.status(400).json({
      ok: false,
      status: 400,
      message: "Falta el parámetro 'nombre_comunidad'",
    });
  }
  // Obtener la ID del usuario basado en el nombre de usuario
  const user = await User.findOne({
    where: { username: username },
  });

  // Obtener la ID de la comunidad basado en el nombre de comunidad
  const community = await Community.findOne({
    where: { nombre_comunidad: nombre_comunidad },
  });  

  const newPublication = await CommunityPublication.create({
    usuario_id: user.id,
    contenido: dataPublication.contenido,
    comunidad_id : community.id
  }, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  res.status(201).json({
    ok: true,
    status: 201,
    message: "Publicación creada exitosamente",
  });
};

const updatePublication = async (req, res) => {
  await Publication.sync();
  const id = req.params.id;
  const dataPublication = req.body;
  const updatePublication = await Publication.update(
    {
      usuario_id: dataPublication.usuario_id,
      contenido: dataPublication.contenido,
      fecha_publicacion: dataPublication.fecha_publicacion,
    },
    {
      where: { id: id },
    }
  );

  res.status(201).json({
    ok: true,
    status: 201,
    body: updatePublication,
    message: "Publicación actualizada exitosamente",
  });
};

const deletePublication = async (req, res) => {
  const id = req.params.id;
  const deletePublication = await Publication.destroy({
    where: { id: id },
  });

  res.status(204).json({
    ok: true,
    status: 204,
    body: deletePublication,
    message: "Publicación eliminada exitosamente",
  });
};

module.exports = {
  getCommunitiesMemberPublications,
  getAllPublicationsFromCommunity,
  createPublication,

 /* getAllPublications,
  getOnePublication,
  updatePublication,
  deletePublication,*/
};