//*** Intégration des données dans la BDD

function storeData(data) {
  console.log("Début de storeData...");
  // Récupération des clés pour se connecter à couchDB
  const couchKeys = require('./keys/couchDB.json');
  var user = couchKeys.user;
  var pwd = couchKeys.password;
  var host = couchKeys.host;
  var port = couchKeys.port;
  var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
  // Ouverture de la BDD
  const nano = require ('nano')(url);
  //console.log('nano = ' + JSON.stringify(nano));
  var stravaDb = nano.db.use('strava');

  // ********************
  insertDoc(data, stravaDb, function(){
    console.log('... et maintenant on peut faire la suite :-)');
    writeArray(stravaDb, );
  });

    // // Récupération de tous les ID d'activités Strava dans un tableau
    // var existingID = [];
    // stravaDb.list()
    // .then((body) => {
    //   console.log('on va lister les activités de la BDD...')
    //   for (var i = 0; i < body.rows.length; i++) {
    //     console.log("Ligne n°" + i + " / activité = " + body.rows[i]);
    //     writeArray(i, stravaDb, body, body.rows[i].id)
    //   }
    // })
    // .then(() => {
    //   console.log("Et voici le tableau des ID Strava : ");
    //   for (var i = 0; i < existingID.length; i++) {
    //     console.log("i = " + i + " =>" + existingID[i]);
    //   }
    // })
    // .catch(err => console.log(err))


// ********************
}

///// REPRENDRE ICI : on récupère bien les docs en json, mais on ne sait pas extraire les valeurs qui nous  intéressent (par la clé "ID" de Strava)
///// ... donc on ne sait pas remplir le tableau des ID des activités strava
///// ... qui va servir à vérifier si une activité existe déjà avant de l'ajouter à la BDD

//// AUTRE problème à traiter, moins urgent : il faut isoler le process de création initiale de la BDD...
///// ... sinon on ne sait pas s'il faut commencer par remplir la BDD ou le tableau des ID :-/

function insertDoc(data, stravaDb, callback){
  // Création d'un enregistrement pour chaque activité
  console.log('Mise à jour de la BDD avec '+ data.length + ' éléments...');
  for (let i = 0; i < data.length; i++) {
    stravaDb.insert(data[i], function(error, http_body) {
      if(!error) {
        // Quand on est sur le dernier élément, alors seulement on appelle le callback !
        if(i==data.length-1){
          console.log('... OK, BDD mise à jour !');
          callback();
        };
      } else {
        console.log(error)
      }
    })
  }
}

function writeArray(stravaDb, callback) {
  console.log("Création du tableau avec les ID Strava...");
  // pour chaque ligne de la BDD, on va écrire un élément dans le tableau existingID
  stravaDb.rows.forEach((item) => {
    console.log('Nouvelle ligne : ');
    console.log(item);
    // stravaDb.get(itembody.rows[i].id, param, function (doc) {
    //   console.log('et on obtient l\'enregistrement = ' + doc);
    //   var stravaID = doc["id"];
    //   console.log('et on récupère l\'ID Strava = ' + stravaID);
    //   console.log("puis on renseigne dans le tableau la valeur [" + i + "] = " + doc["id"]);
    //   existingID[i] = doc["id"];
    })
/// pas bon, on va l'appeler avant que ce soit fini... il faudrait savoir si c'est le dernier
///    callback();
  });
}

module.exports = storeData;
