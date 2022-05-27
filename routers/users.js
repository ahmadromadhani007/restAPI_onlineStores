const express = require('express');
const router = express.Router();

router.use(require('../controller/users/users'));
    
module.exports = router;