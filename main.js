require('dotenv').config();

const {Client} = require('pg')
const express = require('express')

const app = express()
app.use(express.json())

const con = new Client ({
    host: "localhost",
    user: "postgres",
    port: 5433,
    password: "2004",
    database: "HopeConnectDataBase"
})

con.connect().then(()=> console.log("connected"))

app.post('/postData', (req,res)=>{
    const {name, email, phone, address, password_hash, role} = req.body
    const insertQry = `INSERT INTO users (name, email, phone, address, password_hash, role) 
VALUES ($1, $2, $3, $4 , $5, $6);`;
    con.query(insertQry, [name, email, phone, address, password_hash, role], (err,result)=>{
        if(err){
            res.send(err)
        }else {
            console.log(result)
            res.send("POSTED DATA")
        }
    })
})
app.get('/fetchData',(req,res)=>{
    const fetchQry = 'SELECT * FROM users;'
    con.query(fetchQry, (err,result)=>{
        if(err){
            res.send(err)
        }else {
            res.send(result.rows)
        }
    })
})
app.get('/fetchById/:id',(req,res)=>{
    const id = req.params.id
    const fetchQry = 'SELECT * FROM users WHERE id = $1;'
    con.query(fetchQry,[id], (err,result)=>{
        if(err){
            res.send(err)
        }else {
            res.send(result.rows)
        }
    })
})

app.put('/update/:id',(req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const updateQry = 'UPDATE users SET name = $1 WHERE id = $2;'
    con.query(updateQry,[name, id], (err,result)=>{
        if(err){
            res.send(err)
        }else {
            res.send("UPDATED")
        }
    })
})

app.delete('/delete/:id',(req,res)=>{
    const id = req.params.id
    const deleteQry = 'DELETE FROM users WHERE id = $1;'
    con.query(deleteQry, [id],(err,result)=>{
        if(err){
            res.send(err)
        }else {
            res.send(result)
        }
    })
})

app.listen(3000, ()=>{
    console.log("Server is running.....")
})

