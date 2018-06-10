var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');
require("dotenv").config();
let choiceArray = [];
var arrayFilled = false;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

  function afterConnect() {
    //Connection ID is a process object
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //var response = JSON.stringify(res);
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].item_name + " | " + res[i].price + " | ");
          }
          console.log("-----------------------------------")
      })  
  }

  function start() {
    inquirer.prompt([
        {
          name: "item",
          type: "list",
          message: "Which item would you like to purchase?",
          choices: ['a', 'b']
        },
        {
          name: "item",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ]).then(function(){
        console.log('2')
      })
    }
  

    