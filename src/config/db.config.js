module.exports = {
  HOST: "localhost",
  USER: "spiral",
  PASSWORD: "123456789",
  DB: "testeando",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
