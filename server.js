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

// chained route handlers
app.route('/jokes')
.get(
    
    (req, res) => {
        Joke.find((error, jokes) => {
            if(!error){
                res.send(jokes);
            }
            else{
                res.send(error);
            }
        });
    }
)
.post(
    (req, res) => {
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
    }
)
.delete(
    (req, res) => {
        Joke.deleteMany((error) => {
            if(!error){
                res.send('deleted all records');
            }
            else{
                res.send(error);
            }
        });
    }
);


// get specific joke
app.route("/jokes/:jokeTitle")
    .get((req, res) => {        // koolin tähendab, et tulevad parameetrid peale koolonit
        Joke.findOne({title : req.params.jokeTitle}, (error, jokeFound) => {    // params.jokeTitle ongi parameeter
            if(jokeFound){
                res.send(jokeFound);
            }
            else{
                res.send("no joke title found!");
            }
        });   
    })
    .put((req, res) => {
        Joke.update(
            { title: req.params.jokeTitle },    // the document update
            { title: req.body.title, content: req.body.content},
            {overwrite: true},
            (error) => {
                if(!error){
                    res.send("document updated");
                }
                else{
                    res.send(error);
                }
            }
        );
    })
    .delete((req, res) =>{
        Joke.deleteOne(
            {title: req.params.jokeTitle},
            (error)=> {
                if(!error){
                    res.send("document deleted");
                }
                else{
                    res.send(error);
                }
            }
        );
    });

app.listen(3000, () => {
    console.log('Listening on port 3000');
});