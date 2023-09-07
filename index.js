import express from "express";
import flash from "express-flash";
import session from "express-session";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import 'dotenv/config'
import pgPromise from "pg-promise";
//import queryFunction from "./queries/databaseQ.js";
import renderFactory from "./render/renderPlates.js";

const connectionString = process.env.connection_string
const pgp = pgPromise()
const db = pgp(connectionString)

export { db, connectionString};

const handlebarSetup = exphbs.engine({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});

const app = express();

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(flash());
app.use(express.static('public'));
app.use("/frontendfunction", express.static("frontendfunction"));
app.use(bodyParser.urlencoded({ extended: "main" }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "registration with routes",
    resave: false,
    saveUninitialized: true,
  })
);

//const query = queryFunction(db)
const render = renderFactory()

app.get("/", render.showRegistration);

app.post("/regnumbers", render.storeRegistration)

app.post("/filter",  render.filterRegistration)

const PORT = process.env.PORT || 3037;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});