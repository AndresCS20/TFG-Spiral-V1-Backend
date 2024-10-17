const express = require("express");
const router = express.Router();

router
    .route("/")
    .get((req,res)=>{
        res.send(`<h1>Hello desde ${req.baseUrl}`);
    });

module.exports = router;    