import jwt from 'jsonwebtoken';

const Token = (email, id) => {
    return jwt.sign({ email: email, _id: id }, process.env.JWT_SECRET);
};

export default Token;