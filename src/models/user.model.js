module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("usuarios", {
    username: {
      type: Sequelize.STRING
    },
    fullname:{
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    },
    profile_pic: {
      type: Sequelize.STRING
    },
    banner_pic: {
      type: Sequelize.STRING
    },
    ubication: {
      type: Sequelize.STRING
    },
    interests: {
      type: Sequelize.STRING
    },
    link: {
      type: Sequelize.STRING
    },
    spotify_playlist: {
      type: Sequelize.STRING
    },
    createdAt:{
      type: Sequelize.DATE
    }
  },
  {
      timestamps: false, // Deshabilitar los campos createdAt y updatedAt
  }
  );


  return User;
};
