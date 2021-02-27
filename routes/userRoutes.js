const express = require("express");

const router = express.Router();

const RouterController = require("../controllers/userRouteController");

router.get("/", RouterController.getAll);

router.get("/popularchoices", RouterController.getPopularCholices);

router.get("/search/:id", RouterController.getBySearch);

router.post("/addcourse", RouterController.addCourse);

router.post("/signup", RouterController.signUp);

router.post("/login", RouterController.logIn);

router.post("/logout", RouterController.logout);

router.get("/confirmuser/:id", RouterController.verifyUser);

module.exports = router;
