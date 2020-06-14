const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn, isLoggedInDoc, isLoggedInUser, isNotLoggedIn } = require('../lib/auth');



router.get('/add', isLoggedInDoc, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedInDoc, async (req, res) => {
    const { namep, surname_p, surname_m, curp_pa, nameh, sangre, alergia1, alergia2, alergia3, alergia4, enfermedad1,
        enfermedad2, enfermedad3, enfermedad4, nombre1, cantidad1, cada1, durante1, nombre2, cantidad2, cada2, durante2
        , nombre3, cantidad3, cada3, durante3, nombre4, cantidad4, cada4, durante4, nombre5, cantidad5, cada5, durante5, descripcion
    } = req.body;

    const session = {
        num_emp: req.user.num_emp,
        id_type: req.user.userType
    };


    const addPac = {
        id_pac: 0,
        curp_pa,
        namep,
        surname_p,
        surname_m,
        id_san: sangre,
        id_type: 1,
        id_hos: 0
    };
    const hoss = {
        id_hos: 0,
        nameh,
    }
    //Agregamos hospital
    const hos = await pool.query('INSERT INTO hospital SET ?', [hoss])
    addPac.id_hos = hos.insertId;
    // Busca si existe el usuario termino medio (si lo registro el doctor)
    const ifexistPa = await pool.query('SELECT CURP_pa FROM paciente WHERE CURP_pa = ?', [curp_pa]);
    if (ifexistPa.length > 0) {
        isInsert = await pool.query('SELECT id_pac FROM paciente where CURP_pa = ?', [curp_pa]);
        addPac.id_pac = (Object.values(isInsert[0]));
        /*******VEMOS SI HAY RECETA ACTIA******* */
    const ifexistRec = await pool.query('SELECT id_receta FROM receta WHERE id_pac = ?' [addPac.id_pac]);
        const idrec = Object.values(ifexistRec[0]);
        await pool.query('DELETE FROM receta WHERE id_pac =?'[idrec]);

    await pool.query('UPDATE paciente SET id_san = ? WHERE CURP_pa = ?', [sangre, curp_pa]);
    } else {
        var residpa = await pool.query('INSERT INTO paciente SET ?', [addPac]);
        addPac.id_pac = residpa.insertId;
        console.log('--Persona agregada');
        console.log(addPac);
    };


    //*****************Historial************************ */
    const his = {
        id_his: 0,
        num_emp: session.num_emp,
    };
    const residhis = await pool.query('INSERT INTO historial set ?', [his]);

    console.log('--Historial Agregado')
    /*---------------------Receta------------------------ */
    const recetaadd = {
        id_receta: 0,
        id_his: residhis.insertId,
        num_emp: session.num_emp,
        id_pac: addPac.id_pac
    };
    const con = await pool.query('INSERT INTO receta set ?', [recetaadd]);

    console.log('--Receta agregada');
    /* ------------------Paciente-Historial ------------------------*/
    const paHIs = {
        id_pac: addPac.id_pac,
        id_his: residhis.insertId
    };
    await pool.query('INSERT INTO pa_his set ?', [paHIs]);

    console.log('--paciente-receta Agregados');


    //*****************Alergias************************ */
    const al = [{ id_ale: 0, descripcion: alergia1 },
    { id_ale: 0, descripcion: alergia2 },
    { id_ale: 0, descripcion: alergia3 },
    { id_ale: 0, descripcion: alergia4 }
    ];
    var arrayAle = [];
    for (i = 0; i < 4; i++) {
        var n = i;
        var idAle1 = await pool.query('INSERT INTO alergias  set ?', [al[n]]);
        arrayAle.push(idAle1.insertId);
        const inseAle = {
            id_pac: addPac.id_pac,
            id_ale: arrayAle[n]
        };
        console.log(inseAle);
        await pool.query('INSERT INTO Pac_ale set ?', [inseAle]);
    };
    console.log('--Alergias agregadas');
    //*****************Enfermedad************************ */

    const enf = [
        { id_enf: 0, name_enfer: enfermedad1 },
        { id_enf: 0, name_enfer: enfermedad2 },
        { id_enf: 0, name_enfer: enfermedad3 },
        { id_enf: 0, name_enfer: enfermedad4 }
    ];
    var arrayEnf = [];
    for (i = 0; i < 4; i++) {
        var n = i;
        var idEnf = await pool.query('INSERT INTO enfermedad  set?', [enf[n]]);
        arrayEnf.push(idEnf.insertId);
        const hisEnf = {
            id_his: residhis.insertId,
            id_enf: arrayEnf[n]
        };
        await pool.query('INSERT INTO his_enf set ?', [hisEnf]);
    };
    console.log("--Enfermedades agregadas");
    //*****************Medicina************************ */


    const med = [
        { id_infomedi: 0, durante: durante1, cantidad: cantidad1, cada: cada1, nombre: nombre1 },
        { id_infomedi: 0, durante: durante2, cantidad: cantidad2, cada: cada2, nombre: nombre2 },
        { id_infomedi: 0, durante: durante3, cantidad: cantidad3, cada: cada3, nombre: nombre3 },
        { id_infomedi: 0, durante: durante4, cantidad: cantidad4, cada: cada4, nombre: nombre4 },
        { id_infomedi: 0, durante: durante5, cantidad: cantidad5, cada: cada5, nombre: nombre5 },
    ];
    var arrayMed = [];
    for (i = 0; i < 5; i++) {
        var n = i
        var idMed = await pool.query('INSERT INTO medicamento set?', [med[n]]);
        arrayMed.push(idMed.insertId);
        const hisMed = {
            id_his: residhis.insertId,
            id_infomedi: arrayMed[n]
        };
        await pool.query('INSERT INTO his_med set ?', [hisMed]);
    };
    console.log("--Medicinas agregadas");

    //*****************Comentario************************ */

    const comentario = { id_com: 0, descripcion };
    var intoCom = await pool.query('INSERT INTO comentario set ?', [comentario]);
    var idcom = intoCom.insertId;
    const idCom2 = {
        id_his: residhis.insertId,
        id_com: idcom
    };
    await pool.query('INSERT INTO his_com set ?', [idCom2]);
    console.log('--comentario agregado');



    console.log("****************************Thats ALL***************************************")


    req.flash('success', 'Paciente registrado');
    res.redirect('/links');

});

