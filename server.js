const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/jokesDB', {useNewUrlParser: true, useUnifiedTopology : true});

const jokesSchema = {
    title: String,
    content: String
}

const Joke = mongoose.model('Joke', jokesSchema);

app.post('/jokes', (req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    let newJoke = new Joke({
        title: req.body.title,
        content: req.body.content
    });

    newJoke.save((error => {
        if(!error){
            res.send('data sent');
        }
        else{
            res.send(error);
        }
    }));
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});