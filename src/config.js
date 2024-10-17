const { config } = require("dotenv");

config();

exports ={
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || ""
};