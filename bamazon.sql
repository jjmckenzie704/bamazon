DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product VARCHAR(45) NOT NULL,
  department VARCHAR(45) NOT NULL,
  price VARCHAR(45) NOT NULL,
  stock_quantity INT(45) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("ibanez", "guitar", 900, 5), ("fender", "guitar", 750, 5), ("gibson", "guitar", 1000, 3), ("jackson", "guitar", 700, 6), ("prs", "guitar", 2000, 6), ("taylor", "guitar", 500, 4), ("epiphone", "guitar", 300, 4), ("washburn", "guitar", 300, 3),("esp", "guitar", 1050, 3), ("guild", "guitar", 800, 2)

SELECT * FROM products;