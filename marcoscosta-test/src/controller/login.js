const express = require('express');
const isEmailValid = require('../helpers/email.js');
const tokenjwt = require('../helpers/tokenjwt.js');

const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const MONGO_DB_URL = 'mongodb://mongodb:27017/Cookmaster';
const DB_NAME = 'Cookmaster';

router.post('/', (req, res) => {
    const {email, password} = req.body;    
    //Validations
    if (!email) {
        res.status(401).send({message:'All fields must be filled'});
    }else if  (!password){
        res.status(401).send({message:'All fields must be filled'});
    }else{        
        MongoClient.connect(MONGO_DB_URL, (err, db) =>{
            if (err) throw err;
            const dbo = db.db(DB_NAME);

            dbo.collection("users").find({email:`${email}`, password:`${password}`}).toArray( (err, result) => {
                if (err) throw err; 
                var login = result.length;                
                
                if(login > 0 && isEmailValid(email)){
                    data = {
                        "_id": result[0]['_id'],                    
                        "email": result[0]['email'],
                        "role": result[0]['role'],                    
                    }
                    const token = tokenjwt(data);                    
                    res.status(200).send({token});                        
                }else{
                    res.status(401).send({message:'Incorrect username or password'});                          
                }               
            });             
        });     
    }
});

module.exports = router;