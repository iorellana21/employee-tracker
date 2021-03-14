const inquirer = require('inquirer');
const mysql = require('mysql');

const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "iorellana",
    port: 3306,
    database: "employees_db"
});

database.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected to MYSQL as id " + database.threadId);
});