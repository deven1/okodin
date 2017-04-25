var url = require("url");
const express = require("express");
let router = express.Router();
var models = require("./../models");
var User = models.User;
var Profile = models.Profile;
var sequelize = models.sequelize;

var helpers = require("./../helpers");
var h = helpers.registered;

//-----------------------
// '/' == '/users' router: User requests to GET localhost:3000/users page
// --> If no session exists, redirect to '/login' router (checked in app.js)
//-----------------------
var onIndex = (req, res) => {
  User.findAll({
    include: [
      {
        all: true, //include all User table columns
        include: [{ all: true }] //include all matching Profile table columns
      }
    ]
  })
    .then(users => {
      //call views/users and pass 'users' object
      res.render("users", { users });
    })
    .catch(e => res.status(500).send(e.stack));
};

router.get("/users", onIndex);

//-----------------------
// '/:id' == '/user/:id' router: User requests to GET his profile page at localhost:3000/user/userID
// first query the database by userID
// if user exits in the database, then check for existing session
// if user exists in database and if session exists, then render views/users/show.hbs profile page
// if user exists in database but if no session exists, redirect to '/' router which will redirect to '/login' router
//-----------------------
var onShow = (req, res) => {
  //include this user's User table columns
  //include matching Profile table columns
  User.findById(req.params.id, {
    include: [{ all: true, include: [{ all: true }] }]
  })
    .then(user => {
      if (user) {
        let ownsPage = false;
        if (req.session.currentUser.id == user.id) {
          ownsPage = true;
        }
        res.render("users/show", { user, ownsPage });
      } else {
        res.render("/");
      }
    })
    .catch(e => res.status(500).send(e.stack));
};

router.get("/user/:id", onShow);

//-----------------------
// '/:id/edit' == '/user/:id/edit' router: User clicks on EDIT link on his profile page at localhost:3000/user/userID
// first query the database by userID
// if user exits in the database, then check for existing session
// if user exists in database and if session exists, then render views/users/show.hbs profile page
// if user exists in database but if no session exists, redirect to '/' router which will redirect to '/login' router
//-----------------------
var onEdit = (req, res) => {
  User.findById(req.params.id, {
    include: [{ all: true, include: [{ all: true }] }]
  })
    .then(user => {
      if (user) {
        //if user exists in the database
        res.render("users/edit", { user }); // render views/users/edit.hbs by passing 'user' object
      } else {
        res.render("/"); // if there is no user with given userid (for example, if someone tries to directly access http://localhost:3000/user/userid/edit), render 'views/users/index.hbs -- it will redirect to '/login' router if no session exists
      }
    })
    .catch(e => res.status(500).send(e.stack));
};

router.get("/user/:id/edit", onEdit);

//-----------------------
// user clicks on UPDATE PROFILE button on http://localhost:3000/user/userid/edit page
// Sequelize to perform Profile.Update operation with captured fields on the edit form
//redirect to 'user/:id' router after update is done
//-----------------------
var onUpdate = (req, res) => {
  let talents = req.body.profile.talents.filter(function(talent) {
    return talent.length > 0;
  });

  let favorites = req.body.profile.favorites.filter(function(favorite) {
    return favorite.length > 0;
  });

  let photo = "viking_girl.jpg";
  if (req.body.profile.gender == "male") {
    photo = "viking_guy.jpg";
  }

  let maritalStatus = {
    1: "Single",
    2: "Married",
    3: "Dating",
    4: "It's complicated",
    5: "Married to the game"
  };

  let bodyType = {
    1: "Built like a god",
    2: "Built like a fish",
    3: "Built like a ground squirrel",
    4: "Built like a weird trapezoid",
    5: "Barely built at all"
  };

  sequelize
    .transaction(t => {
      return Profile.update(
        {
          age: req.body.profile.age,
          gender: req.body.profile.gender,
          maritalStatus: maritalStatus[req.body.profile.maritalStatus],
          height: req.body.profile.height,
          bodyType: bodyType[req.body.profile.bodyType],
          children: req.body.profile.children,
          occupation: req.body.profile.occupation,
          about: req.body.profile.about,
          talents: talents,
          favorites: favorites,
          whyMe: req.body.profile.whyMe,
          pets: req.body.profile.pets,
          photo: photo,
          city: req.body.profile.city
        },
        { where: { userId: req.body.userId } },
        { transaction: t }
      );
    })
    .then(() => {
      res.redirect(`user/${req.body.userId}`); // redirect to 'user/:id' router after update is done
    });
};

router.put("/users", onUpdate);

//---------------------
// Export the module
//--------------------
module.exports = router;
