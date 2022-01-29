const https = require('https');
const express = require('express');
const fs = require('fs');

var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Tiens, on m\'a appelé à : ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  var str = getActivities();
  res.status(200).json({
    // ******* REPRENDRE ICI ************* //
    // récuprer les vraies données Strava :-)
    data: str
  });
  // res.send('Ici, on va appeler les données Strava');
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About activities');
});

// Récupère les activités Strava
function getActivities(){
  //lance le renouvellement de l'access token
  try {
    token = reAuthorize();
  } catch (err) {
    console.log('reAuthorize a foiré...')
    console.error(err)
  }
  console.log("On va lancer getActivities avec token : " + token);
  // appelle API strava avec l'access token qu'on vient de renouveller
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${token}`;
  var req = https.get(activities_link, (res) => {
    var str = '';
    res.on('data', (chunk) => {
      str += chunk;
    })
    res.on('end', () => {
      var body = str;
    })
  })
  req.on('error',(e) => {
    console.error(e)
  });
  req.write(body);
  req.end();
}

// Renouvelle le token d'access Strava
function reAuthorize(){
  console.log("on lance reAuthorize");
  // Récupère les clés nécessaire dans le fichier (dispo en local seulement)
  var data = fs.readFileSync('./strava_keys.json'), myObj;
  try {
    myObj = JSON.parse(data);
    var id = myObj.id;
    var secret = myObj.secret;
    var token = myObj.token;
  } catch (err) {
    console.log('There has been an error reading the keys file :-(')
    console.error(err)
  }
// fait la requête POST de renouvellement sur l'API strava
  var body = JSON.stringify({
    client_id: id,
    client_secret: secret,
    refresh_token: token,
    grant_type: 'refresh_token'
  })
  var options = {
    hostname: 'www.strava.com',
    port: 443,
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  }
  // lance la requête, et enchaine sur getActivities
  var req = https.request(options, (res) => {
    //*** A revoir : normalement, il faudrait attendre d'avoir tout reçu, donc res.on('end')...
    res.on('data', (chunk) => {
        const data = JSON.parse(chunk);
        const token = data.access_token;
        console.log("reAuthorize a récupéré : " + token);
      });
    })
  req.on('error',(e) => {
    console.error(e)
  });
  req.write(body);
  req.end();
}

module.exports = router;