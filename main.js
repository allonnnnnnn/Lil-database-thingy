const express = require("express");
const fs = require("fs");
const { connect } = require("http2");
const mysql = require("mysql2");
const { stripVTControlCharacters } = require("util");

const app = express();
app.use(express.text());

app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/html", express.static("./app/html"));

app.delete("/delete", function(req, res) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "main"
    });

    connection.query(
        `DELETE FROM user WHERE id=${req.body}`,
        function(err, result) {
            if (err) throw err;

            res.send();
        }
    )
});

app.post("/add", function(req, res) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "main"
    });

    connection.connect(function (error) {
        if (error) throw error;

        connection.query(
            `INSERT INTO user(name, date) VALUES ("${req.body}", "${new Date().toLocaleDateString()}")`,
            function (err, result) {
                if (err) throw err;

                res.send();
            }
        )
    });
})

app.post("/getData", function (req, res) {
    let nameFilter = `name="${req.body}"`
    if (req.body == "undefined" || req.body.length == 0) {
        nameFilter = "1=1";
    }
    
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "main"
    });

    connection.connect(function (error) {
        if (error) throw error;
        connection.query(
            `SELECT * FROM user WHERE ${nameFilter}`,
            function (err, result) {
                if (err) throw err;

                res.send(result);
            }
        );
    });
});

app.post("/updateData", function(req, res) {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "main"
    });

    connection.connect(function(error){
        if (error) throw error;
        
        const json = JSON.parse(req.body);

        connection.query(
            `UPDATE user SET name="${json.newName}" WHERE id="${json.id}"`,
            function(err) {
                if (err) throw err;

                res.send();
            }  
        );
    });
});

app.get("/", function (req, res) {
    let document = fs.readFileSync("./app/html/main.html", "utf8");

    res.send(document);
});

app.use(function (req, res) {
    res
        .status(404)
        .send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

let port = 8000;
app.listen(port, function () {
    console.log("listening on port: " + port);
});