const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  console.log(req.body);
  
  const rows = await pool.query('SELECT * FROM doc WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { num_emp,cargo,surname_p,surname_m,nameD,cedula,phone, cumple} = req.body;
  let newUser = {
    num_emp,
    surname_m,
    surname_p,
    username,
    password,
    cargo,
    nameD,
    cedula,
    cumple,
    phone,
    id_type : 1,
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO doc SET ? ', newUser);
  newUser.num_emp = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null,{

   _id: user.num_emp,
   userType: user.id_type,
   idk : user.cargo

  });
});

passport.deserializeUser(async (num_emp, done) => {

  var user;

  if(obj.userType == 1){
    user = await pool.query('SELECT * FROM doc WHERE num_emp =? ', (obj._id));
  }
  if(obj.userType == 2){
    user = await pool.query('SELECT * FROM users WHERE num_emp =? ',  (obj._id));
  }

  done(null, user[0]);
  
});
