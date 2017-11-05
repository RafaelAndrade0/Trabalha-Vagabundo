const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicia App
const app = express();

// Utilizando rotas estáticas
app.use(express.static('public'));

// Carrega o mongoose
require('./models/Horario');
const Horario = mongoose.model('horarios');

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Map global promise to get rid of warning (Deprecation warning: Mongoose)
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/horarios-app', {
    useMongoClient: true
})
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));

// Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Index Route
app.get('/', (req, res) => {
  res.render('home');
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Lista Horários
app.get('/horarios', (req, res) => {
  //Horario com maisculo é o objeto criado no começo do programa.
  Horario.find({})
    .sort({data: 'desc'})
    // horarioTotal pode ser qualquer nome. Não interfere.
    .then(horarioTotal => {
      res.render('horarios', {
        // Horarios é o objeto passado para a view (horarios.handlebars)
        horarios: horarioTotal
      });
    });
});

// Process Post
app.post('/', (req, res) => {
  console.log(req.body.selectOption);
  //console.log('hey');
  const novoHorario = {
    horario: req.body.selectOption
  }

  new Horario(novoHorario)
    .save()
    .then(horarios => {
      res.redirect('/horarios')
    }) 

});

const port = 3000;

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}`);
});
