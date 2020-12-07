const express = require('express');
const { Int } = require('mssql');
const app = express()

app.use(express.urlencoded({ extended: true })); // this is done so  that  we can parse contents of post request

app.set("view engine", "ejs") // this is to tell the app that  ejs  is being used
const Sequelize = require('sequelize') // this is the main instance  we  use this when ever we have to use Sequelize properties like datatypes
const sequelize = new Sequelize(
  {
    dialect: "sqlite",
    storage: "./database.sqlite"
  }
) // this is our instance of sequelize this refers to our db   
sequelize
  .authenticate()   // simple promise that tells wheather connection true of not   
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const todo = sequelize.define("todos",      // this is defining our model and table in database , todo is model and todos is db table
  {
    todo_id: {
      type: Sequelize.DataTypes.NUMBER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      notNull: true
    },
    user: {
      type: Sequelize.DataTypes.STRING,
      notNull: true
    }
  });

sequelize.sync()   // this is used to create the model according with table if we specify fprce=true it will delete exiting and create new table
  .then(() => {
    console.log(`Database & tables created!`);
  })
  .catch(err => {
    console.error('Unable to create table and database:', err);
  });
// todo.bulkCreate([                                     if we need to nitialize table with some data
//   { todo_id:1,name:"Breakfast" },
// ]).then(function() {
//   return todo.findAll();
// }).then(function(todos) {
//   console.log(todos);
// });

// // const db= mysql.createConnection(
//     {
//         user:"hemant",
//         host:"localhost",
//         password:"hemant",
//         database:"tododatabase"
//     }
// );

app.use(express.static('public'))       // sharing static reources images,stylesheets
app.listen(5000, () => { console.log("server running") })  // server ready to listen

app.use((req, res, next) => {
  console.log("request arrived");
  console.log("host: " + req.hostname);
  console.log("method: " + req.method);
  console.log("httpVersion: " + req.httpVersion);
  console.log("url: " + req.url);
  next();

});
app.get('/json', (req, res) => {
  todo.findAll().then(todos => res.json(todos));
})
const users = ["hemant", "udit", "piyush", "deepak"]
app.get('/', (req, res) => {
  var todoList = [];
  todo.findAll()                      //return a array of todos
    .then(todos => {
      const currentPage = 0;
      res.render('homepage', { currentPage, todos, users })
    })
    .catch((err) => { console.log(err) });
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.post('/new', (req, res) => {
  todo.create({ todo_id: req.body.newTodoId, name: req.body.newTodoTask, user: req.body.user })
    .then(function (todo) {
      res.redirect('/');
    })
    .catch((err) => { console.log(err) });
})

app.post('/update', (req, res) => {
  todo.findByPk(req.body.todo_id)
    .then(function (todo) {
      todo.update({
        todo_id: req.body.todo_id,
        name: req.body.updatedTodo
      })
        .catch((err) => { console.log(err) })
    })
  res.redirect('/');
})
app.get('/user/:username', (req, res) => {
  const user = req.params.username;
  console.log(user);
  todo.findAll({ where: { user: user } }).then((todos) => { res.render('userpage', { todos, users }) }).catch((err) => { console.log("error" + err) });
})
const limit = 10;
app.get('/page/:page', (req, res) => {
  currentPage = req.params.page,
    todo.findAll({
      limit: 10,
      offset: limit * (currentPage - 1)
    })                      //return a array of todos
      .then(todos => { res.render('homepage', { currentPage, todos, users }) })
      .catch((err) => { console.log(err) });

})
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log("please delete this id" + id);
  todo.findByPk(id)
    .then((note) => {
      note.destroy()
    });
  res.redirect('/');
})

app.use((req, res) => {
  res.render('404')
})