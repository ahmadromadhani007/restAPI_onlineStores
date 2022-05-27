const express = require('express');
const router = express.Router();

router.use(require('../controller/sub_kategori'));
    
module.exports = router;