const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const verify = require('../api/middleware/jwt.js');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;

const MONGO_DB_URL = 'mongodb://mongodb:27017/Cookmaster';
const DB_NAME = 'Cookmaster';

const multer = require('multer');
const multerConfig = require('../api/middleware/multer.js');
const path = require('path');

router.post('/',verify, (req, res) => {
    
    const {name, ingredients, preparation} = req.body;    
    //Validations
    if (!name || !ingredients || !preparation) {
        res.status(400).send({message:'Invalid entries. Try again.'});
    }else{        
        MongoClient.connect(MONGO_DB_URL, (err, db) => {
            if (err) throw err;
            const dbo = db.db(DB_NAME);
            let image;
            let userId = req.userId;

            const myObj = {
                name,
                ingredients,
                preparation,
                image,
                userId
            };
            dbo.collection("recipes").insertOne(myObj,  (err, res) => {
                if (err) throw err;                                           
            });
            dbo.collection("recipes").find({name:`${name}`, ingredients: `${ingredients}` }).toArray( (err, result) => {
                if (err) throw err; 
                recipe = {
                    "name" : result[0]['name'],
                    "ingredients": result[0]['ingredients'],
                    "preparation": result[0]['preparation'],
                    "userId": result[0]['userId'],
                    "_id": result[0]['_id']
                }
                db.close();
                res.status(201).send({"recipe":recipe});                        
            });             
        });     
    }    
});

router.get('/', (req, res) => {         
    MongoClient.connect(MONGO_DB_URL, (err, db) => {
        if (err) throw err;
        let dbo = db.db(DB_NAME);
        
        dbo.collection("recipes").find({}).toArray( (err, result) => {
            if (err) throw err; 
            const recipe = result.map((item)=>{
                return {
                    "_id":item._id,
                    "name":item.name,
                    "ingredients": item.ingredients,
                    "preparation": item.preparation,
                    "userId": item.userId
                }
            } );            
            db.close();
            res.status(200).send(recipe);                        
        });             
    });     
});

router.get('/:id', (req, res) => {  
    const {id} = req.params;           

    if (id.length !== 24){
        res.status(404).send({"message":"recipe not found"});    
    }else{
        MongoClient.connect(MONGO_DB_URL, (err, db) =>{
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            
            dbo.collection("recipes").find({"_id": ObjectId(id)}).toArray( (err, result) => {
                if (err) throw err; 
                if(result.length == 0) {
                    res.status(404).send({"message":"recipe not found"});    
                }else{
                    const recipe = result.map((item)=>{
                        return {
                            "_id":item._id,
                            "name":item.name,
                            "ingredients": item.ingredients,
                            "preparation": item.preparation,
                            "userId": item.userId
                        }
                    } );            
                    db.close();
                    res.status(200).send(recipe[0]);  
                }                                  
            });             
        });     
    }
});

router.put('/:id/image', verify, multer(multerConfig).single('image'), (req, res) => {  
    const {id} = req.params;
    const pathFile = `localhost:3000/src/uploads/${req.params.id}.jpeg`;
    if (id.length !== 24){
        res.status(404).send({"message":"recipe not found"});    
    }else{

        MongoClient.connect(MONGO_DB_URL, async (err, db) =>{
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            await dbo.collection("recipes").update({"_id": ObjectId(id)},{$set:{image: pathFile}}, ()=> {
                if (err) throw err; 
            });
            
            dbo.collection("recipes").find({"_id": ObjectId(id)}).toArray( (err, result) => {
                if (err) throw err; 

                if(result.length == 0) {
                    res.status(404).send({"message":"recipe not found"});    
                }else{            
                    res.status(200).send(result[0]);  
                }                                  
            });            
            db.close();
        });     
    }
});

router.get('/image/:id', (req, res) => {  

    const {id} = req.params;  
    
    if (id.length !== 24){
        res.status(404).send({"message":"recipe not found"});    
    }else{
        MongoClient.connect(MONGO_DB_URL, async (err, db) =>{
            if (err) throw err;
            const dbo = db.db(DB_NAME);

            await dbo.collection("recipes").find({"_id": ObjectId(id)}).toArray( (err, result) => {
                if (err) throw err;                 
                
                if(result.length == 0) {
                    res.status(404).send({"message":"recipe not found"});    
                }else{
                    res.status(200).send(`http://localhost:3000/${id}.jpeg`);
                }
                db.close();
            });            
        }); 
    }
});

router.put('/:id', verify, (req, res) => {  
    const {id} = req.params;
    const {name, ingredients, preparation} = req.body;

    if (id.length !== 24){
        res.status(404).send({"message":"recipe not found"});    
    }else{

        MongoClient.connect(MONGO_DB_URL, async (err, db) =>{
            if (err) throw err;
            let dbo = db.db(DB_NAME);
            await dbo.collection("recipes").update({"_id": ObjectId(id)},{$set:{name: name, ingredients: ingredients, preparation: preparation}}, ()=>{
                if (err) throw err; 
            });
            
            dbo.collection("recipes").find({"_id": ObjectId(id)}).toArray( (err, result) => {
                if (err) throw err; 

                if(result.length == 0) {
                    res.status(404).send({"message":"recipe not found"});    
                }else{
                    const recipe = result.map((item)=>{
                        return {
                            "_id":item._id,
                            "name":item.name,
                            "ingredients": item.ingredients,
                            "preparation": item.preparation,
                            "userId": item.userId
                        }
                    } );                                
                    res.status(200).send(recipe[0]);  
                }                   
                db.close();               
            });            
        });     
    }
});

router.delete('/:id', verify, (req, res) => {  

    const {id} = req.params;    
    let userId;
    let userRole;
    if (id.length !== 24){
        res.status(404).send({"message":"recipe not found"});    
    }else{
        MongoClient.connect(MONGO_DB_URL, async (err, db) =>{
            if (err) throw err;
            const dbo = db.db(DB_NAME);

            await dbo.collection("recipes").find({"_id": ObjectId(id)}).toArray( (err, result) => {
                if (err) throw err;                 
                
                if(result.length == 0) {
                    res.status(404).send({"message":"recipe not found"});    
                }else{
                    userId = result[0].userId;
                    dbo.collection("users").find({"_id": ObjectId(userId)}).toArray( (err, result) => {
                        if (err) throw err;
                        userRole = result.role;
                    });

                    if(req.role == 'admin' || userId == req.userId){
                        dbo.collection("recipes").deleteOne({"_id": ObjectId(id)});
                        res.status(204).end();
                    }else{
                        res.status(401).send({"message":"missing auth token"});
                    } 
                    db.close();
                }
            });            
        }); 
    }
});

module.exports = router;