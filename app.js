const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

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
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

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
        // Contém todos elementos da database (horario, data e dataMoment)
        horarios: horarioTotal
      });
    });
});

// Process Post
/*app.post('/', (req, res) => {
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

});*/


app.post('/', (req, res) => {
  console.log(req.body.horasOption);
  console.log(req.body.minutosOption);

  let convertToInt = parseInt(req.body.horasOption);
  convertToInt += 4;

  const novoHorario = {
    /* Tem que ter o mesmo nome dos objetos definidos no (Horário.js). 
    A database do MongoDb */
    horarioHora: req.body.horasOption,
    horarioMinuto: req.body.minutosOption,
    horarioSaida: convertToInt
  }

  //console.log(novoHorario.horarioHora);

  new Horario(novoHorario)
    .save()
    .then(horarios => {
      res.redirect('/horarios')
    })

});

// Deletar Horário
app.delete('/horarios/:id', (req, res) => {
  //res.send('deletado');
  Horario.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/horarios')
    });
});


const port = 3000;

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}`);
});
