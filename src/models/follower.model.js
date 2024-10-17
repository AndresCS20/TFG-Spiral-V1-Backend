module.exports = (sequelize, Sequelize) => {
    const Follower = sequelize.define("seguidores", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      seguidor_id: {
        type: Sequelize.TEXT
      },
      seguido_id: {
        type: Sequelize.TEXT
      },
      fecha_seguimiento: {
        type: Sequelize.DATE
      }
    },
    {
      timestamps: false, // Deshabilitar los campos createdAt y updatedAt

    });
  
    return Follower;
  };
  