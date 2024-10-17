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
    }
  });

  return User;
};
