//require modules
const express = require("express");
const morgan = require("morgan");
const itemsRoutes = require("./routes/itemsRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

//create app
const app = express();

//configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

//mount middlware
app.use(
  session({
    secret: "ajfeirf90aeu9eroejfoefj",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: "mongodb://localhost:27017/demos" }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash());

app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

//mount middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(express.json());

//connect to database
mongoose
  .connect("mongodb://localhost:27017/demos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    //start the server
    app.listen(port, host, () => {
      console.log("server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));
//set up routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/items", itemsRoutes);
app.use("/trades", tradeRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  let err = new Error("The server canonot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render("error", { error: err });
});
