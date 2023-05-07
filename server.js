const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { writeFile } = require('fs/promises');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dbCon = mysql.createConnection(
 {
  host: 'localhost',
  user: 'root',
  password: 'password123!@#',
  database: 'bens_manager_db_test'
 },
 console.log(`Connected to the bens_manager_db database.`)
);

//arrays

var roleTitleArray = [];

var employeeNameArray = [];
var employeeDeleteNameArray = [];

var managersArray = [];
var managersArrayFiltered = [];

var departmentArray = [];
var department_nameArray = [];
var departmentsArrayFiltered = [];

//variables

var roleIdV = '';
var role = '';
var roleSalary = '';
var roleDepartment = '';

var employeeLength = '';
var employeeId = '';
var employeeName = '';
var employeeFirstName = '';
var employeeLastName = '';
var employeeDepartment = '';
var employeeTitle = '';
var employeeSalary = '';
var employeeManager = '';
var employeeDeleteFirst = '';
var employeeDeleteLast = '';

var departmentLength = '';
var departmentName = '';

var managerName = '';

var salaryV = 0;

//main menu prompt

function employeeManager_prompt() {

inquirer.prompt([
 {
  type: 'list',
  name: 'startMenu',
  message: 'What would you like to do? :',
  choices: [
   'View All Employees',
   'Add Employee',
   'Delete Employee',
   'View All Roles',
   'Add Role',
   'Delete Role',
   'View All Departments',
   'Add Department',
   'Delete Department',
   'View Employees by Manager',
   'View Employees by Department',
   'View Total Budget of a Department',
   'Quit'
  ]
 }
]).then(({ startMenu }) => {

 if (startMenu == 'View All Employees') {
  console.log('View All Employees');
  selectQueryEmployee();
 };

 if (startMenu == 'Add Employee') {
  console.log('Add Employee.');
  insertQueryEmployee();
 };

 if (startMenu == 'Delete Employee') {
  console.log('Delete Employee.');
  deleteQueryEmployee1();
 };

 if (startMenu == 'View All Roles') {
  console.log('View All Roles');
  selectQueryRole();
 };

 if (startMenu == 'Add Role') {
  console.log('Add Role');
  insertQueryRole1();
 };

 if (startMenu == 'Delete Role') {
  console.log('Delete Role');
  deleteQueryRole();
 };

 if (startMenu == 'View All Departments') {
  console.log('View All Departments');
  selectQueryDepartment();
 };

 if (startMenu == 'Add Department') {
  console.log('Add Department');
  insertQueryDepartment();
 };

 if (startMenu == 'Delete Department') {
  console.log('Delete Department.');
  deleteQueryDepartment1();
 };

 if (startMenu == 'View Employees by Manager') {
  console.log('View Employees By Manager.');
  viewEmployeesByManager1();
 };

 if (startMenu == 'View Employees by Department') {
  console.log('View Employees by Department.');
  vBD1();
 };

 if (startMenu == 'View Total Budget of a Department') {
  console.log('View Total Budget of a Department.');
  viewByBudget1();
 };

 if (startMenu == 'Quit') {
  quitNode();
 };
});
};

// start the prompt
employeeManager_prompt();

////////Select a table to view
function selectQueryDepartment() {
dbCon.query(`SELECT * FROM department`, function (err, results) {
 console.table(results);
 employeeManager_prompt();
});
};

function selectQueryRole() {
dbCon.query(`SELECT * FROM role`, function (err, results) {
 console.table(results);
  employeeManager_prompt();
});
};

function selectQueryEmployee() {
dbCon.query(`SELECT * FROM employee`, function (err, results) {
 console.table(results);
 employeeManager_prompt();
});
};
////////////////////////////////////////////

// insert function chain for department
function insertQueryDepartment() {
  dbCon.query(`SELECT * FROM department`, function(err, results) {
    console.table(results);
    departmentLength = results.length + 1;
    insertQueryDepartment2();
  });
};

