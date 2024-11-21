const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next){
    const secret = '#marcosCostaTrybe#';
    const token = req.headers.authorization;

    if (!token){
        return res.status(401).send({message:"missing auth token"});
    }

    jwt.verify(token, secret, (err, decoded)=>{
        
        if(err){            
            return res.status(401).send({message:"jwt malformed"});
        }
        req.userId = decoded.user._id;
        req.role = decoded.user.role;
                
        return next();
    } )
}

module.exports = verifyJWT;