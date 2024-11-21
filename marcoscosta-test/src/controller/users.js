const express = require('express');
const isEmailValid = require('../helpers/email.js');
const ObjectId = require('mongodb').ObjectId;

const verify = require('../api/middleware/jwt.js');

const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const MONGO_DB_URL = 'mongodb://mongodb:27017/Cookmaster';
const DB_NAME = 'Cookmaster';

router.post('/', (req, res) => {
    const {email, password, name} = req.body;    
    //Validations
    if (!name  || !email || !password || !isEmailValid(email)) {
        res.status(400).send({message:'Invalid entries. Try again.'});
    }else{
        const role = "user";
        MongoClient.connect(MONGO_DB_URL, async (err, db) =>{
            if (err) throw err;
            const dbo = db.db(DB_NAME);

            dbo.collection("users").find({email:`${email}`}).toArray((err, result) => {
                if (err) throw err; 
                var e_mail = result.length;
                
                if(e_mail > 0){
                    res.status(409).send({message:'Email already registered'});               
                }else{
                    const myObj = {
                        name,
                        email,
                        password,
                        role
                    };

                    dbo.collection("users").insertOne(myObj, (err, res) => {
                        if (err) throw err;                                           
                    });

                    dbo.collection("users").find({email:`${email}`}).toArray((err, result) => {
                        if (err) throw err; 
                        user = {
                            "name" : result[0]['name'],
                            "email": result[0]['email'],
                            "role": result[0]['role'],
                            "_id": result[0]['_id']
                        }
                        db.close();
                        res.status(201).send({user});                        
                    }); 
                }               
            });             
        });     
    }
});

router.post('/admin', verify, (req, res) => {
    const {email, password, name} = req.body;
    let userId;
    let userRole;    
    //Validations
    if (!name  || !email || !password || !isEmailValid(email)) {
        res.status(400).send({message:'Invalid entries. Try again.'});
    }else{
        const role = "admin";
        MongoClient.connect(MONGO_DB_URL, async (err, db) =>{
            if (err) throw err;
            const dbo = db.db(DB_NAME);

            dbo.collection("users").find({email:`${email}`}).toArray(async (err, result) => {
                if (err) throw err; 
                var e_mail = result.length;
                
                if(e_mail > 0){
                    res.status(409).send({message:'Email already registered'});               
                }else{
                    // console.log(req.userId);
                    userId = req.userId;
                    await dbo.collection("users").find({"_id": ObjectId(userId)}).toArray( (err, result) =>{
                        if (err) throw err;
                        userRole = result[0].role;                 
   
                        if (userRole == 'admin'){
                            const myObj = {
                                name,
                                email,
                                password,
                                role
                            };

                            dbo.collection("users").insertOne(myObj, (err, res) => {
                                if (err) throw err;                                           
                            });

                            dbo.collection("users").find({email:`${email}`}).toArray((err, result) => {
                                if (err) throw err; 
                                user = {
                                    "name" : result[0]['name'],
                                    "email": result[0]['email'],
                                    "role": result[0]['role'],
                                    "_id": result[0]['_id']
                                }
                                db.close();
                                res.status(201).send({user});                        
                            });
                        }else{
                            res.status(403).send({"message":"Only admins can register new admins"});
                        }
                    });                    
                }               
            });             
        });     
    }
});

module.exports = router;