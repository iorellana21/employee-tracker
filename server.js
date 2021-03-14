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
    if (err) throw err;
    console.log('connected as id ' + database.threadId);
    // connection.end();
    askQuestions();
});

function askQuestions() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter First Name: ",
                name: "first_name"
            },
            {
                type: "input",
                message: "Enter Last Name: ",
                name: "last_name"
            },
            {
                type: "list",
                message: "What Department does employee belong to?",
                choices: ["Administrative", "Developmetn", "Support", "Training"],
                name: "department"
            },
            {
                type: "list",
                message: "Enter employee's Role: ",
                choices: ["Administrator", "Developer", "Support", "Trainer", "Admin Manager", "Dev Manager", "Support Manager", "Training Manager"],
                name: "role"
            }
        ])
        .then(answers => {
            console.log(answers);
        });
}