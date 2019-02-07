const express = require('express');
const { checkConnectedAndActive } = require('../configs/middlewares')
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', checkConnectedAndActive, (req,res,next)=> {
  let user = req.user // When the user is connected, req.user is a document with the information of the logged in user
  res.render('profile', {
    user
  })
})

module.exports = router;