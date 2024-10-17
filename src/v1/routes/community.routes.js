const express = require('express');
const router = express.Router();
const communityController = require("../../controllers/communities.controller");
const communityPublications = require("../../controllers/communities.publications.controller");
router
    .get("/", communityController.getAllCommunities)
    .get("/:nombre_comunidad", communityController.getOneCommunity)
    .get("/members/:nombre_comunidad", communityController.getCommunityMembers)
    .get("/user/:username",communityController.getUserCommunities)
    .get("/publications/member/:username",communityPublications.getCommunitiesMemberPublications)
    .get("/publications/community/:nombre_comunidad",communityPublications.getAllPublicationsFromCommunity)
    .post("/publications/create", communityPublications.createPublication)
    .post("/create",  communityController.createCommunity)
    .post("/ismember",communityController.isUserMemberOfCommunity)
    .post("/isstaff",communityController.isUserStaffOfCommunity)
    .post("/joincommunity",communityController.joinCommunity)
    .delete("/leavecommunity",communityController.leaveCommunity)
    .patch("/:id", communityController.updateCommunity)
    .delete("/:id",communityController.deleteCommunity);

    module.exports = router;
