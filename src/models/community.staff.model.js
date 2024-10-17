module.exports = (sequelize, Sequelize) => {
    const CommunityStaff = sequelize.define("comunidades_staff", {
      usuario_id: {
        type: Sequelize.TEXT
      },
      comunidad_id: {
        type: Sequelize.INTEGER
      },
      fecha_asignacion: {
        type: Sequelize.DATE
      }
    },
    {
        timestamps: false, // Deshabilitar los campos createdAt y updatedAt
    }
    );
  
    return CommunityStaff;
  };
