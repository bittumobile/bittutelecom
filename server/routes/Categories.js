const express = require('express');
const { fetchCategories, createCategory } = require('../controller/Category');
const { isAdmin, isAuth } = require('../services/common');

const router = express.Router();
//  /categories is already added in base path
router.get('/', fetchCategories).post('/', isAuth(), isAdmin, createCategory)

exports.router = router;
