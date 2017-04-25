//routes/index.js
var url = require("url");
const express = require("express");
let router = express.Router();
var models = require("./../models");
var User = models.User;
var Profile = models.Profile;
var sequelize = models.sequelize;

//-----------------------
// '/' Index router: User requests to GET localhost:3000 page
// --> If no session exists, redirect to localhost:3000/login page (checked in app.js), else redirect to 'users' router
//-----------------------
var onIndex = (req, res) => {
  res.redirect("/users"); // redirect to 'users' router
};

router.get("/", onIndex);

//-----------------------
// '/login' router:  User requests to GET localhost:3000/login page --> render views/login/index.hbs
//-----------------------

var getLogin = (req, res) => {
  res.render("login", { title: "OKOdin" }); // render 'views/login' page by passing {title} string
};

router.get("/login", getLogin);

//-----------------------
// '/logout' router:  User clicks on LOGOUT link on _nav.hbs page:
// <li><a href="{{ destroySessionPath }}">Logout</a></li>
// --> destroySessionPath refers to SessionsHelper.js in the helpers folder
// --> SessionsHelper.destroySessionPath = () => `/sessions?_method=delete`;
// --> this is equivalent of calling '/sessions' router with method overriding

// --> Once session is deleted, redirect to 'login' router
//-----------------------

var onLogout = (req, res) => {
  req.session.destroy();
  req.method = "GET";
  res.redirect("/login"); // redirect to 'login' router
};

router.delete("/sessions", onLogout);

//-----------------------
// 'SUBMIT on Login Page':  User POST username and password on  localhost:3000/login page
// <form action="/sessions" method="post">
// --> first query the database to see if user exists - if yes, get his profile and then redirect to '/' router which will redirect to '/users' router as session now exists
// --> if user does not exist, first create a new user with default profile and then redirect to 'user/:id' router
//-----------------------

var onLogin = (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let profile, userId;

  sequelize.transaction(t => {
    return User.find({
      where: {
        $and: [{ username: username }, { email: email }]
      }
    }).then(user => {
      if (user) {
        //user found in database
        // capture input from user, create session, update lastLogin and redirect to '/' router which will redirect to '/users' router
        req.session.currentUser = {
          username: username,
          email: email,
          id: user.id
        };
        user.update({ lastLogin: new Date() }).then(res.redirect("/"));
      } else {
        return User.create({
          username: username,
          email: email,
          lastLogin: new Date(),
          transaction: t
        })
          .then(user => {
            userId = user.id;
            return Profile.findOrCreate({
              defaults: { userId: userId },
              where: { userId: userId },
              transaction: t
            });
          })
          .spread(profile => {
            return User.update(
              { profileId: profile.id },
              {
                where: { id: userId },
                transaction: t
              }
            );
          })
          .then(() => {
            req.session.currentUser = {
              username: username,
              email: email,
              id: userId
            };
            res.redirect(`/user/${userId}`); // after creating new user and its associated profile in database, redirect to '/user/:id' router
          });
      }
    });
  });
};

router.post("/sessions", onLogin);

module.exports = router;
