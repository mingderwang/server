'use strict';

var express = require('express');
    var bodyParser = require('body-parser');
    var request = require("request")

    var app = express();
    var port = process.env.PORT || 4000;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', function(req, res) {
        if (req.query['hub.verify_token'] === '22222') {
            res.send(req.query['hub.challenge']);
            console.log("GET")
            res.sendStatus(200)
        }

        console.log("Error: wrong token")
    })

    app.post('/', function(req, res) {
        messaging_events = req.body.entry[0].messaging;
        console.log("post")
        for (i = 0; i < messaging_events.length; i++) {
            event = req.body.entry[0].messaging[i];
            sender = event.sender.id;
            if (event.message && event.message.text) {
                text = event.message.text;
                sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
            }
        }
        res.sendStatus(200);
    });

    app.listen(port, function() {
        console.log('Listening on port ' + port);
    });

    var token = "EAANhO2EGmboBAAl1plHXsVweXs97p46rvOLfcZAMtHq3tHTBJkQvk9onI9cbsNgyucCc6pTYdgIUhXMYisvAYdWLNFnkd0tDvZBhsZCSNxUjGEMTZAJJvNei1J1ZCcArp0Y1jZCT88p9m1Gf1odZAdFz35h5bBdfew0fgIMGCskmGLZB3hLx4HT9yDqenpjOqxKqZAKL9ZAIIZB1MFW7CE8U3B61ZCLEXl6ySFiSwIvoS2GkUf9ZBTONqmItqaCfeOLZAi30gZD";

    function sendTextMessage(sender, text) {
        messageData = {
            text: text
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: token },
            method: 'POST',
            json: {
                recipient: { id: sender },
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
