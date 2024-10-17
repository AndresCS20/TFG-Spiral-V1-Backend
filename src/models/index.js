const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    define: {
      timestamps: true, // Esto habilita los campos createdAt y updatedAt en todos los modelos
    },

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.follower = require("../models/follower.model.js")(sequelize,Sequelize);
db.publication = require("../models/publication.model.js")(sequelize, Sequelize);
db.community = require("../models/community.model.js")(sequelize,Sequelize);
db.community.members = require("../models/community.members.model.js")(sequelize,Sequelize);
db.community.staffs = require ("../models/community.staff.model.js")(sequelize,Sequelize);
db.community.publications = require("../models/community.publications.model.js")(sequelize,Sequelize);



db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
