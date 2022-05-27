const express = require('express');
const router = express.Router();

router.use(require('../controller/produk'));
    
module.exports = router;