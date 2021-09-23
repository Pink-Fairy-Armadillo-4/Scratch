const express = require('express');
const router = express.Router();
//testing purpose
router.post('/login', (req, res) => {
  res.status(200).json({haslogged: true});
});

module.exports = router;