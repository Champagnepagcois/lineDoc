const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');
// PACIENTES
passport.use('local.login-paciente', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  console.log(req.body,"INICIO DE SESION");
  console.log(req.body.username, "USERNAMELOGIN");
  
  const rows = await pool.query('SELECT * FROM paciente WHERE username = ?', [username]);
  console.log(rows.length),"k pdo";
  if (rows.length > 0) {
    console.log("EXISTE")
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

passport.use('local.signup-paciente', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
  }, async (req, username, password, done) => {

  const { namep, surname_p, surname_m, CURP_pa, tel, cumple,
    codigo_postal, id_esta, id_del, name_col, calle, num_ext, num_int, Password2
  } = req.body;

  let newPac = {
    id_pac: 0,
    CURP_pa,
    namep,
    username,
    password,
    surname_p,
    surname_m,
    tel,
    id_dir: 0,
    cumple,
    id_type: 2,
    id_estatus: 0,
  };
  let col = {
    codigo_postal,
    id_esta: 9,
    id_del,
    name_col,
  };

  let dirUser = {
    id_dir: 0,
    codigo_postal,
    calle,
    num_ext,
    num_int,
  };

  let estatuss = {
    id_estatus:0,
    token: "null",
    username,
  };
 
  console.log(req.body,"BODY");
  newPac.password = await helpers.encryptPassword(password);
  //Saving user in the Database
  const idES = await pool.query('INSERT INTO estatus SET ?', [estatuss]);
  newPac.id_estatus = idES.insertId;

  //Busca si existe su Direccion (CP,COL)
  const ifexistDir = await pool.query('SELECT codigo_postal FROM colonia WHERE codigo_postal = ?', [col.codigo_postal]);
  if (ifexistDir.length > 0) {
    const Dir1 = await pool.query('INSERT INTO dir SET ?', [dirUser]);
    newPac.id_dir = Dir1.insertId;
  } else {
    const Dir2 = await pool.query('INSERT INTO colonia SET ?', [col]);
    
    const insertDir = await pool.query('INSERT INTO dir SET ?', [dirUser]);
    newPac.id_dir = insertDir.insertId;
  };

  // Busca si existe el usuario termino medio (si lo registro el doctor)
  const ifexistPa = await pool.query('SELECT CURP_pa FROM paciente WHERE CURP_pa = ?', [newPac.CURP_pa]);
  if (ifexistPa.length > 0) {
    isInsert = await pool.query('SELECT id_pac FROM paciente where CURP_pa = ?',[newPac.CURP_pa]);
    newPac.id_pac = (Object.values(isInsert[0]));
    console.log(newPac.id_dir, "ESTO ES EL ID DEL PACIENTE");
    await pool.query('UPDATE paciente SET username = ?,password = ?,tel = ?,id_dir=?,cumple = ? WHERE CURP_pa = ?',
		[username, password,tel,newPac.id_dir,cumple,CURP_pa], function (error,result,fields){
    if(error){
      console.log(error,"El pedo es qui");
      return done(null, false, req.flash('message', 'Dato incorrecto'));
    }else{
      return done(null, newPac);
    }
    });
	
	}else{
    idp = await pool.query('INSERT INTO paciente SET ?', [newPac]);
    console.log(idp,'ESTO ES IDP');
		newPac.id_pac = idp.insertId;
		console.log("No existia");
		return done(null, newPac);
		console.log("XDDDDDDDDDDDD");
	};
  
}));

// DOCTOR
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  console.log(req.body,"BODY");
  console.log(req.body.username,"USERNAME");
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

  const { num_emp, cargo, surname_p, surname_m, nameD, cedula, phone, cumple } = req.body;
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
    id_type: 1,
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO doc SET ? ', newUser);
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  if(user.id_pac !==undefined){
    done(null, {
        id_user: user.id_pac,
        userType: user.id_type
    });
  };
  if(user.num_emp !== undefined){
    done(null, {
      id_doctor: user.num_emp,
      userType : user.id_type
    });
  };  
});

passport.deserializeUser(async (obj, done) => {
  var user;
  if (obj.userType == 1) {
    user = await pool.query('SELECT * FROM doc WHERE num_emp =?', (obj.id_doctor));
  }
  if (obj.userType == 2) {
    user = await pool.query('SELECT * FROM paciente WHERE id_pac =?', [obj.id_user]);
  }
  done(null, user[0]);

});

