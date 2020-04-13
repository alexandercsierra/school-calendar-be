const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const templateRoute = require('../routes/template');
const { google } = require('googleapis');

//Require env variables
require('dotenv').config();
const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/template', templateRoute);

server.get('/', (req, res) => {
  res.send({ api: 'Ok', dbenv: process.env.DB_ENV });
});

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;

server.get('/login', (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar.events', ' https://www.googleapis.com/auth/userinfo.profile']
        });
        // res.redirect(url);
        res.send(url);
        // authed = true;
    } else {
        // const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        // gmail.users.labels.list({
        //     userId: 'me',
        // }, (err, res) => {
        //     if (err) return console.log('The API returned an error: ' + err);
        //     const labels = res.data.labels;
        //     if (labels.length) {
        //         console.log('Labels:');
        //         labels.forEach((label) => {
        //             console.log(`- ${label.name}`);
        //         });
        //     } else {
        //         console.log('No labels found.');
        //     }
        // });
        console.log('logged in')
        // res.send('/dashboard')
    }
})

server.post('/auth/google/callback', function (req, res) {
    let url = req.headers.referer;
    let index = url.indexOf('code');
    let index2 = url.indexOf('&scope');
    let code = url.substring(index+5, index2);

    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log('code', code)
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens); 
                authed = true;
                res.send(tokens);
                res.redirect('/dashboard')
            }
        });
    }
});

module.exports = server;
