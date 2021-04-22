const express = require("express");
// const mongoose = require("mongoose")
const model = require("./model/contact")
const app = express();

const PORT = process.env.PORT || 8000

require('./db/conn')

app.use(express.json())

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

app.post('/', async (req, res)=>{
    const contacts = new model({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        message: req.body.message
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
        contact.message = req.body.message
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
app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
})