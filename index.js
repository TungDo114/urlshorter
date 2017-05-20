// Get Requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Connect to database
mongoose.connect('mongodb://tungdt:123456@ds147681.mlab.com:47681/tungdt');

app.use(express.static(__dirname + '/public'));

// Creates the database entry
app.post('/new/:urlToShorten(*)',(req, res, next)=>{
    var urlToShorten = req.params.urlToShorten;
    
});

// Handle post request for short url
app.post('/get-short-url',(req, res, next)=>{
    var urlToShorten = req.body.url;
    var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if(regex.test(urlToShorten)){
        console.log("It's an url");
        var short = Math.floor(Math.random() * 100000).toString();
        console.log('Shorter url: '+short);
        var data = new shortUrl({
            originalUrl : urlToShorten,
            shorterUrl : short
        });
        data.save(err =>{
            if(err) return res.send('Error saving to database');
        });
    }else {
        var data = new shortUrl({
            originalUrl : urlToShorten,
            shorterUrl : 'Invalid URL'
        });
        data.save(err =>{
            if(err) return res.send('Error saving to database');
        });
    }
    res.json(data);
});


// Query database forward to original URL
app.get('/:urlToForward',(req, res, next)=>{
    var shorterUrl = req.params.urlToForward;
    shortUrl.findOne({'shorterUrl' : shorterUrl}, (err,data)=>{
        if(err) return res.send('Error query from datbase');
        var regex = new RegExp("^(http|https)://","i");
        var strToCheck = data.originalUrl;
        if(regex.test(strToCheck)){
            res.redirect(301,data.originalUrl);
        }else {
            res.redirect(301,'http://'+data.originalUrl);
        }
    });
});

// Listen to see if everything is working
app.listen(process.env.PORT || 3000, ()=>{
    console.log('Every thing working!');
});