router.get('/', isLoggedInDoc, async (req, res) => {

    var arraydatospac = [];
    var datosPac;
    const links = await pool.query('SELECT id_pac FROM receta WHERE num_emp = ?', [req.user.num_emp]);
    for (i = 0; i < links.length; i++) {
        const idPaci = (Object.values(links[i]));
        datosPac = await pool.query('SELECT id_pac,CURP_pa,namep,surname_p,surname_m FROM paciente WHERE id_pac = ?', [idPaci]);
        arraydatospac.push(datosPac[0]);
        console.log(arraydatospac[i]);
    };
    console.log(datosPac);
    console.log("---------------THATS WORKED-----------------");
    res.render('links/list', { arraydatospac });
});

router.get('/delete/:id', isLoggedInDoc, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM receta WHERE id_receta = ?', [id]);
    req.flash('Hecho!', 'Paciente eliminado');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedInDoc, async (req, res) => {
    const { id } = req.params; //id = iden es el id de id_his
    const links = await pool.query('SELECT id_pac FROM receta WHERE id_his = ?', [id]);
    console.log(links);
    const idP = (Object.values(links[0])) //idP es id_pad
    const pac = await pool.query('SELECT * FROM paciente where id_pac = ?', [idP]);
    const sang = await pool.query('SELECT tipo FROM sangre WHERE id_san = ?', [pac[0].id_san])
    console.log(pac, "PACIENTE");
    console.log(sang, "SANGRE");
    var arraydatosAle = [];
    const al = await pool.query('SELECT id_ale FROM Pac_ale WHERE id_pac = ?', [idP]);
    for (i = 0; i < al.length; i++) {
        const idalE = (Object.values(al[i]));
        datosAle = await pool.query('SELECT descripcion FROM alergias WHERE id_ale = ?', [idalE]);
        arraydatosAle.push(datosAle[0]);
    }; console.log(arraydatosAle, "ARREGLO DE ALERGIAS");

    var arraydatosEnf = [];
    const en2 = await pool.query('SELECT id_enf FROM his_enf WHERE id_his = ?', [id]);
    for (i = 0; i < en2.length; i++) {
        const idEn = (Object.values(en2[i]));
        datosEnf = await pool.query('SELECT name_enfer FROM enfermedad WHERE id_enf = ?', [idEn]);
        arraydatosEnf.push(datosEnf[0]);
    };
    console.log(arraydatosEnf, "ARRAY ENFERMEDAD");

    var arraydatosMed = [];
    const enf = await pool.query('SELECT id_infomedi FROM his_med WHERE id_his = ?', [id]);
    for (i = 0; i < enf.length; i++) {
        const idmedi = (Object.values(enf[i]));
        datosMed = await pool.query('SELECT * FROM medicamento WHERE id_infomedi = ?', [idmedi]);
        arraydatosMed.push(datosMed[0]);
    };
    console.log(arraydatosMed, "ARRAY MEDICINA");

    var arraydatosCom = [];
    const com = await pool.query('SELECT id_com FROM his_com WHERE id_his = ?', [id]);
    for (i = 0; i < com.length; i++) {
        const idcome = (Object.values(com[i]));
        datosCom = await pool.query('SELECT * FROM comentario WHERE id_com = ?', [idcome]);
        arraydatosCom.push(datosCom[0]);
    };
    console.log(arraydatosCom, "ARRAY COMENTARIOS");
    const arraynum = [1, 2, 3, 4, 5];

    res.render('links/edit',
        {
            link: links[0],
            paciente: pac[0],
            san: sang[0],
            ale: arraydatosAle,
            enf: arraydatosEnf,
            med: arraydatosMed,
            com: arraydatosCom,
            iden: id,
            num: arraynum
        });
    console.log("RENDERIZADO A EDITAR");
});

