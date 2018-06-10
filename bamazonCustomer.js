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
  

    require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');
const cyan = '\x1b[36m';
const white = '\x1b[0m';
const green = '\x1b[32m';
const red = '\x1b[31m';
let choiceArray = [];
var arrayFilled = false;

var connection = mysql.createConnection({   // Reference database
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "bamazon_db"
  });

Number.prototype.formatMoney = function(c, d, t){  // Formats integer as currency, borrowed from https://bit.ly/2kAmkRz
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };


 function drawScreen() {
    process.stdout.write('\x1B[2J\x1B[0f');   // Clears the terminal
    console.log('\n');
    console.log(cyan + 'Welcome to Bamazon!' + white);
    console.log('----------------------');
}

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        if (!arrayFilled) {
            for (key in res) {
                choiceArray.push({ id: res[key].id, name: res[key].product_name, price: '$' + res[key].price.formatMoney(2), stock: res[key].stock_quantity })
            }
        }
        arrayFilled = true;
        console.log(columnify(choiceArray));  // outputs object in neatly aligned columns
        processOrder(res);
    });
}

function processOrder(res) {
    console.log('\n');
    inquirer.prompt([
    {
        name: "item",
        type: "input",
        message: "Type the ID# of the item you would like to purchase:",
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
    }
    ]).then(answer => {
        var chosenItem;
        for (var i = 0; i < res.length; i++) {  // get the information of the chosen item and store it as an object called chosenItem
            if (res[i].id === parseInt(answer.item)) {
                chosenItem = res[i];
            }
        }
        if (answer.quantity > parseInt(chosenItem.stock_quantity)) {
            console.log(red + "\nSorry, we don't have that many in stock!" + white);
            console.log('----------------------');
            displayProducts();
        } else {
            console.log(green + "\nOk no problem.\n" + white);
            console.log('Your order total is: ' + cyan + '$' + (chosenItem.price * answer.quantity).formatMoney(2) + white);
            inquirer.prompt([
                {
                    name: "purchase",
                    type: "confirm",
                    message: "Are you sure?"
                }
            ]).then(ans => {
                if (ans.purchase === true) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: chosenItem.stock_quantity - answer.quantity
                          },
                          {
                            id: chosenItem.id
                          }
                        ],
                        function(error) {
                          if (error) throw error;
                          for (key in choiceArray){   // Rather than opening another connection, we can trust that the MySQL database has been updated, so here I updated the quantity in the choiceArray and printed that out to show the stock has been updated
                              if (choiceArray[key].id == chosenItem.id)
                              choiceArray[key].stock = choiceArray[key].stock - answer.quantity;
                          }
                          console.log(green + "\nOrder placed successfully!\n" + white);
                          console.log('----------------------');
                          console.log(columnify(choiceArray));
                          connection.end();
                        }
                    );
                } else {
                    console.log('----------------------');
                    displayProducts();
                }
            });
        }
    });
}

drawScreen();
displayProducts();