const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = require('./models').sequelize;
const bodyParser = require('body-parser')
const router = require('./route');
sequelize.sync();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/', router);

/*app.get('/get/data', (req, res) => {
    Teacher.findAll({
    })
    .then( result => { res.send(result) })
    .catch( err => { throw err })
}) 

app.post('/add/data', (req, res) => {
    console.log(req.body)

    Teacher.create({
        name : req.body.data
    })
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        console.log(err)
        throw err;
    })
})

app.post('/modify/data', (req, res) => {
    Teacher.update({name: req.body.modify.name}, {
        where : {id : req.body.modify.id}
    })
    .then( result => {res.send(result)})
    .catch( err => {throw err})
})

app.post('/delete/data', (req, res) => {
    Teacher.destroy({
        where : {id : req.body.delete.id}
    })
    .then(res.sendStatus(200))
    .catch(err => {throw err})
})
*/
app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);  
})
