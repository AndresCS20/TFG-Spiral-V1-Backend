module.exports = (sequelize, Sequelize) => {
    const Community = sequelize.define("comunidades", {
      nombre_comunidad: {
        type: Sequelize.TEXT
      },
      nombre_completo_comunidad: {
        type: Sequelize.TEXT
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      imagen_perfil: {
       type: Sequelize.TEXT
      },
      imagen_portada: {
        type: Sequelize.TEXT
      },
      fecha_creacion: {
        type: Sequelize.DATE
      }
    },
    {
        timestamps: false, // Deshabilitar los campos createdAt y updatedAt
    }
    );
  
    return Community;
  };
