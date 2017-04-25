// ----------------------------------------
// Get the basic server up and running
// ----------------------------------------
const express = require("express");
const app = express();

var port = process.env.PORT || process.argv[2] || 3000;
var host = process.env.IP || "localhost";

var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

//------------------------------------------------------------------
// Now go create helpers files under helpers folder & then register helpers below
//------------------------------------------------------------------
const helpers = require("./helpers");

//--------------------------
// Set up handlebars
//--------------------------
const exphbs = require("express-handlebars");

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "application",
    partialsDir: "views/",
    helpers: helpers.registered,
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");

//-------------------------------
// Set up body-parser
//-------------------------------
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const url = require("url");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// -----------------------------------------
// HTTP method overriding -- to specify alternative to default GET method in URL request --> used for specifying DELETE method on logout operation
// -----------------------------------------
app.use((req, res, next) => {
  var method;
  // Allow method overriding in the query string and POST data
  // and remove the key after found
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
  } else if (typeof req.body === "object" && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }
  // Upcase the method name and set the request method
  // to override it from GET to the desired method
  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }
  next();
});

//----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");

app.use(morgan("tiny"));
app.use((req, res, next) => {
  ["query", "params", "body"].forEach(key => {
    if (req[key]) {
      var capKey = key[0].toUpperCase() + key.substr(1);
      var value = JSON.stringify(req[key], null, 2);
      console.log(`${capKey}: ${value}`);
    }
  });
  next();
});

//--------------------------
// Set up serving static middleware
//--------------------------
app.use(express.static(__dirname + "/public"));

//-------------------------------
// Define and initialize sessions
//-------------------------------
const session = require("express-session");

var mySession = {
  secret: "jay swaminarayan",
  cookie: {},
  resave: false,
  saveUninitialized: true
};

app.use(session(mySession));

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.currentUser = req.session.currentUser;
  next();
});

//-----------------------------------------------------------------
// Now go create views folder and create defaultLayout file under views/layouts folder, _nav.hbs partial under views/shared folder, and an index.hbs under views/login folder
//------------------------------------------------------------------

// -----------------------------------------
// Auth redirect - check for existing session
// -----------------------------------------
app.use((req, res, next) => {
  var reqUrl = url.parse(req.url);
  if (
    // if no session exists and if url is not to login page then redirect to 'login' router
    !req.session.currentUser &&
    !["/login", "/sessions"].includes(reqUrl.pathname)
  ) {
    res.redirect("/login");
  } else {
    next();
  }
});

//------------------------
// Routes
//------------------------
const index = require("./routes/index");
const users = require("./routes/users");

app.use("/", index); // use 'index' router if no session exists when requesting http://localhost:3000

app.use("/", users); // use 'users' router if session exists when requesting http://localhost:3000

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
