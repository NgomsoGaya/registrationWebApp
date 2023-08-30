import express from "express";
import flash from "express-flash";
import session from "express-session";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
//import Cookie from "express-session";
//import regFunction from "./frontendfunction/registrionDisplay.js";

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
//app.use(Cookie());

app.use(
  session({
    secret: "registration with routes",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  // res.send('registration!')
  res.render("index");
});

// app.get("/frontendfunction/registrionDisplay.js", (req, res) => {
//   res.setHeader("Content-Type", "text/javascript");
//   // Your code to send the JavaScript file
// });

app.post("/regnumbers", async (req, res) => {
    let regNo = req.body.reg
    console.log(regNo)

    // await regFunction().regNumbers(regNo)
    // let regDisplay = await regFunction().getRegNumbers()
    // console.log(regDisplay)

    let regNumbers = []
    regNumbers.push(regNo)

    res.render("index", { regNumbers: regNumbers });
})

const PORT = process.env.PORT || 3013;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});