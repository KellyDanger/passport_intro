const express = require('express');
const { eventChannel } = require('redux-saga');
const router = express.Router();
const pool = require('../modules/pool');

// This route *should* return the logged in users pets
router.get('/', (req, res) => {
    console.log('/pet GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);

    if(req.isAuthenticated() === false) {
        res.sendStatus(403);
    } else {
        let queryText = `SELECT * FROM "pet" WHERE "user_id" = $1`;
        pool.query(queryText, [req.user.id]).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
    }
});

//could also use for admin stuff...
// if(user.admin === true)...or if(user.level > 3) etc.

// This route *should* add a pet for the logged in user
router.post('/', (req, res) => {
    console.log('/pet POST route');
    console.log(req.body);
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    if(req.isAuthenticated()){
        let queryText = `INSERT INTO "pet" ("firstname", "user_id") VALUES ($1, $2);`;
        pool.query(queryText, [req.body.firstName, req.user.id])
        .then((result) => {
            res.sendStatus(200);      
        }).catch((error) => {
            res.sendStatus(500)
        })
    } else {
        res.sendStatus(403);
    } 
});

module.exports = router;
