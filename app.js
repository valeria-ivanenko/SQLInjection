const db = require("./utils/db.js");
const express = require('express')
const app = express()

app.use(express.json())
app.set('view engine', 'ejs');

app.get("/", function (req,res){
    res.render('index')
})
//safe index
app.get("/safe", function (req,res){
    res.render('indexsafe')
})
app.get("/registerform", function (req,res){
    res.render('registerForm')
})
app.get("/findactor", function (req,res){
    res.render("findactor")
})
app.get("/findactor/actor", function (req,res){
    let query = `SELECT * FROM Actors WHERE first_name LIKE '%${req.query.name}%';`
    db.query(query, (err,result) => {
        console.log(err)
        console.log(result)
        if(err){
            res.render('result',{error: err,notes:[]})
        } else {
            res.render('result',{error: err,notes:result})
        }
    })
})

app.get("/welcome/:login", function (req,res){
    res.render('landing', {data: {userName: req.params.login}})
})
app.post("/my", function (req,res){
    // Comment based injection
    // http://localhost:8888/welcome/sqlinjection'%20OR%201=1%20--
    let sql = `SELECT login, password FROM Users WHERE login = '${req.body.login}' AND password = '${req.body.password}';`;
    db.query(sql, (err,rows) => {
        if(err) return console.error(err.message);
        rows.forEach((row) => {
            console.log(row)
            res.json({login:req.body.login})
        })
    })
})
//protection from SQLInjection: placeholders
app.post("/mysafe", function (req,res){
    let login = req.body.login
    let password = req.body.password
    let sql = `SELECT login, password FROM Users WHERE login = ? AND password = ?;`;
    db.query(sql, [login, password], (err,rows) => {
        if(err) return console.error(err.message);
        rows.forEach((row) => {
            console.log(row)
            res.json({login:req.body.login})
        })
    })
})
app.post('/addnew', function(req,res){
    // Insert data
    let sql = `INSERT INTO Users(login,password) VALUES (?,?)`;
    db.query(sql,[req.body.login, req.body.password], (err) => {
        if(err) return console.error(err.message)
        res.json({login:req.body.login})
    })
})

app.listen(8888, function () {
    console.log("Server is running on port 8888")
})