router.get('/patient/:id', isLoggedInDoc, async (req, res) => {
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
    for (i = 0; i < al.length; i++) {
        const idalE = (Object.values(al[i]));
        datosAle = await pool.query('SELECT descripcion FROM alergias WHERE id_ale = ?', [idalE]);
        arraydatosAle.push(datosAle[0]);
    };
    console.log(arraydatosAle);

    var arraydatosEnf = [];
    const en = await pool.query('SELECT id_his FROM receta WHERE id_pac = ?', [id]);
    const iden = (Object.values(en[0]));
    const en2 = await pool.query('SELECT id_enf FROM his_enf WHERE id_his = ?', [iden]);
    for (i = 0; i < en2.length; i++) {
        const idEn = (Object.values(en2[i]));
        datosEnf = await pool.query('SELECT name_enfer FROM enfermedad WHERE id_enf = ?', [idEn]);
        arraydatosEnf.push(datosEnf[0]);
    };
    console.log(arraydatosEnf);

    var arraydatosMed = [];
    const enf = await pool.query('SELECT id_infomedi FROM his_med WHERE id_his = ?', [iden]);
    for (i = 0; i < enf.length; i++) {
        const idmedi = (Object.values(enf[i]));
        datosMed = await pool.query('SELECT * FROM medicamento WHERE id_infomedi = ?', [idmedi]);
        arraydatosMed.push(datosMed[0]);
    };
    console.log(arraydatosMed);

    var arraydatosCom = [];
    const com = await pool.query('SELECT id_com FROM his_com WHERE id_his = ?', [iden]);
    for (i = 0; i < com.length; i++) {
        const idcome = (Object.values(com[i]));
        datosCom = await pool.query('SELECT * FROM comentario WHERE id_com = ?', [idcome]);
        arraydatosCom.push(datosCom[0]);
    };
    console.log(arraydatosCom);

    var arraydatosFam = [];
    const fam = await pool.query('SELECT id_fam FROM Pac_fam WHERE id_pac = ?', [id]);
    for (i = 0; i < fam.length; i++) {
        const idfam = (Object.values(fam[i]));
        datosFam = await pool.query('SELECT * FROM fam WHERE id_fam = ?', [idfam]);
        arraydatosFam.push(datosFam[0]);
    };
    console.log(arraydatosFam);


    res.render('links/seeAll',
        {
            link: links[0],
            paciente: pac[0],
            san: sang[0],
            ale: arraydatosAle,
            enf: arraydatosEnf,
            med: arraydatosMed,
            com: arraydatosCom,
            iden: iden,
            fam: arraydatosFam[0]
        });
});

router.post('/edit/:id', isLoggedInDoc, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('Hecho!', 'Paciente con datos actualizados');
    console.log(id, "HECHOOOO")
    res.redirect('/links');
});

router.get('/EditProfile/:id', isLoggedInUser, async (req, res) => {
    const { id } = req.params;
    const pac = await pool.query('SELECT * FROM paciente WHERE id_pac= ?', [id]);
    const dire = await pool.query('SELECT * FROM dir WHERE id_dir = ?', [pac[0].id_dir]);
    const co = await pool.query('SELECT * FROM colonia WHERE codigo_postal = ?', [dire[0].codigo_postal]);
    const sa = await pool.query('SELECT * FROM sangre WHERE id_san = ?', [pac[0].id_san]);
    res.render('links/patient/editDaPac', {
        paciente: pac[0],
        dir: dire[0],
        col: co[0],
        san: sa[0]
    });
});

