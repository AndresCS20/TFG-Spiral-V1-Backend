const db = require("../models");
const Publication = db.publication;
const User = db.user;
const Op = db.Sequelize.Op;

const sequelize = db.sequelize; // Tu instancia de Sequelize

const getFollowingPublications = async (req, res) => {
  try {
    const { username } = req.params;

    const publicationsQuery = `
    SELECT p.*, u.username, u.fullname, u.profile_pic
    FROM publicaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN seguidores s ON p.usuario_id = s.seguido_id AND s.seguidor_id = (SELECT id FROM usuarios WHERE username = :username)
    WHERE s.seguidor_id IS NOT NULL OR u.username = :username
    ORDER BY p.fecha_publicacion DESC;
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



const getAllPublications = async (req, res) => {
  try {
    const query = `
      SELECT publicaciones.id AS "id_publicacion", publicaciones.*, usuarios.fullname, usuarios.username, usuarios.profile_pic
      FROM publicaciones
      INNER JOIN usuarios ON publicaciones.usuario_id = usuarios.id
      ORDER BY publicaciones.fecha_publicacion DESC
    `;
    const results = await sequelize.query(query, {
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
  await Publication.sync();
  const dataPublication = req.body;

  const username = req.body.username;

  if (!username) {
    return res.status(400).json({
      ok: false,
      status: 400,
      message: "Falta el parámetro 'username'",
    });
  }

  // Obtener la ID del usuario basado en el nombre de usuario
  const user = await User.findOne({
    where: { username: username },
  });

  const createPublication = await Publication.create({
    usuario_id: user.id,
    contenido: dataPublication.contenido,
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
  getFollowingPublications,
  getAllPublications,
  getOnePublication,
  createPublication,
  updatePublication,
  deletePublication,
};