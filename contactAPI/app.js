const express = require("express");
// const mongoose = require("mongoose")
const model = require("./model/contact")
const app = express();
const cors = require('cors')
const Admin = require('./model/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 8000

require('./db/conn')

const JWT_SECRET = 'adbjsbjdbsjbjab@!BHJBHBhB!#$$%bdvvjhbdhbvhj2434jbsjkkjbjk'
require('./db/conn');

app.use(express.json())

app.use(cors());

// API for products
app.get('/', async (req, res)=>{
    try {
        const contacts = await model.find();
        res.json(contacts);
    } catch (error) {
        res.send('Error' + error);
    }
})

app.get('/:id', async (req, res)=>{
    try {
        const contact = await model.findById(req.params.id);
        res.json(contact);
    } catch (error) {
        res.send('Error' + error);
    }
})

app.post('/products', async (req, res)=>{
    const contacts = new model({
        name: req.body.name,
        brand: req.body.brand,
        size: req.body.size,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description
    })

    try {
        const result = await contacts.save()
        res.json(result);
    } catch (error) {
        res.send('Error' + error);
    }
})

app.patch('/:id',async (req, res)=>{
    try {
        const contact = await model.findById(req.params.id)
        contact.quantity = req.body.quantity
        const result = await contact.save()
        res.json(result);
    } catch (error) {
        res.send('Error' + error)
    }
})

app.delete('/:id', async (req, res)=>{
    try {
        const contact = await model.findById(req.params.id)
        const result = await contact.delete()
        res.json(result)
    } catch (error) {
        res.send('Error' + error)
    }
})

//  API for Admin




//PORT 
// const PORT = process.env.PORT || 9000;
// app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: "API Working" });
})

app.post('/admin/change-password', async (req, res) => {
    
    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({
            status: 'error',
            error: 'Invalid Password'
        })
    }
    if (plainTextPassword.length < 6) {
        return res.json({
            status: 'error',
            error: ' Password length should be 6 characters long'
        })
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);

        const _id = user.id

        const password = await bcrypt.hash(plainTextPassword, 10);

        await Admin.updateOne(
            { _id },
            {
                $set: { password}
            })
    res.json({ status: 'ok' })
 
        // console.log('JWT Decoded:', user);
    } catch (error) {
        console.log(error);
        return res.json({ status: 'error', error: ';))' })
    }

})

app.post('/admin/login', async (req, res) => {

    const { email, password } = req.body

    const user = await Admin.findOne({ email }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid email/Password' })
    }

    if (await bcrypt.compare(password, user.password)) {

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, JWT_SECRET)
        //email and password combination is successful
        return res.json({ status: 'ok', data: token })
    }
    else{
    return res.json({ status: 'error', error: 'Invalid email/Password' })
}

})

app.post('/admin/register', async (req, res) => {
    // console.log(req.body);

    // Hashing password using bcryptjs

    const { name, phone, email, password: plainTextPassword } = req.body

    // if (!name || typeof name !== 'string') {
    //     return res.json({
    //         status: 'error',
    //         error: 'Invalid Name'
    //     })
    // }

    if (!email || typeof email !== 'string') {
        return res.json({
            status: 'error',
            error: 'Invalid Email'
        })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({
            status: 'error',
            error: 'Invalid Password'
        })
    }
    if (plainTextPassword.length < 6) {
        return res.json({
            status: 'error',
            error: ' Password length should be 6 characters long'
        })
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    // console.log(await bcrypt.hash(password, 10));

    try {
        const response = await Admin.create({
            email,
            password
        })
        console.log('User created successfully:', response);
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'Email already in use.' })
        }
        throw error
    }

    res.json({ status: 'ok' })
})

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
})