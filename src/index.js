const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
//const apicache = require("apicache");

const v1UsuarioRouter = require("./v1/routes/usuario.routes");
const v1PublicationRouter = require("./v1/routes/publication.routes");
const v1FollowsRouter = require ("./v1/routes/follows.routes");
const v1CommunityRouter = require("./v1/routes/community.routes"); 
const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");


const app = express();
const PORT = process.env.PORT || 3000;
//const cache = apicache.middleware;

var corsOptions ={
  origin: "http://localhost:8080"
}
// ---- Middlewares ---

app.use(cors(corsOptions));
app.use(morgan("dev"));

// ---- Database ----

const db = require("./models");
const Role = db.role;

//db.sequelize.sync();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('./v1/routes/auth.routes')(app);
require('./v1/routes/user.routes')(app);
//app.use(cache("2 minutes"));

app.use("/api/v1/usuarios", v1UsuarioRouter);
app.use("/api/v1/publications",v1PublicationRouter);
app.use("/api/v1/communities",v1CommunityRouter);
app.use("/api/v1/follows",v1FollowsRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});