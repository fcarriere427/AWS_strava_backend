const dbFun = require('../dbFunctions');

module.exports = {
    path: "/strava/month_distances",
    config: (router) => {
        router
          .get("/", (req, res) => {
            dbFun.readAllMonthDistances() // récup du json avec toutes les années
            .then((data) => {
              console.log("... Envoi du json avec les distances par mois");
              res.status(200).send(data);
            })
          })
          .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};