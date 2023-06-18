const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { log } = require('console');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const memberData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name
        }
      }
    ]
  }

  const jsonData = JSON.stringify(memberData);

  const url = 'https://us11.api.mailchimp.com/3.0/list/8a9ddbabb9';
  const options = {
    method: 'POST',
    auth: 'Away:8885e39fdbaf39d3d981da2455xxxxx-us11'
  }

  const request = https.request(url, options, (response) => {
    response.on('data', (data) => {
      const requestJSON = JSON.parse(data);
      if(requestJSON.status >= 400){
        res.sendFile(__dirname + '/failure.html')
      } else if(!requestJSON.status){
        res.sendFile(__dirname + '/success.html')
      }
    });
  })

  request.write(jsonData)
  request.end();
})

app.post('/failure', (req, res) => {
  res.redirect('/')
})

app.listen(process.env.PORT || 3000, () =>{
  log('Running on 3000')
})


//Mailchimp apikey
//8885e39fdbaf39d3d981da2455xxxxx-us11

//Audience ID
//8a9ddxxxxx
