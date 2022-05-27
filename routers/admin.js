const express = require('express');
const router = express.Router();

router.use(require('../controller/admin/admin'));
    
module.exports = router;