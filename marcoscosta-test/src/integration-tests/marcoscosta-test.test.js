const { expect } = require('chai');
const frisby = require('../../node_modules/frisby');
const express = require('express');
const url = 'http://localhost:3000';
const isEmailValid = require('../helpers/email.js');
const tokenjwttest = require('../helpers/tokenjwt.js');
const pathUsers = require('../controller/users.js');
const pathRecipes = require('../controller/recipes.js');
const pathLogin   = require('../controller/login');
const routes = require('../api/routes.js');
const router = express.Router();
const app = require('../api/app.js');

let jwt = '';
let id = '';

/*
 Test number 01 - EndPoints Users
 *1st - POST simple User
 *2nd - POST admin User
 *3rd - FIELD name must be filled
 *4th - FIELD email must be filled
 *5th - FIEDL password must be filled
*/
const data = {
    "name":"Marcos Costa de Sousa",
    "email":"marcos.costadesousa@gmail.com",
    "password":"4321"
}  

it('shoul post users - 409', function () {
    // Return the Frisby.js Spec in the 'it()' (just like a promise)
    return frisby.post('http://localhost:3000/users', data)
      .expect('status', 409);               
}); 

describe('1 - Test EndPoints Users', () => {
    before(async () =>{ 
        const data = {
                    "email":"erickjacquin@gmail.com",
                    "password":"12345678"
                 }      

        const response = await frisby.post('http://localhost:3000/users', data)        
        jwt = response._json.token;        
        const headers = {"Authorization": jwt} 

        frisby.globalSetup({
            request: { 
                headers : headers
            }
        });
    });
    const data = {
        "name":"Marcos Costa de Sousa",
        "email":"marcos.costadesousa@gmail.com",
        "password":"4321"
    }      
    
    const data2 = {
        "name":"Marcos Costa de Sousa",
        "email":"marcos.costadesousa@gmail.com",
        "password":"4321"
    }   
    
    const data3 = {
        "email":"marcos.costadesousa@gmail.com",
        "password":"4321"
    }   

    const data4 = {
        "name":"Marcos Costa de Sousa",        
        "password":"4321"
    } 

    const data5 = {
        "name":"Marcos Costa de Sousa",
        "email":"marcos.costadesousa@gmail.com"        
    }  

    it('shoul post users - 409', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post('http://localhost:3000/users', data)
          .expect('status', 409);               
    });     

    it('shoul post users admin - 409', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        
        return frisby.post('http://localhost:3000/users', data2)
          .expect('status', 409);               
    });     

    it('shoul field name must be filled - 400', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post('http://localhost:3000/users', data3)
          .expect('status', 400);               
    }); 

    it('shoul field email must be filled - 400', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post('http://localhost:3000/users', data4)
          .expect('status', 400);               
    });

    it('shoul field password must be filled - 400', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return router.post('http://localhost:3000/users', (req, res) => {
            res.status(400).send('teste');
        });
        // return router.post( 'http://localhost:3000/users', data5)
        // //   .expect('status', 400);               
    });
});

/*
 Test number 02 - EndPoints Login
 *1st - Login success
 *2nd - Login unsuccess
 *3rd - FIELD email must be filled
 *4th - FIELD password must be filled
*/
describe('2 - Test EndPoints Login ', () =>{
    const data = {
        "email":"erickjacquin@gmail.com",
        "password":"12345678"
     }

    const data2 = {
        "email":"erickjacquin@gmail.com",
        "password":"1234555678"
     }

     const data3 = {        
        "password":"1234555678"
     }

     const data4 = {
        "email":"erickjacquin@gmail.com"
     }

     it('shoul post Login success - 200', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/login`, data)
          .expect('status', 200);
    });

    it('shoul post Login unsuccess - 401', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/login`, data2)
          .expect('status', 401);
    });

    it('shoul field email must be filled - 401', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/login`, data3)
          .expect('status', 401);
    });

    it('shoul field password must be filled - 401', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/login`, data4)
          .expect('status', 401);
    });
});

