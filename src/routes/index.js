const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send('index');
    res.render('index');
});

router.get('/about', (req, res) => {
    //res.send('about');
    res.render('about');
});

module.exports = router;