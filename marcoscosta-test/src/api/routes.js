const express = require('express');
const users = require('../controller/users');
const login = require('../controller/login');
const recipes = require('../controller/recipes');

const router = express.Router();

router.use('/users', users);
router.use('/login', login);
router.use('/recipes', recipes);

router.use('/*', (req, res)=> {
    res.status(404).send({message: 'File not found'});
});


module.exports = router;
