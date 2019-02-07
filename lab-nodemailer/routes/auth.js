const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  if (email === "") {
    res.render("auth/signup", { message: "Indicate email" });
    return;
  }
  
  
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }
    const confirmationCode =  token;
    
    const newUser = new User({
      username: username,
      password: hashPass,
      email: email,
      confirmationCode: confirmationCode,
    });

    // send an email,  with the text http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER

    router.post('/send-email', (req, res, next) => {
      let { email } = req.body;
      transporter.sendMail({
        from: '"WEB DEVELOPER" <iyereemmanuelakhere@gmail.com>',
        to: email, 
        subject: subject, 
        text: "http://localhost:3000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER",
        html: `<b>${message}</b>`
      })
      .then(info => res.render('message', {email, subject, message, 
        info: JSON.stringify(info,null,2)
      }))
      .catch(error => console.log(error));
    });


    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
