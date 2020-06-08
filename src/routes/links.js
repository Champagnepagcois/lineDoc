const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

const fromEntries = require('fromentries');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add',isLoggedIn, async (req, res) => {
    const { namep, surname_p, surname_m,curp_pa,nameh,sangre,alergia1,alergia2,alergia3,alergia4,enfermedad1,
        enfermedad2,enfermedad3,enfermedad4,nombre1,cantidad1,cada1,durante1,nombre2,cantidad2,cada2,durante2
        ,nombre3,cantidad3,cada3,durante3,nombre4,cantidad4,cada4,durante4,nombre5,cantidad5,cada5,durante5,descripcion
    } = req.body;

    const session = {num_emp: req.user.num_emp, id_type:req.user.userType
    };


    const addPac = {
        id_pac : 0,
        curp_pa,
        namep,
        surname_p,
        surname_m,
        id_san:sangre,
        id_type: 1
    };
    var residpa = await pool.query('INSERT INTO paciente set ?', [addPac]);
    idPa = residpa.insertId;
    console.log('--Persona agregada');
    console.log(addPac);    
    
//*****************Historial************************ */
    const his = {
        id_his :0,
        num_emp : session.num_emp,
    };
    const residhis = await pool.query('INSERT INTO historial set ?', [his]);

    console.log('--Historial Agregado')
/*---------------------Receta------------------------ */
    const recetaadd = {
        id_receta:0,
        id_his : residhis.insertId,
        num_emp:session.num_emp,
        id_pac : idPa
    };
    const con = await pool.query('INSERT INTO receta set ?',[recetaadd]);

    console.log('--Receta agregada');
/* ------------------Paciente-Historial ------------------------*/
    const paHIs = {
        id_pac : idPa,
        id_his:residhis.insertId
    };
    await pool.query('INSERT INTO pa_his set ?',[paHIs]);

    console.log('--paciente-receta Agregados');


//*****************Alergias************************ */
    const al = [{ id_ale:0 ,descripcion:alergia1},
                { id_ale:0 ,descripcion:alergia2},
                { id_ale:0 ,descripcion:alergia3},
                { id_ale:0 ,descripcion:alergia4}
    ];
    var arrayAle =[];
    for(i=0;i<4;i++){
       var n=i;
       var idAle1 = await pool.query('INSERT INTO alergias  set ?',[al[n]] );
       arrayAle.push(idAle1.insertId);
       const inseAle = {
           id_pac :idPa,
           id_ale : arrayAle[n] 
       };
       console.log(inseAle);
       await pool.query('INSERT INTO Pac_ale set ?',[inseAle]);
    };   
    console.log('--Alergias agregadas');
//*****************Enfermedad************************ */

    const enf = [
        {id_enf:0, name_enfer:enfermedad1},
        {id_enf:0, name_enfer:enfermedad2},
        {id_enf:0, name_enfer:enfermedad3},
        {id_enf:0, name_enfer:enfermedad4}
    ];
    var arrayEnf = [];
    for(i=0;i<4;i++){
        var n=i;
        var idEnf =  await pool.query('INSERT INTO enfermedad  set?',[enf[n]]);
        arrayEnf.push(idEnf.insertId);
        const hisEnf = {
            id_his: residhis.insertId,
            id_enf:arrayEnf[n]
        };
       await pool.query('INSERT INTO his_enf set ?', [hisEnf]);
    };
    console.log("--Enfermedades agregadas");
//*****************Medicina************************ */
   

    const med = [
        {id_infomedi:0,durante:durante1,cantidad:cantidad1,cada:cada1,nombre:nombre1},
        {id_infomedi:0,durante:durante2,cantidad:cantidad2,cada:cada2,nombre:nombre2},
        {id_infomedi:0,durante:durante3,cantidad:cantidad3,cada:cada3,nombre:nombre3},
        {id_infomedi:0,durante:durante4,cantidad:cantidad4,cada:cada4,nombre:nombre4},
        {id_infomedi:0,durante:durante5,cantidad:cantidad5,cada:cada5,nombre:nombre5},
    ];
    var arrayMed = [];
    for(i=0;i<5;i++){
        var n=i
       var idMed = await pool.query('INSERT INTO medicamento set?', [med[n]]);
       arrayMed.push(idMed.insertId);
       const hisMed = {
           id_his:residhis.insertId,
           id_infomedi:arrayMed[n]
       };
       await pool.query('INSERT INTO his_med set ?', [hisMed]);
    };
    console.log("--Medicinas agregadas");
    
