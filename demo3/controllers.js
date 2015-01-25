function TodoListsController(ngDexie, queries) {
  var ctrl = this;
  ctrl.queries = queries;
  ctrl.newTitle = '';

  ctrl.addToDoList = function (newTitle) {
    ngDexie.put('todo', {text: newTitle, _id: String(Date.now())})
      .then(function () {
              ctrl.newTitle = '';
            });
  };
  ctrl.deleteToDo = function (id) {
    ngDexie.delete('todo', id);
  };
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