router.post('/EditPro', isLoggedInUser, async (req, res) => {
    const { tel, codigo_postal, id_del, name_col, calle, num_ext, num_int, curp_pa } = req.body;
    const col = {
        codigo_postal,
        id_esta: 9,
        id_del,
        name_col
    };

    await pool.query('UPDATE paciente SET tel = ? WHERE CURP_pa = ?', [tel, curp_pa]);
    const idP = await pool.query('SELECT id_pac FROM paciente WHERE CURP_pa = ?', [req.body.curp_pa]);
    const vaidP = (Object.values(idP));
    console.log(vaidP, "datos actualizados");

    //Busca si existe su Direccion (CP,COL)
    const ifexistDir = await pool.query('SELECT codigo_postal FROM colonia WHERE codigo_postal = ?', [codigo_postal]);
    console.log(ifexistDir, "ESISTE");
    if (ifexistDir.length > 0) {
        const idDirUs = await pool.query('SELECT id_dir FROM paciente WHERE CURP_pa =?', [curp_pa]);
        const idDir2 = Object.values(idDirUs[0])
        console.log(idDir2);
        const Dir1 = await pool.query('UPDATE dir SET codigo_postal=?,calle=?,num_ext=?,num_int=? WHERE id_dir =?', [codigo_postal, calle, num_ext, num_int, idDir2]);
    } else {
        const Dir2 = await pool.query('INSERT INTO colonia SET ?', [col]);
        const idDir = await pool.query('SELECT id_dir FROM paciente WHERE id_pac =?', [vaidP])
        const upobj = { codigo_postal, calle, num_ext, num_int, id_dir: (Object.values(idDir)) };
        const UpdatetDir = await pool.query('UPDATE dir SET codigo_postal =?,calle=?,num_ext=?,num_int=? WHERE id_dir = ?', [upobj]);
    };
    req.flash('success', 'Datos actualizados');
    res.redirect('/myprofile');

});

router.get('/historial/:id', isLoggedInUser, async (req, res) => {
    const { id } = req.params;
    console.log(id, "IDDD");
    var arraydatospac = [];
    var datosPac;
    const links = id;
    console.log((links.length, "LENGHT"))
    for (i = 0; i < links.length; i++) {
        datosPac = await pool.query('SELECT id_pac,CURP_pa,namep,surname_p,surname_m FROM paciente WHERE id_pac = ?', [id]);
        console.log(datosPac, "DATOSSS")
        arraydatospac.push(datosPac[0]);
        console.log(arraydatospac[i], "K PEZ");
    };
    console.log(arraydatospac[0])
    const idH = await pool.query('SELECT id_his FROM receta WHERE id_pac =?', [id]);
    const idhv = Object.values(idH[0]);
    console.log(idhv, "IDHV");
    var arraydatoshis = [];
    const his = await pool.query('SELECT id_his FROM receta WHERE id_pac =?', [id]);
    for (i = 0; i < his.length; i++) {
        const his = await pool.query('SELECT * FROM historial WHERE id_his =?', [idhv]);
        arraydatoshis.push(his[0]);
        console.log(arraydatoshis[i], "AEEAY");
    };
    console.log(arraydatoshis[0], "HISTOSFIA");
    console.log("---------------THATS WORKED-----------------");

    res.render('links/patient/hist', {
        arraydatospac,
        arraydatoshis
    });
});

