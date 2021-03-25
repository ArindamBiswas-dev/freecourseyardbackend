const express = require('express');

const router = express.Router();

const RouterController = require('../controllers/userRouteController');

router.get('/', RouterController.getAll);

router.get('/popularchoices', RouterController.getPopularCholices);

router.get('/search/:id', RouterController.getBySearch);

router.get('/singlesearch/:id', RouterController.getBySingleSearch);

router.get('/autocompletesearch', RouterController.getByAutocompleteSearch);

router.get('/catagory/:id', RouterController.getCatagorySearch);

router.post('/addcourse', RouterController.addCourse);

router.get('/confirmuser/:id', RouterController.verifyUser);

router.get('/isfavorite', RouterController.isFavorite);

router.get('/favorites', RouterController.favorites);

router.post('/signup', RouterController.signUp);

router.post('/login', RouterController.logIn);

router.post('/setfavorite', RouterController.setFavorite);

module.exports = router;
