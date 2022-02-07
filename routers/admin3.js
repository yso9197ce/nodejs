const express = require('express');
const router = express.Router();

router.route('/:id/:aaa?')
      .all((req, res, next) => {
          res.locals.test = "admin3";
          next();
      })
      .get((req, res) => {
        let {url, baseUrl, originalUrl, params, locals = res.locals.milesID + res.locals.test + "get"} = req;
        res.json({url, baseUrl, originalUrl, params, locals});
      })
      .post((req, res) => {
        let {url, baseUrl, originalUrl, params, locals = res.locals.milesID + res.locals.test + "post"} = req;
        res.json({url, baseUrl, originalUrl, params, locals});
      })

module.exports = router;      