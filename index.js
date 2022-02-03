//wep api used: unsplash, dog api, and random cat fact
//Where they are used (fetch calls): in the javascript external file: 
//home.js : uses both unsplash and dog api
//checkBox.js : uses the cat fact api 

const express = require("express");
const mysql = require('mysql');
const session = require('express-session');

const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret_key!',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.get('/logout', (req, res) => {
  console.log("logging out")
  req.session.authenticated = false;
  req.session.destroy();
  res.redirect('/')
});

app.get('/admin', logger, isAuthenticated, (req, res) => {
    res.render('adminPage');  
});

function logger(req, res, next){
  console.log("logger")
  next();
}

function isAuthenticated(req, res,next)
{
  console.log("is authenticated")
  if(!req.session.authenticated){
    res.redirect('/');
   
  }else{
    next();
  }
}
 
//pass using the post method
app.use(express.urlencoded({extended:true}));

//routes
app.get('/', async(req, res) => {
  let sql = 'SELECT distinct city FROM pets ';
  let rows = await executeSQL(sql);
  res.render('home',{"cities":rows});
});

//=========login ======= GET AND POST=====
//GET
app.get('/login', (req, res) => {
  if(req.session.authenticated){
    res.render('adminPage');
  }else{
    res.render('login');
  }
});
//POST SECTION
app.post('/login', async(req, res) => {
  let username = req.body.username;
  let userPassword = req.body.pwd;
  console.log(userPassword + " " + username);

  let sql = `SELECT * 
            FROM users
            WHERE username = ? AND password = ?`;
  let data = await executeSQL(sql, [username, userPassword]);

  if(data.length <= 0){
     res.render('login');
  }else{
     req.session.authenticated = true;
     res.render('adminPage');
  }
});

//Show the pets available of the place they selected
app.get('/city/pet', async(req, res) => {
  let cityName = req.query.cityName;
  if(cityName == undefined){
    console.log("here");
    res.redirect('/');
  }
  let sql = `SELECT *
             FROM pets 
             WHERE city = "${cityName}"`;

  let rows = await executeSQL(sql);
  
  console.log(rows);
   res.render('petHomes', {"petInfo": rows});
});



//returns the contact informfation
app.get('/contactInfo', async(req, res) => {
  
  //searching quotes by authorId the . is from the form in index.ejs
  let contactId = req.query.id;
  let sql = `SELECT * FROM contact WHERE contactId = ${contactId}`;
  let rows = await executeSQL(sql);

  console.log("hit");
  res.send(rows);
});


 // ==========Edit SECTION =============================
//------------Edit pet section: get and post ----------

app.get('/petList', async(req, res) => {
  let sql = "SELECT petsId, name FROM pets ORDER BY name";

  let rows = await executeSQL(sql);

  res.render('petList', {"pets": rows});
});

app.get('/pets/edit', async(req, res) => {

  let petId = req.query.petId;
  let sql = `SELECT *
             FROM pets 
             WHERE petsId = ${petId}`;

  let rows = await executeSQL(sql);
  
  console.log("edit section launching");


  res.render('editPet', {"petInfo": rows});
});

app.post('/pets/edit', async(req, res) => {

  let petId = req.body.petId;
  let sql = `UPDATE pets SET name = ?,
              city = ?,
              state = ?,
              description = ?,
              price = ?
              WHERE petsId = ${petId}`;

  let params = [req.body.name, req.body.city, req.body.state,  req.body.description, req.body.price];

  let rows = await executeSQL(sql, params);

   sql = `SELECT * 
          FROM pets 
          WHERE petsId = ${petId}`;

   rows = await executeSQL(sql);
  
   res.render('editPet', {"petInfo": rows, "message":"Pet Updated!"});
});

//------------Edit contacts section: get and post ----------
//shows the list of contacts, shows an update button
app.get('/contactList', async(req, res) => {
  let sql = "SELECT contactId, name FROM contact ORDER BY name";

  let rows = await executeSQL(sql);

  res.render('contactList', {"contact": rows});
});
//shows the contact information prefilled, user can edit
app.get('/contact/edit', async(req, res) => {
  let contact = req.query.contactId;
  let sql = `SELECT *
             FROM contact 
             WHERE contactId = ${contact}`;

  let rows = await executeSQL(sql);
  
  console.log("edit section launching: contact");
  res.render('editContact', {"contact": rows});
});
//Update the contact information in the database
app.post('/contact/edit', async(req, res) => {

  let contact = req.body.contactId;
  let sql = `UPDATE contact SET name = ?,
              gender = ?,
              number = ?,
              age = ?,
              picture = ?,
              address = ?
              WHERE contactId = ${contact}`;

  let params = [req.body.name, req.body.gender, req.body.number,  req.body.age, req.body.picture, req.body.add];

  let rows = await executeSQL(sql, params);

   sql = `SELECT *
          FROM contact 
          WHERE contactId = ${contact}`;

   rows = await executeSQL(sql);
  
   res.render('editContact', {"contact": rows, "message":"Contact Updated!"});
});
//------------user----------
//shows the list of users, shows an update button
app.get('/userList', async(req, res) => {
  let sql = "SELECT usersId, username FROM users ORDER BY username";

  let rows = await executeSQL(sql);

  res.render('userList', {"user": rows});
});
//shows the user information prefilled, user can edit
app.get('/user/edit', async(req, res) => {
  let user = req.query.userId;
  let sql = `SELECT *
             FROM users 
             WHERE usersId = ${user}`;

  let rows = await executeSQL(sql);
  
  console.log("edit section launching: users");
  res.render('editUser', {"user": rows});
});
//Update the user information in the database
app.post('/user/edit', async(req, res) => {

  let user = req.body.userId;
  
  let sql = `UPDATE users SET username = ?,
              password = ?
              WHERE usersId = ${user}`;

  let params = [req.body.username, req.body.password ];

  let rows = await executeSQL(sql, params);

   sql = `SELECT *
          FROM users 
          WHERE usersId = ${user}`;

   rows = await executeSQL(sql);
  
   res.render('editUser', {"user": rows, "message":"User Updated!"});
});


app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "x8autxobia7sgh74.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "p4kqvqfr8b0vdrrt",
      password: "ty09xa75z4pgwfpk",
      database: "fyc6ojasr84dik56"
   }); 
   return pool;
} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )