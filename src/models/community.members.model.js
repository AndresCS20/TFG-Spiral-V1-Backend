module.exports = (sequelize, Sequelize) => {
    const CommunityMembers = sequelize.define("comunidades_miembros", {
      usuario_id: {
        type: Sequelize.TEXT
      },
      comunidad_id: {
        type: Sequelize.INTEGER
      },
      fecha_union: {
        type: Sequelize.DATE
      }
    },
    {
        timestamps: false, // Deshabilitar los campos createdAt y updatedAt
    }
    );
  
    return CommunityMembers;
  };