//*****************Comentario************************ */

    const comentario = {id_com:0,descripcion};
    var intoCom =  await pool.query('INSERT INTO comentario set ?', [comentario]);
    var idcom = intoCom.insertId;
    const idCom2 = {
        id_his: residhis.insertId,
        id_com:idcom
    };
    await pool.query('INSERT INTO his_com set ?', [idCom2]);
    console.log('--comentario agregado');



    console.log("****************************Thats ALL***************************************")


    req.flash('success', 'Paciente registrado');
    res.redirect('/links');
   
});

router.get('/', isLoggedIn, async (req, res) => {

        var arraydatospac = [];
        var  datosPac;
        const links = await pool.query('SELECT id_pac FROM receta WHERE num_emp = ?', [req.user.num_emp]);
        for(i=0;i<links.length;i++){
            const  idPaci = (Object.values(links[i]));
            datosPac = await pool.query('SELECT id_pac,CURP_pa,namep,surname_p,surname_m FROM paciente WHERE id_pac = ?',[idPaci]);
            arraydatospac.push(datosPac[0]);
            console.log(arraydatospac[i]);
        };        
        console.log(datosPac);
        console.log("---------------THATS WORKED-----------------");
    res.render('links/list', {arraydatospac});
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('Hecho!', 'Paciente eliminado');
    res.redirect('/links');
});

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM doc WHERE num_emp = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.get('/patient/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM receta WHERE id_pac = ?', [id]);
    console.log(links);
    const pac = await pool.query('SELECT * FROM paciente where id_pac = ?', [id])
    console.log(pac);
    console.log(Object.values(pac));
    const sang = await pool.query('SELECT tipo FROM sangre WHERE id_san = ?', [pac[0].id_san]);
    console.log(sang);

    var arraydatosAle = [];
    const al = await pool.query('SELECT id_ale FROM Pac_ale WHERE id_pac = ?', [id]);
    for(i=0;i<al.length;i++){
        const idalE = (Object.values(al[i]));
        datosAle = await pool.query('SELECT descripcion FROM alergias WHERE id_ale = ?', [idalE]);
        arraydatosAle.push(datosAle[0]);
    };
    console.log(arraydatosAle);

    var arraydatosEnf = [];
    const en = await pool.query('SELECT id_his FROM receta WHERE id_pac = ?', [id]);
    const iden = (Object.values(en[0]));
    const en2 = await pool.query('SELECT id_enf FROM his_enf WHERE id_his = ?', [iden]);
    for(i=0;i<en2.length;i++){
        const idEn = (Object.values(en2[i]));
        datosEnf = await pool.query('SELECT name_enfer FROM enfermedad WHERE id_enf = ?',[idEn]);
        arraydatosEnf.push(datosEnf[0]);
    };
    console.log(arraydatosEnf);

    var arraydatosMed = [];
    const enf = await pool.query('SELECT id_infomedi FROM his_med WHERE id_his = ?', [iden]);
    for(i=0;i<enf.length;i++){
        const idmedi = (Object.values(enf[i]));
        datosMed = await pool.query('SELECT * FROM medicamento WHERE id_infomedi = ?', [idmedi]);
        arraydatosMed.push(datosMed[0]);
    }; 
    console.log(arraydatosMed); 

    var arraydatosCom = [];
    const com = await pool.query('SELECT id_com FROM his_com WHERE id_his = ?', [iden]);
    for(i=0;i<com.length;i++){
        const idcome = (Object.values(com[i]));
        datosCom = await pool.query('SELECT * FROM comentario WHERE id_com = ?',[idcome]);
        arraydatosCom.push(datosCom[0]);
    };
    console.log(arraydatosCom);

    res.render('links/seeAll',
    {link: links[0],
    paciente : pac[0],
    san : sang[0],
    ale : arraydatosAle,
    enf : arraydatosEnf,
    med : arraydatosMed,
    com : arraydatosCom});
});

router.post('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('Hecho!', 'Paciente con datos actualizados');
    res.redirect('/links');
});
module.exports = router;

