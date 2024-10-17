const express = require('express');
const router = express.Router();
const followsController = require("../../controllers/follows.controller");

router
    .get("/followers/:username", followsController.getAllFollowersFromUser)
    .get("/followers/:username/count", followsController.getAllFollowersFromUserCount)
    .get("/following/:username", followsController.getAllFollowingFromUser)
    .get("/following/:username/count", followsController.getAllFollowingFromUserCount)
    .post("/isfollowing/", followsController.isFollowingThisUser)
    .post("/createfollow",followsController.createFollow)
    .delete("/deletefollow",followsController.deleteFollow)
    /*.get("/:id", followersController.getOnePublication)
    .post("/",  followersController.createPublication)
    .patch("/:id", followersController.updatePublication)
    .delete("/:id",followersController.deletePublication);*/

    module.exports = router;