function insertQueryDepartment2() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department_id',
      message: 'What is the id of the Department?',
      default: departmentLength
    },
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the Department?'
    }
  ]).then(({ department_id, department }) => {
    dbCon.query(`INSERT INTO department(id, department_name) VALUES (${department_id}, "${department}")`, function (err, results) {
      console.log('Added Department.');
      employeeManager_prompt();
    }); 
  });
};
// end of insert department chain
//////////////////////////////////////////////////////////

////// insert role function chain
function insertQueryRole1() {
dbCon.query(`SELECT * FROM role`, function (err, results) {
 console.table(results);
  insertQueryRole2();
});
};

function insertQueryRole2() {
 

 dbCon.query(`SELECT department_name FROM department`, function (err, results) {

  department_nameArray = results;

  inquirer.prompt([
  {
    type: 'input',
    name: 'addRoleId',
    message: 'What is the id of the role?',
    default: department_nameArray.length
  },
  {
    type: 'input',
    name: 'addRole',
    message: 'What is the name of the role?'
  },
    {
    type: 'input',
    name: 'addRoleSalary',
    message: 'What is the salary of the role?'
  },
    {
    type: 'list',
    name: 'addRoleDepartment',
    message: 'Which department does the role belong to?',
    choices: department_nameArray.map(item => ({name: item.department_name}))
  },

]).then(({ addRoleId, addRole, addRoleSalary, addRoleDepartment }) => {
  roleIdV = addRoleId;
  role = addRole;
  roleSalary = addRoleSalary;
  roleDepartment = addRoleDepartment;  
  insertQueryRole3();
}
);
 });

function insertQueryRole3() {

console.log(roleIdV);
console.log(role);
console.log(roleSalary);
console.log(roleDepartment);

dbCon.query(`INSERT INTO role(id, title, salary, department) VALUES (${roleIdV}, "${role}", ${roleSalary}, "${roleDepartment}")`, function (err, results) {
  console.table(results);
  console.log('Entry added.');
  employeeManager_prompt();
})
};
};
// end of insert role chain
////////////////////////////////////////////////////////

////////// insert employee chain
function insertQueryEmployee() {
dbCon.query(`SELECT * FROM employee`, function (err, results) {
  console.table(results);
  employeeLength = results.length + 1;
  insertQueryEmployee2();
})

};

function insertQueryEmployee2() {
  console.log('add Employee 2')
  inquirer.prompt([
    {
      type: 'input',
      name: 'addEmployeeId',
      message: 'What is Employee id?',
      default: employeeLength
    },
    {
      type: 'input',
      name: 'addEmployeeFirstName',
      message: 'What is Employee First Name?',
    },
    {
      type: 'input',
      name: 'addEmployeeLastName',
      message: 'What is Employee Last Name?',
    },
    {
      type: 'input',
      name: 'addEmployeeDepartment',
      message: 'What is Employee Department?',
    },
      {
      type: 'input',
      name: 'addEmployeeTitle',
      message: 'What is Employee Title?',
    },
    {
      type: 'input',
      name: 'addEmployeeSalary',
      message: 'What is Employee Salary?',
    },
    {
      type: 'input',
      name: 'addEmployeeManager',
      message: 'what is Employee Manager?',
    }
  ]).then(({ addEmployeeId, addEmployeeFirstName, addEmployeeLastName, addEmployeeDepartment, addEmployeeTitle, addEmployeeSalary, addEmployeeManager }) => {
    employeeId = addEmployeeId;
    employeeFirstName = addEmployeeFirstName;
    employeeLastName = addEmployeeLastName;
    employeeDepartment = addEmployeeDepartment;
    employeeTitle = addEmployeeTitle;
    employeeSalary = addEmployeeSalary;
    employeeManager = addEmployeeManager;
    insertQueryEmployee3();
  });
};

function insertQueryEmployee3() {
dbCon.query(`INSERT INTO employee(id, first_name, last_name, department, title, salary, manager) VALUES (${employeeId}, "${employeeFirstName}", "${employeeLastName}", "${employeeDepartment}", "${employeeTitle}", ${employeeSalary}, "${employeeManager}")`, function (err, results) {
  console.table(results);
  employeeManager_prompt();
});
};
// end of insert employee chain
//////////////////////////////////////////////////

