const env = require('dotenv').config();

const express = require('express');
// const multer = require('multer');
const cors = require('cors');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const http = require('http');
const {Server} = require('socket.io');
// const upload = multer()


// const instanceRouter = require('./middleware/internal/instanceRouter');

// configs

const googleClient = require('./lib/GoogleClient');
// const midtransClient = require('./lib/MidtransClient');
const authUrl = googleClient.generateAuthUrl({access_type : 'offline', scope : ['profile', 'email']});



const csrfMiddleware = csrf({
    cookie : {
        key : '_csrf',
        httpOnly : 'true',
        secure : true,
        maxAge : 3600 * process.env.XSRF_TOKEN_LIFETIME
    }
});


// routers


const login = require('./routes/auth/login');
const logout = require('./routes/auth/logout');
const register = require('./routes/auth/register');
const mail = require('./routes/auth/verifyEmail');
const googleRoutes = require('./routes/auth/google/auth');
const midtrans = require('./routes/protected/midtrans');

// test routes
const test = require('./routes/test/testInstanceRoute');


// protected routes 
const user = require('./routes/protected/user');
const game = require('./routes/protected/game');
const subscription = require('./routes/protected/subscription');

// custom global middleware functions
const createCSRF = require('./controller/CsrfController');
const checkCSRFToken = require('./middleware/csrf');
const isAuthenticated = require('./middleware/auth/isAuthenticated');
// const { invalidatePlayerInPool } = require('./controller/GameController');

// front-end middleware
const authenticated = require ('./controller/auth/AuthController');
const { checkPremium } = require('./controller/SubscriptionController');

// app
const app = express();

const server = http.createServer(app); 
const io = new Server(server, {
    cors : {
        origin : process.env.CLIENT_URL, 
    }
}) 




// global middleware

app.use(cors({
    origin : process.env.CLIENT_URL, 
    optionsSuccessStatus: 200,
    credentials : true, 
    methods : ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
// app.use(upload.none());
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use((req, res, next) => {
//     req.redis = redisClient;
//     // req.socket = socket;
//     next();
// });

require('./service/websocket/game')(io, app);



// app.use(csrfMiddleware);
// app.use(checkCSRFToken);



// io.on('connection', socket => {
//     app.use((req, res, next) => {
//         req.socket = socket;
//         console.log(socket)
//         next();
//     });  
// });

// front-end auth
app.get('/auth/fe-auth',  isAuthenticated, authenticated);
app.get('/auth/fe-auth/premium', isAuthenticated, checkPremium); // 404 ????

// test routes 

// app.use('/TEST', test);

// routes
app.use('/play', game);  
app.use('/user', user);
app.use('/midtrans', midtrans);
app.use('/subscription', subscription);
app.use('/auth/login', login);
app.use('/auth/logout', logout);
app.use('/auth/register', register);
app.use('/auth/google', googleRoutes);
app.use('/auth/verify-email', mail);
app.use('/gen-csrf-form-guard/secure-token', createCSRF);

// webSocketServer.listen(8001, () => "WebSocket running on port : " + process.env.PORT);
server.listen(process.env.PORT, () => console.log("Server running on port : " + process.env.PORT));