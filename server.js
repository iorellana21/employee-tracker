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
            database.end();
        }
    });
}

function viewDepartments() {
    let query = "SELECT * FROM department";
    database.query(query, (err, res) => {
        if (err) throw err;
        console.table(` `);
        console.table(`------ DEPARTMENTS ------`)
        console.table(res);
    });
    askQuestions();
}

function viewRoles() {
    let query = "SELECT * FROM role";
    database.query(query, (err, res) => {
        if (err) throw err;
        console.table(` `);
        console.table(`------ ROLES ------`);
        console.table(res);
    });
    askQuestions();
}

function viewEmployees() {
    let query = "SELECT * FROM employee";
    database.query(query, (err, res) => {
        if (err) throw err;
        console.table(` `);
        console.table(`------ EMPLOYEES ------`);
        console.table(res);
    })
    askQuestions();
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter new Department name:",
            name: "newDepartment"
        },
    ]).then(function (answer) {
        database.query(
            "INSERT INTO department SET ?",
            {
                name: answer.newDepartment,
            },
            function (err) {
                if (err) throw err;
                console.log("Your department was successfully created.");
                askQuestions();
            }
        );
    });
}

function addRole() {
    database.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Enter new Role:",
                name: "newRole"
            },
            {
                type: "input",
                message: "How much is the annual salary?",
                name: "salary"
            },
            {
                type: "rawList",
                message: "Which Department does this Role belong to?",
                choices: function () {
                    let choicesArray = [];
                    res.forEach(res => { choicesArray.push(res.name) });
                    return choicesArray;
                },
                name: "department"
            }
        ]).then(function (answer) {
            const dept = answer.department;
            database.query('SELECT * FROM department', (err, res) => {

                if (err) throw (err);
                let filteredDept = res.filter(res => {
                    return res.name == dept;
                });

                let id = filteredDept[0].id;
                database.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                    [
                        answer.newRole,
                        parseInt(answer.salary),
                        id
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`You have added this role: ${(answer.newRole).toUpperCase()} successfully.`)
                    })
                viewRoles();
            });
        });
    });
}

function addEmployee() {
    database.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "first_name",
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "last_name"
            },
            {
                type: "rawList",
                message: "Which Role does the employee belong to?",
                choices: function () {
                    let choicesArray = [];
                    res.forEach(res => {
                        choicesArray.push(res.title);
                    });
                    return choicesArray;
                },
                name: "role"
            }
        ]).then(function (answer) {
            const role = answer.role;
            database.query('SELECT * FROM role', (err, res) => {

                if (err) throw (err);
                let filteredRole = res.filter(res => {
                    return res.title == role;
                });

                let id = filteredRole[0].id;
                database.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
                    [
                        answer.first_name,
                        answer.last_name,
                        id
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`You have added this employee: ${(answer.first_name)} ${(answer.last_name)} successfully.`)
                    });
                viewEmployees();
            });
        });
    });
}

function updateEmployee() {
    database.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "rawList",
                message: "Which employee would you like to update? Please enter their last name.",
                choices: function () {
                    chosenEmployee = [];
                    res.forEach(res => {
                        chosenEmployee.push(res.last_name);
                    });
                    return chosenEmployee;
                },
                name: "employee"
            }
        ]).then(function (answer) {
            const changeEmployee = answer.employee;

            console.log("Employee Chosen: " + changeEmployee);

            database.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "rawList",
                        message: "What is this employees new role?",
                        choices: function () {
                            newRole = [];
                            res.forEach(res => {
                                newRole.push(res.title);
                                //push new role into the role title db
                            });
                            return newRole;
                        },
                        name: "newRole"
                    }
                ]).then(function (update) {
                    const updatedRole = update.newRole;
                    console.log("Updated Role: " + updatedRole);

                    database.query('SELECT * FROM role WHERE title = ?', [updatedRole], (err, res) => {
                        if (err) throw (err);

                        let roleID = res[0].id;
                        console.log("ROLE id : " + roleID);

                        let params = [roleID, changeEmployee];

                        database.query("UPDATE employee SET role_id = ? WHERE last_name = ?", params,
                            (err, res) => {
                                if (err) throw (err);
                                console.log(`You have updated ${changeEmployee}'s role to ${updatedRole}.`)
                            });
                        viewEmployees();
                    });
                });
            });
        });
    });
}

