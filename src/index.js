const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const User = require('../src/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const JWT_SECRET = 'adbjsbjdbsjbjab@!BHJBHBhB!#$$%bdvvjhbdhbvhj2434jbsjkkjbjk'
require('./db/conn');

const app = express();

app.use(cors())

app.use('/', express.static(path.join(__dirname, '../static')));

//PORT 
const PORT = process.env.PORT || 9000;
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: "API Working" });
})

app.post('/api/change-password', async (req, res) => {
    
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

        await User.updateOne(
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

app.post('/api/login', async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email }).lean()

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

app.post('/api/register', async (req, res) => {
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
        const response = await User.create({
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

app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`)
})