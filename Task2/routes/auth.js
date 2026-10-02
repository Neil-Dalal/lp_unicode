const express = require('express');
const router = express.Router();
const {login, register} = require('../controllers/logic');

router.route('/checkauth/login')
.post(login);
router.route('/checkauth/register')
.post(register)
module.exports =router;
