require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

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
          name: "product",
          type: "list",
          message: "Which item would you like to purchase?",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].product_name);
            }
            return choiceArray;
        },
        message: "What product would you like to purchase?"
    }
        {
          name: "amount",
          type: "input",
          message: "How many would you like to purchase?"
        }
      ]).then(function(answer) {
        var chosenProduct;
        for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.product) {
                chosenProduct = results[i];
            }
          }
        }