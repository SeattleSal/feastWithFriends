// Requiring our models and passport as we've configured it
const db = require("../models");
const router = require("express").Router();
const passport = require("../config/passport");


// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/api/login", passport.authenticate("local"), (req, res) => {
  // Sending back a password, even a hashed password, isn't a good idea
  res.json({
    email: req.user.email,
    id: req.user.id
  });
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", (req, res) => {
  db.Customer.create({
    email: req.body.email,
    password: req.body.password
  })
    .then(() => {
      res.redirect(307, "/api/login");
    })
    .catch(err => {
      res.status(401).json(err);
    });
});

// Route for logging user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Route for getting some data about our user to be used client side
router.get("/api/user_data", (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  }
});

// GET route for getting all of the customers
router.get("/api/customers", function(req, res) {
  db.Customer.findAll({}).then(function(dbCustomers) {
    res.json(dbCustomers);
  });
});

  // GET route for getting one customer
router.get("/api/customers/:id", function (req, res) {
    db.Customer.findOne({
      where: {
        id: req.params.id
      } // add include if we decide to reference other tables
    }).then(function(dbCustomer) {
      res.json(dbCustomer);
    });
  });

  // POST route for saving a new customer
router.post("/api/customers", function(req, res) {
    console.log(req.body);
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Customer.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      vegan: req.body.vegan,
      lactoseIntolerance: req.body.lactoseIntolerance,
      vegetarian: req.body.vegetarian,
      nutAllergy: req.body.nutAllergy,
      glutenIntolerance: req.body.glutenIntolerance,
      shellfishAllergy: req.body.shellfishAllergy,
      kosher: req.body.kosher
    }).then(function(dbCustomers) {
      // We have access to the new todo as an argument inside of the callback function
      res.json(dbCustomers);
    });
  });

  // DELETE route for deleting customers (get the id of the todo to be deleted from req.params.id)
router.delete("/api/customers/:id", function(req, res) {
    db.Customer.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbCustomers) {
      res.json(dbCustomers);
    });
  });

   // PUT route for updating customers. We can get the updated todo data from req.body
  router.put("/api/customers", function(req, res) {
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Customer.update({
      name: req.body.name,
      // email: req.body.email,
      // password: req.body.password,
      vegan: req.body.vegan,
      lactoseIntolerance: req.body.lactoseIntolerance,
      vegetarian: req.body.vegetarian,
      nutAllergy: req.body.nutAllergy,
      glutenIntolerance: req.body.glutenIntolerance,
      shellfishAllergy: req.body.shellfishAllergy,
      kosher: req.body.kosher
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbCustomers) {
      res.json(dbCustomers);
    });
  });

module.exports = router;