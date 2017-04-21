var express = require('express');
var router = express.Router();

const knex = require('../db/knex');


// *This Router is mounted at http://localhost:/3003/todo **
router.get('/', function(req, res, next) {
  knex('todo')
    .select()
    .then(todos => {
      res.render('all', { todos });
    })
});

router.get('/new', (req, res) => {
  res.render('new');
    })

    function respondAndRenderTodo(id, res, viewName) {
      if(typeof id != 'undefined') {
      knex('todo')
        .select()
        .where('id', id)
        .first()
        .then(todos => {
          res.render(viewName, todos);
        })
        } else {
          res.status(500);
          res.render('error', {
            message: 'Invalid ID'
          })
        }
    }

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'single')
});

router.get('/:id/edit', (req, res) => {
  // get the todo with the id in the url
  const id = req.params.id;
  respondAndRenderTodo(id, res, 'edit')
})

    function validTodo(todo) {
      return typeof todo.title == 'string' &&
      todo.title.trim() != '' &&
      typeof todo.priority != 'undefined' &&
      !isNaN(Number(todo.priority));
    }

function validateTodoInsertUpdateRedirect(req, res, callback) {
      if(validTodo(req.body)) {
        const todo = {
          title: req.body.title,
          description: req.body.description,
          priority: req.body.priority,
          date: new Date()
        };
        // insert into database
        callback(todo)
        } else {
        // respond with error
        res.status(500);
        res.render('error', {
          message: 'Invalid todo'
        })
      }
    }

router.post('/', (req, res) => {
  console.log(req.body);
  validateTodoInsertUpdateRedirect(req, res, (todo) => {
    todo.date = new Date()
    knex('todo')
      .insert(todo, 'id')
      .then(ids => {
        const id = ids[0];
        res.redirect(`/todo/${id}`)
        })
  })
})

router.put('/:id', (req, res) => {
  validateTodoInsertUpdateRedirect(req, res, (todo) => {
    todo.date = new Date()
    knex('todo')
    .where('id', req.params.id)
    .update(todo, 'id')
    .then(() => {
        res.redirect(`/todo/${req.params.id}`)
        })
  })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  if(typeof id != 'undefined') {
  knex('todo')
    .where('id', id)
    .del()
    .then(() => {
      res.redirect('/todo');
      })
    } else {
    res.status(500);
    res.render('error', {
      message: 'Invalid ID'
    })
  }
})

module.exports = router;