router.get('/patient/his/:id', isLoggedInUser, async (req, res) => {
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
    for (i = 0; i < al.length; i++) {
        const idalE = (Object.values(al[i]));
        datosAle = await pool.query('SELECT descripcion FROM alergias WHERE id_ale = ?', [idalE]);
        arraydatosAle.push(datosAle[0]);
    };
    console.log(arraydatosAle);

    var arraydatosEnf = [];
    const en = await pool.query('SELECT id_his FROM receta WHERE id_pac = ?', [id]);
    const iden = (Object.values(en[0]));
    const en2 = await pool.query('SELECT id_enf FROM his_enf WHERE id_his = ?', [iden]);
    for (i = 0; i < en2.length; i++) {
        const idEn = (Object.values(en2[i]));
        datosEnf = await pool.query('SELECT name_enfer FROM enfermedad WHERE id_enf = ?', [idEn]);
        arraydatosEnf.push(datosEnf[0]);
    };
    console.log(arraydatosEnf);

    var arraydatosMed = [];
    const enf = await pool.query('SELECT id_infomedi FROM his_med WHERE id_his = ?', [iden]);
    for (i = 0; i < enf.length; i++) {
        const idmedi = (Object.values(enf[i]));
        datosMed = await pool.query('SELECT * FROM medicamento WHERE id_infomedi = ?', [idmedi]);
        arraydatosMed.push(datosMed[0]);
    };
    console.log(arraydatosMed);

    var arraydatosCom = [];
    const com = await pool.query('SELECT id_com FROM his_com WHERE id_his = ?', [iden]);
    for (i = 0; i < com.length; i++) {
        const idcome = (Object.values(com[i]));
        datosCom = await pool.query('SELECT * FROM comentario WHERE id_com = ?', [idcome]);
        arraydatosCom.push(datosCom[0]);
    };
    console.log(arraydatosCom);

    var arraydatosFam = [];
    const fam = await pool.query('SELECT id_fam FROM Pac_fam WHERE id_pac = ?', [id]);
    for (i = 0; i < fam.length; i++) {
        const idfam = (Object.values(fam[i]));
        datosFam = await pool.query('SELECT * FROM fam WHERE id_fam = ?', [idfam]);
        arraydatosFam.push(datosFam[0]);
    };
    console.log(arraydatosFam);


    res.render('links/patient/pachis',
        {
            link: links[0],
            paciente: pac[0],
            san: sang[0],
            ale: arraydatosAle,
            enf: arraydatosEnf,
            med: arraydatosMed,
            com: arraydatosCom,
            iden: iden,
            fam: arraydatosFam[0]
        });
});

router.get('/fam/:id', isLoggedInUser, async (req, res) => {
    const { id } = req.params;

    var arraydatosFam = [];
    const al = await pool.query('SELECT id_fam FROM Pac_fam WHERE id_pac = ?', [id]);
    for (i = 0; i < al.length; i++) {
        const idEnf = (Object.values(al[i]));
        datosFam = await pool.query('SELECT * FROM fam WHERE id_fam = ?', [idEnf]);
        arraydatosFam.push(datosFam[0]);
    };
    console.log(arraydatosFam);
    res.render('links/patient/fam', { arraydatosFam });
});

router.get('/add/fam', isLoggedInUser, async (req, res) => {
    res.render('links/patient/addFam');

})

router.post('/add/fam/', isLoggedInUser, async (req, res) => {


    const { namef, apellido_p, apellido_m, CURP, tel, cumple,
        codigo_postal, id_esta, id_del, name_col, calle, num_ext, num_int } = req.body;

    let newFam = {
        id_fam: 0,
        CURP,
        namef,
        apellido_p,
        apellido_m,
        tel,
        id_dir: 0,
    };
    let col = {
        codigo_postal,
        id_esta: 9,
        id_del,
        name_col,
    };

    let dirFam = {
        id_dir: 0,
        codigo_postal,
        calle,
        num_ext,
        num_int,
    };
    let idFAM = {
        id: 0
    };
    //const id = req.session.passport.user.id_user;
    let infam = {
        id_pac: req.session.passport.user.id_user,
        id_fam: 0
    };
    console.log(newFam, "FAMILIAR");
    console.log(col, "COLONIA")
    //Verificamos que existe el cp
    const dir = await pool.query('SELECT codigo_postal FROM colonia WHERE codigo_postal =?', [codigo_postal]);
    if (dir.length > 0) {
        const idd = await pool.query('INSERT INTO dir SET ?', [dirFam]);
        newFam.id_dir = idd.insertId;
        console.log(newFam.id_dir, "DDDDIIIIr");
        //agrega fam
        const adF = await pool.query('INSERT INTO fam SET ?', [newFam]);
        infam.id_fam = adF.insertId;
        await pool.query('INSERT INTO Pac_fam SET ?', [infam]);
    } else {
        const Dir2 = await pool.query('INSERT INTO colonia SET ?', [col]);
        const insertDir = await pool.query('INSERT INTO dir SET ?', [dirUser]);
        newFam.id_dir = insertDir.insertId;
        //agrega fam
        const adF = await pool.query('INSERT INTO fam SET ?', [newFam]);
        infam.id_fam = adF.insertId;
        await pool.query('INSERT INTO Pac_fam SET ?', [infam]);
        console.log("NOPE")
    };

    req.flash('Hecho!', 'Familiar agregado');
    res.redirect('/myprofile');
});

router.get('/fam/delete/:id', isLoggedInUser, async (req,res) => {
    const { id } = req.params;
   await pool.query('DELETE FROM Pac_fam  WHERE id_fam = ?', [id]);
    req.flash('Hecho!', 'Paciente eliminado');
    res.redirect('/myprofile');
    
});

module.exports = router;