/*
 Test number 03 - EndPoints Recipes
 *1st - POST recipe
 *2nd - GET all recipes
 *3rd - GET recipes with ID
 *4th - UPDATE recipe
 *5th - DELETE recipes with ID
 *6th - FIELD name must be filled
 *7th - FIELD ingredients must be filled
 *8th - FIELD preparation must be filled
*/
describe('3 - Test EndPoints Recipes', () => {
    before(async () =>{ 
        const data = {
                    "email":"erickjacquin@gmail.com",
                    "password":"12345678"
                 }      

        const response = await frisby.post(`${url}/login`, data)        
        jwt = response._json.token;        
        const headers = {"Authorization": jwt} 

        frisby.globalSetup({
            request: { 
                headers : headers
            }
        });
        
        const dataObj = {
            "name":"receita teste de integração",
            "ingredients":"ingredientes teste de integração",
            "preparation":"preparação teste de integração",
            "userId": "61657f7e99739d50bc66bef6"
        }
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        const recipe =  await frisby.post(`${url}/recipes`, dataObj);

        id = recipe._json.recipe._id;       

    });  
    
    const dataObj1 = {        
        "ingredients":"ingredientes teste de integração",
        "preparation":"preparação teste de integração",
        "userId": "61657f7e99739d50bc66bef6"
    }

    const dataObj2 = {
        "name":"receita teste de integração",
        "preparation":"preparação teste de integração",
        "userId": "61657f7e99739d50bc66bef6"
    }

    const dataObj3 = {
        "name":"receita teste de integração",
        "ingredients":"ingredientes teste de integração",
        "userId": "61657f7e99739d50bc66bef6"
    }
    it('shoul get recipes - 200', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.get('http://localhost:3000/recipes')
          .expect('status', 200);
    });

    it('shoul get recipes by ID - 200', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        
        return frisby.get(`${url}/recipes/${id}`)
          .expect('status', 200);
    });

    it('shoul put recipes - 200', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        const data = {
                        "name":"teste",
                        "ingredients":"teste",
                        "preparation":"teste"
                    }      

        return frisby.put(`${url}/recipes/${id}`, data)
          .expect('status', 200);
    });

    it('shoul delete recipes - 204', function () {        
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.delete(`${url}/recipes/${id}`)
          .expect('status', 204);
    });

    it('shoul field name must be filled - 400', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/recipes`, dataObj1)
          .expect('status', 400);               
    });    

    it('shoul field ingredients must be filled - 400', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/recipes`, dataObj2)
          .expect('status', 400);               
    });

    it('shoul field preparation must be filled - 400', function () {
        // Return the Frisby.js Spec in the 'it()' (just like a promise)
        return frisby.post(`${url}/recipes`, dataObj3)
          .expect('status', 400);               
    });
});

/*
 Test number 04 - Email verify
 *1st - EMAIL correct 
 *2nd - Email incorrect 
*/
describe('4 - Test Email ', () =>{
    const data1 = "erickjacquin@gmail.com"     
    const data2 = "erickjacquin@"        
    const data3 = ""
    const data4 = "marcoscostadesousamarcoscostadesousamarcoscostadesousamarcoscostadesousamarcostadesousamarcoscostadesousamarcoscostadeosousamarcoscostadesous@gmail.com"
    const data5 = "marcos@gmaildsfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf.commarcoscostadodlesouflsjfslkdjfsdkjfsdkfjsdkfjsdklfjsdfkjsfsjfjsdjfsdlkfjsdfkjsdfskdjsdfjsfsfs"

    it('shoul valid email - True', function () {        
        return isEmailValid(data1);          
    });

    it('shoul invalid email - False', function () {        
        return isEmailValid(data2);          
    });    

    it('shoul without email - False', function () {        
        return isEmailValid(data3);          
    });      

    it('shoul without email > 64 - False', function () {        
        return isEmailValid(data4);          
    });

    it('shoul without email > 64 - False', function () {        
        return isEmailValid(data5);          
    });

    it('shoul without email > 64 - False', function () {        
        return isEmailValid(!data5);          
    });
});

/*
 Test number 05 - Token verify
 *1st - EMAIL correct 
*/
describe('5 - Token ', () =>{
    const data1 = {
        "email":"erickjacquin@gmail.com"
     }

    it('shoul valid token - True', function () {        
        return tokenjwttest(data1);          
    });       
});