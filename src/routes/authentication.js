const express = require('express');
const router = express.Router();

const pool = require('../database');

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn, isLoggedInUser, isLoggedInDoc } = require('../lib/auth');

// SIGNUP DOCTOR
router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

// SIGNUP PACIENTE

router.get('/signup-paciente', isNotLoggedIn, (req, res) => {
  res.render('auth/signupPa');
});

router.post('/signup-paciente', isNotLoggedIn, passport.authenticate('local.signup-paciente', {
  successRedirect: '/myprofile',
  failureRedirect: '/signup-paciente',
  failureFlash: true
}));


// SINGIN  DOCTOR
router.get('/signin', isNotLoggedIn, (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  }
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});


// SINGIN PACIENTE
router.post('/signin-user', isNotLoggedIn, (req, res, next) => {
  req.check('username', 'Username is Required').notEmpty();
  req.check('password', 'Password is Required').notEmpty();
  const errors = req.validationErrors();
  if (errors.length > 0) {
    req.flash('message', errors[0].msg);
    res.redirect('/signin');
  };
  passport.authenticate('local.login-paciente', {
    successRedirect: '/myprofile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/');
});

router.get('/profile', isLoggedInDoc, async (req, res) => {

  const links = await pool.query('SELECT id_pac FROM receta WHERE num_emp = ?', [req.user.num_emp]);
  console.log(links.length, "LENG");

  res.render('links/profile', { linksle: links.length });
});


router.get('/myprofile', isLoggedInUser, async (req, res) => {

  const pac = await pool.query('SELECT * FROM paciente WHERE id_pac = ?', [req.user.id_pac]);
  console.log(req.user.id_pac, "IDPAC")
  console.log(pac[0], "PAC[0]");
  const pac2 = pac[0];
  const s = await pool.query('SELECT * FROM sangre where id_san = ?', [req.user.id_san]);
  console.log(s, "S");
  const d = await pool.query('SELECT * FROM dir WHERE id_dir =?', [req.user.id_dir]);
  console.log(d, "D");
  //Vemos si hay familiares
  const fa = await pool.query('SELECT id_fam FROM Pac_fam WHERE id_pac = ?', [req.user.id_pac]);
  if (fa[0] == undefined) {
    console.log("No hay familiares");
    res.render('links/patient/receta'), {
      paciente: pac[0],
      san: s[0],
      dir: d[0],
    };
  } else {
    console.log(fa[0], "FA")
    fam = Object.values(fa[0]);
    const f = await pool.query('SELECT * FROM fam WHERE id_fam =?', [fam]);
    console.log(f, f);
    res.render('links/patient/receta'),{
      paciente: pac2,
        san: s[0],
        dir: d[0],
        fam: f[0]
      };
  }


  console.log(pac2, "PAC2");

});

module.exports = router;