////////////////////////////////////////////////////
// delete employee chain

function deleteQueryEmployee1() {
 dbCon.query(`SELECT * FROM employee`, function (err, results) {
  console.table(results);
  deleteQueryEmployee2();
 });
};

function deleteQueryEmployee2() {
 dbCon.query(`SELECT first_name, last_name FROM employee`, function (err, results) {
  console.table(results);
  employeeNameArray = [];
  for(x=0;x<results.length;x++) {
    employeeName = results[x].first_name + ' ' + results[x].last_name;
    employeeNameArray.push(employeeName);
  };
  deleteQueryEmployee3();
 });
};

function deleteQueryEmployee3() {
  employeeDeleteNameArray = [];
  inquirer.prompt([
    {
      type: 'list',
      name: 'deleteEmployee',
      message: 'What Employee Do You Want to Delete?',
      choices: employeeNameArray.map(item => ({name: item}))
    }
  ]).then((result) => {
    console.log(result);
    employeeName = JSON.stringify(result.deleteEmployee);
    console.log(employeeName);
    employeeDeleteNameArray = employeeName.split(" ");
    employeeDeleteFirst = employeeDeleteNameArray[0].replace('"', '');
    employeeDeleteLast = employeeDeleteNameArray[1].replace('"', '');

    deleteQueryEmployee4();
  });
};

function deleteQueryEmployee4() {
 dbCon.query(`DELETE FROM employee WHERE first_name = "${employeeDeleteFirst}" AND last_name = "${employeeDeleteLast}"`, function (err, results) {
  console.table("Deleted Entry.");
  employeeManager_prompt();
 });
};
// end of delete employee chain
///////////////////////////////////////////

///////////////////////////////////////////
// delete role chain

function deleteQueryRole() {
 dbCon.query(`SELECT * FROM role`, function (err, results) {
 console.table(results);
 console.log("id:" + results[0].id);
 console.log("title:" + results[0].title);
 console.log("department:" + results[0].department);
 console.log("salary:" + results[0].salary);

 deleteQueryRole2();
});
}

function deleteQueryRole2() {
  console.log('deleteQueryRole2');
  dbCon.query(`SELECT title FROM role`, function (err, results) {
  console.table(results);
  roleTitleArray = results;

  inquirer.prompt([
    {
      type: 'list',
      name: 'deleteRole',
      message: 'What role would you like to delete?',
      choices: roleTitleArray.map(item => ({name: item.title}))
    }
  ]).then(({ deleteRole }) => {
    console.log(deleteRole);
    role = deleteRole;
    deleteQueryRole3();
  })
});
};

function deleteQueryRole3() {
 dbCon.query(`DELETE FROM role WHERE title = '${role}'`, function (err, results) {
  console.table(results);
  console.log('Entry Deleted.');
  deleteQueryRole4();
 });
};

function deleteQueryRole4() {
  dbCon.query(`UPDATE employee SET title = "null" WHERE title = '${role}'`, function (err, results) {
    console.log('Updated All Employees.')
    employeeManager_prompt();
  });
};

// delete role chain
///////////////////////////////////////////////////

//////////////////////////////////////////////////
// delete department chain

function deleteQueryDepartment1() {
  dbCon.query(`SELECT * FROM department`, function (err, results) {
    console.table(results);
    deleteQueryDepartment2();
  });
};

function deleteQueryDepartment2() {
  departmentArray = [];
  dbCon.query(`SELECT department_name FROM department`, function (err, results) {
    console.log(results);

    departmentArray = results;

      inquirer.prompt([
    {
      type: 'list',
      name: 'departmentName',
      message: 'What Department would you like to delete?',
      choices: departmentArray.map(item => ({name: item.department_name}))
    }
  ]).then(({departmentName}) => {
    dbCon.query(`DELETE FROM department WHERE department_name = "${departmentName}"`, function (err, results) {
      console.log('Department Deleted.')
      employeeManager_prompt();
      });
    });
  });
};
// end of delete chain
////////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// view employees by manager chain

