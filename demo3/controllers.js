function TodoListsController (queries) {
  var ctrl = this;
  ctrl.queries = queries;
  console.log('queries', ctrl.queries.todos[0].text);
}

function AppController(ngDexie, BoundQuery) {

  var ctrl = this;
  ctrl.todos = [];
  ctrl.newTitle = '';

  BoundQuery(
    'todo',
    function () {
      ngDexie.list('todo')
        .then(function (data) {
                ctrl.todos = data;
              });
    });

  ctrl.addToDo = function (newTitle) {
    ngDexie.put('todo', {text: newTitle, _id: String(Date.now())})
      .then(function () {
              ctrl.newTitle = '';
            });
  };

  ctrl.deleteToDo = function (id) {
    ngDexie.delete('todo', id);
  };
}

angular.module('app')
  .controller('TodoListsController', TodoListsController)
  .controller('AppController', AppController);
