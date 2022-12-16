
const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const port = 8008

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!')
})





const uri = "mongodb+srv://name:name@cluster0.duddlun.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('bbb')
    const collection = client.db("blockchain").collection("user");
    const infoCollection = client.db("blockchain").collection("info");


    app.post('/register', (req, res) => {
        const User = req.body;
        //res.send('Hello World!')
        console.log(User)
        collection.findOne({ email: User.email }, (err, user) => {
            if (user) {
                console.log(user)
                res.send({ message: "User Already Registered" })
            } else {
                collection.insertOne(User)

                    .then(result => {
                        console.log(result);
                        res.send({ message: 'Successfully Registered' })
                    })
            }
        })
    })
    app.post('/login', (req, res) => {
        const { email, password } = req.body
        collection.findOne({ email: email }, (err, user) => {
            if (user) {
                if (password === user.password) {
                    res.send({ message: 'Successfully Login', user })
                } else {
                    res.send({ message: 'Password Not Match' })
                }
            } else {
                res.send({ message: 'User Not Registered' })
            }
        })
    })




    // add info

    app.post('/addInfo', (req, res) => {
        const events = req.body
        infoCollection.insertOne(events)
            .then(result => {
                console.log(result);
                res.send({ message: 'Successfully add Info' })

            })
    })




    //get info
    app.get("/getInfo", (req, res) => {
        infoCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //get user

    app.get("/getUser", (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    //get Search

    app.get('/getSearch/:nid', (req, res) => {
        var regex = new RegExp(req.params.nid, 'i')
    
        infoCollection.findOne({ nid: regex })
          .then(data => {
            res.send(data);
          })
      })



    // edit 

    app.patch("/edit/:id", (req, res) => {
        const updateInfo = req.body;
        console.log(updateInfo)
        infoCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { name: req.body.name, age: req.body.age, nid: req.body.nid, image: req.body.image, status: req.body.status, birthDate: req.body.birthDate }
            })
            .then(result => {
                res.send(result);
            })
    })

    app.patch("/editRule/:id", (req, res) => {

        console.log(req.body)
        collection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { rule: req.body.rule }
            })
            .then(result => {
                res.send(result);
            })
    })

    // delete

    app.delete("/delete/:id", (req, res) => {
        console.log(req.params.id)
        infoCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result)
            })
    })




});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})