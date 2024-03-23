const env = require('dotenv').config({path : '../.env'});

const {OAuth2Client} = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CLIENT_CALLBACK_URL = process.env.GOOGLE_CLIENT_CALLBACK_URL;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_CALLBACK_URL);

module.exports = googleClient;