function viewEmployeesByManager1() {
  dbCon.query(`SELECT * FROM employee`, function (err, results) {
    console.table(results);
    viewEmployeesByManager2();
  });
};

function viewEmployeesByManager2() {
  managersArray = [];
  managersArrayFiltered = [];
  dbCon.query(`SELECT manager FROM employee`, function (err, results) {
    managersArray = results;
    managersArrayFiltered = managersArray.filter((object, pos, arr) => {
      return arr.map(mapObject => mapObject["manager"]).indexOf(object["manager"]) === pos;
    });

  inquirer.prompt([
    {
      type: 'list',
      name: 'managerChoice',
      message: 'Select a Manager to see his Employees.',
      choices: managersArrayFiltered.map(item => ({name: item.manager}))
    }
    ]).then(({ managerChoice }) => {
      managerName = managerChoice;
      viewEmployeesByManager3();
    });
  });
};

function viewEmployeesByManager3() {
  dbCon.query(`SELECT * FROM employee WHERE manager = "${managerName}"`, function (err, results) {
    console.table(results);
    console.log('All Employees who work for ' + managerName + ".");
    employeeManager_prompt();
  });
};

// end of view employees by manager chain
///////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
// view employees by department

function vBD1() {
  dbCon.query(`SELECT * FROM employee`, function (err, results) {
    console.table(results);
    vBD2();
  });
};


function vBD2() {
  departmentArray = [];
  departmentsArrayFiltered = [];
  dbCon.query(`SELECT department FROM employee`, function (err, results) {
    departmentArray = results;
    departmentsArrayFiltered = departmentArray.filter((object, pos, arr) => {
      return arr.map(mapObject => mapObject["department"]).indexOf(object["department"]) === pos;
    });

  inquirer.prompt([
    {
      type: 'list',
      name: 'departmentChoice',
      message: 'Select a Department to see its Employees.',
      choices: departmentsArrayFiltered.map(item => ({name: item.department}))
    }
    ]).then(({ departmentChoice }) => {
      departmentName = departmentChoice;
      vBD3();
    });
  });
};

function vBD3() {
  dbCon.query(`SELECT * FROM employee WHERE department = "${departmentName}"`, function (err, results) {
    console.table(results);
    console.log('All Employees who work in ' + departmentName + ".");
    employeeManager_prompt();
  });
};

// end of view employees by department
//////////////////////////////////////////////

/////////////////////////////////////////////
// view department budget chain

function viewByBudget1() {
  departmentArray = [];
  departmentsArrayFiltered = [];
  dbCon.query(`SELECT department FROM employee`, function (err, results) {
    console.table(results);
    departmentArray = results;
    departmentsArrayFiltered = departmentArray.filter((object, pos, arr) => {
      return arr.map(mapObject => mapObject["department"]).indexOf(object["department"]) === pos;
    });

  inquirer.prompt([
    {
      type: 'list',
      name: 'departmentChoice',
      message: 'Select a Department to see its Employees.',
      choices: departmentsArrayFiltered.map(item => ({name: item.department}))
    }
    ]).then(({ departmentChoice }) => {
      departmentName = departmentChoice;
      viewByBudget2();
    });
  });
};


function viewByBudget2() {
  console.log('View Total Budget 2');
  dbCon.query(`SELECT * FROM employee WHERE department = "${departmentName}"`, function (err, results) {
    salaryV = 0;

    for(let x=0;x<results.length;x++){
      salaryV += results[x].salary;
    }

    console.log("Total Salary of" + departmentName + " is " + salaryV + ".");

    employeeManager_prompt();
  });
};

// end of view budget of department chain
///////////////////////////////////////////

///////////////////////////////////////////
// quit function
function quitNode() {
  console.log('Exit Employee Manager');
  process.exit();
};
//////////////////////////////////////////

app.listen(PORT);