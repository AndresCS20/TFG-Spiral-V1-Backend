module.exports = (sequelize, Sequelize) => {
  const PublicationCommunity = sequelize.define("comunidades_publicaciones", {
    usuario_id: {
      type: Sequelize.STRING
    },
    comunidad_id: {
      type: Sequelize.INTEGER
    },
    contenido: {
      type: Sequelize.TEXT
    },
    fecha_publicacion: {
      type: Sequelize.DATE
    }
  }, {
    timestamps: false, 
  });


  return PublicationCommunity;
};