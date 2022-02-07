const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('admin2 root');
})

router.get('/:p1/:p2', (req, res) => {
    let {url, baseUrl, originalUrl, params, locals = res.locals.milesID} = req;
    //res.locals.milesID是從index.js最上面自定義的middleware設定來的
    res.json({url, baseUrl, originalUrl, params, locals});
})

module.exports = router;