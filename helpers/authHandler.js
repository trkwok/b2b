
import jwt from 'jsonwebtoken';
import env from '../utils/validateENV'
 export const generateJwtToken = (email, agentId) => {
    return jwt.sign({
        email,
        agentId
    }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
    });
};

export const createActivationToken = (email) => {
    return jwt.sign(email, env.ACTIVATION_SECRET, {
        expiresIn: 300, // 5 min in seconds
    });
};

export const getEmailFromActivationToken = (token) => {
    try {
        console.log(token);
        console.log(process.env.ACTIVATION_SECRET)
        const decoded = jwt.verify(token, env.ACTIVATION_SECRET);
        console.log(decoded);
        return decoded.email;
    } catch (error) {
        console.log('here')
        throw error;
    }
};