const checkPostRequestBody = (req,res,next) =>{
    try {
        if(!req.body){
            return res.status(400).send('Please provide user details')
        }
        if(req.user.role != 'admin'){
            return res.status(400).send('you are not authorized')
        }
        next();
    } catch (error) {
        return res.status(500).send({error: error})
    }
}
const checkGetRequestBody = (req,res,next) =>{
    try {
        if(req.user.role != 'admin'){
            return res.status(400).send('you are not authorized')
        }
        next();
    } catch (error) {
        return res.status(500).send({error: error})
    }
}

module.exports = {checkPostRequestBody,checkGetRequestBody};