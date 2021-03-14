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
    inquirer.prompt({
        type: "list",
        message: "Choose an option:",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add department",
            "Add role",
            "Add employees",
            "Update employee role",
            "Exit"],
        name: "choice"
    }).then(function (answer) {
        if (answer.choice === "View all departments") {
            viewDepartments();
        } else if (answer.choice === "View all roles") {
            viewRoles();
        } else if (answer.choice === "View all employees") {
            viewEmployees();
        } else if (answer.choice === "Add department") {
            addDepartment();
        } else if (answer.choice === "Add role") {
            addRole();
        } else if (answer.choice === "Add employees") {
            addEmployee();
        } else if (answer.choice === "Update employee role") {
            updateEmployee();
        } else {
            connection.end();
        }
    });
}

function viewDepartments() { }
function viewRoles() { }
function viewEmployees() { }
function addDepartment() { }
function addRole() { }
function addEmployee() { }
function updateEmployee() { }
