const express = require('express');
const router = express.Router();

router.use(require('../controller/kategori'));
    
module.exports = router;