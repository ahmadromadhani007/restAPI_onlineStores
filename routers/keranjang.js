const express = require('express');
const router = express.Router();

router.use(require('../controller/keranjang/keranjang'));
    
module.exports = router;