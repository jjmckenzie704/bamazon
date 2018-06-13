require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");


let choiceArray = [];
var arrayFilled = false;

var connection = mysql.createConnection({   // Reference database
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.password,
    database: "bamazon_db"
  });




 function drawScreen() {
    process.stdout.write('\x1B[2J\x1B[0f');   // Clears the terminal
    console.log('\n');
    console.log('Welcome to Bamazon!');
    console.log('----------------------');
}

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        if (!arrayFilled) {
            for (key in res) {
                choiceArray.push({ id: res[key].id, name: res[key].product, price: '$' + res[key].price, stock: res[key].stock_quantity })
            }
        }
        arrayFilled = true;
        console.log(choiceArray);  // outputs object in neatly aligned columns
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
            console.log("\nSorry, out of stock");
            console.log('----------------------');
            displayProducts();
        } else {
            console.log("\nOk no problem.\n");
            console.log('Your order total is: ' + '$' + (chosenItem.price * answer.quantity));
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
                          console.log("\nOrder placed successfully!\n");
                          console.log('----------------------');
                          console.log(choiceArray);
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

