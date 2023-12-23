require('dotenv/config');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req,res,next) =>{
    const token = req.header('auth_token');
    try {
        const data = jwt.verify(token, JWT_SECRET);
        if(!data){
            res.status(401).send("Please use a valid auth code")
        }
        else{
            req.users=data.users;
            next();
        }

    } catch (error) {
         res.status(400).send({error: error.message,location: "fetchuser"});
    }
}

module.exports = fetchuser;