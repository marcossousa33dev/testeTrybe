const jwt = require('jsonwebtoken');

function tokenjwt(user){
    const secret = '#marcosCostaTrybe#';    
    return jwt.sign({user}, secret, {expiresIn:60*60*5});
}

module.exports = tokenjwt;