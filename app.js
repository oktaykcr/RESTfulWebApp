var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose 	   = require("mongoose"),
express        = require("express");

var app = express();

app.set("view engine", "ejs");// not to write .ejs into the render

app.use(bodyParser.urlencoded({ extended : true }));// to get post service values
app.use(methodOverride("_method"));// to create put and delete services
app.use(express.static("public")); // for serve app.css in public folder to all ejs files

// connecting to our MongoDB if not exist it creates new database
mongoose.connect("mongodb://localhost/web-app-demo");

// creating new MongoDB schema 
var schema = new mongoose.Schema({
	name : String,
	surname : String,
	age : Number
});

// MongoDB model assigning to User var
var User = mongoose.model("User", schema);

// INDEX ROUTE
app.get("/", function (req, res) {
	res.render("index");
});

app.get("/users", function (req, res) {
	User.find({}, function (err, doc) {
		if(!err){
			console.log("Database is loaded successfully!");
			res.render("users", {users : doc});
		}
		else console.log("Failed to load database!");
	});
});

app.get("/users/new", function (req ,res) {
	res.render("newuser");
});

// CREATE USER
app.post("/users", function (req, res) {
	var u_name = req.body.user_name;
	var u_surname = req.body.user_surname;
	var u_age = req.body.user_age;
	var newuser = { name : u_name, surname : u_surname, age : parseInt(u_age) };
	User.create(newuser, function (err, doc) {
		if(!err){
			res.redirect("/users");
			console.log(doc+" successfully added!");
		} 
		else{
			console.log("Failed to add new user!");
			res.redirect("/users");
		} 
	});
});

// EDIT ROUTE
app.get("/users/:id/edit", function (req, res) {
	var userId = req.params.id;
	User.findById(userId, function (err, doc) {
		if(err){
			res.redirect("/users");
		}else{
			res.render("edituser", {user : doc}); 
		}
	});
	
});

// EDIT USER
app.put("/users/:id", function (req, res) {
	var userId = req.params.id;
	var body = req.body.user;
	User.findByIdAndUpdate(userId, body, function (err, doc) {
		if(err){
			console.log("There is occur an error while updating a user!");
			res.redirect("/users");
		}else{
			res.redirect("/users");
		}
	});
});

// REMOVE USER
app.delete("/users/:id", function (req, res) {
	var userId = req.params.id;
	User.findByIdAndRemove(userId, function (err) {
		if(err){
			console.log("There is occur an error while deleting a user!")
		}
		res.redirect("/users");
	});
});


var PORT = 8080;// 80 for http port
var IP = "0.0.0.0";//localhost

// Start to listen server
app.listen(PORT, IP, function () {
	console.log("SERVER HAS BEEN STARTED!");
});