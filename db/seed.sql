INSERT INTO department(name) 
VALUES 
("Administrative"), ("Development"), ("Support"), ("Training");

INSERT INTO role(title, salary, department_id) 
VALUES 
("Administrator", 50000, 1),
("Developer", 60000, 2),
("Support", 42000, 3),
("Trainer", 45000, 4),
("Admin Manager", 80000, 1),
("Dev Manager", 90000, 2),
("Support Manager", 70000, 3),
("Training Manager", 75000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
("Ivan", "Orellana", 5, null);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
