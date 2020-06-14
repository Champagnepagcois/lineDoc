const express = require('express');
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/helpers');



router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const rows = await pool.query('SELECT * FROM doc WHERE username = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.password)
            if (validPassword) {
                console.log(username);
                const pac = await pool.query('SELECT num_emp FROM doc WHERE username = ?', [username]);
                console.log(username);
                const st = "Inicio de sesion exitoso ";
                const resq = st.concat(Object.values(pac[0]));
                res.send(resq);
            } else {
                res.send("Contraseña incorrecta");
            }
        } else {
            res.send("El usuario no existe");
        };

    } else {
        res.send('Datos incorrectos');
    };


});

router.post('/datos', async (res,req) => {
    const {username} = req.body;
});


module.exports = router;