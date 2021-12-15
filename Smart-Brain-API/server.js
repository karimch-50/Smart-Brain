const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors= require('cors');

const knex = require('knex');

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '2001',
      database : 'smart_brain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req, res) => {
    res.send(dataBase.users);
});

app.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    db('login').select('email','hash')
    .where('email',email)
    .then(user=>{
        let isvalide=bcrypt.compareSync(password,user[0].hash);
        isvalide?db.select('*').from('users')
                   .where('email',email).then(user=>res.json(user[0]))
                :res.status(404).json('email or password incorrect!!')
    }).catch(err=>res.status(404).json('error loggin in'));
});

app.post('/register',(req, res)=>{
    const {name,email,password}=req.body;
    //crypt passwords
    const hash=bcrypt.hashSync(password);
    //new login account
    db.transaction(trx=>{
        trx.insert({
            hash: hash,
            email:email
        }).into('login').returning('email')
            .then(loginEmail=>{
                //new user account
                return trx('users').returning('*')
                .insert({
                    email:loginEmail[0],
                    name:name,
                    joined:new Date()})
                .then(user=>res.json(user[0]))
            }).then(trx.commit).then(trx.rollback)
            .catch(err =>res.status(400).json('unable to register'))
    });
});

app.get('/profile/:id',(req, res)=>{
    const {id}= req.params;
    db.select('*').from('users').where('id',id).then(user=>{
        user.length>0?res.json(user[0]):res.status(400).json('no such user')
    }).catch(err=>res.json('error getting user!!'));
});

app.put('/image',(req,res)=>{
    const {id}= req.body;
    db('users').where('id',id).increment('entries',1).returning('entries')
    .then(entries=>res.json(entries[0]))
    .catch(err=>{res.status(400).json('unable to get entries!!')});
});

app.listen(4000,()=>{
    console.log('app is running on port 4000');
});
