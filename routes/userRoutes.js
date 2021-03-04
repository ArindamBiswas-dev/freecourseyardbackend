const express = require("express");

const router = express.Router();

const RouterController = require("../controllers/userRouteController");

router.get("/", RouterController.getAll);

router.get("/popularchoices", RouterController.getPopularCholices);

router.get("/search/:id", RouterController.getBySearch);

router.get("/isfavorite", RouterController.isFavorite);

router.get("/favorites", RouterController.favorites);

router.post("/addcourse", RouterController.addCourse);

router.post("/signup", RouterController.signUp);

router.post("/login", RouterController.logIn);

router.get("/confirmuser/:id", RouterController.verifyUser);

router.post("/setfavorite", RouterController.setFavorite);

module.exports = router;
