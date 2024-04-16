import express from 'express';
import mongoose from 'mongoose';
import routes from './src/routes/userRoutes.js';
import jwt from 'jsonwebtoken';


const app = express();
const PORT = process.env.PORT || 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/CRMdb');


// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//JWT setup
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});


routes(app);

app.get('/', (req, res) => 
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, '0.0.0.0', () => 
    console.log(`Your server is running on port ${PORT}`)
);
