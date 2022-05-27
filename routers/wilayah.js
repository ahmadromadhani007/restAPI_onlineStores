const express = require('express');
const router = express.Router();

router.use(require('../controller/wilayah'));
    
module.exports = router;