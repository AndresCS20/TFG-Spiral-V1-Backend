module.exports = (sequelize, Sequelize) => {
  const Usuario = require('./user.model');
  const Publication = sequelize.define("publicaciones", {
    usuario_id: {
      type: Sequelize.STRING
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


  return Publication;
};