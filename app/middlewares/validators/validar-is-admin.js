const { Users } = require('../../database/config');

const validarIsAdmin = async (req, res , next) =>{
    try {
        const user = await Users.findByPk(req.userAuth.id);
        let validRoles = ['ADMINISTRADOR','DESARROLLADOR'];
        if (!validRoles.includes(user.rol)){
            return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `Opps..! Al parecer no tienes permitido esta acción | Comunícate con tu superior`
                    }],
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `Opps..! Al parecer ya venció tu sesión`,
                        error
                    }],
            });
    } 
}

module.exports = {
    validarIsAdmin
}