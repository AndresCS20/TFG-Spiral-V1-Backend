const express = require('express');
const router = express.Router();
const publicationController = require("../../controllers/publications.controller");

router
    .get("/following/:username", publicationController.getFollowingPublications)
    .get("/", publicationController.getAllPublications)
    .get("/:username", publicationController.getOnePublication)
    .post("/createPublication",  publicationController.createPublication)
    .patch("/:id", publicationController.updatePublication)
    .delete("/:id",publicationController.deletePublication);

    module.exports = router;
