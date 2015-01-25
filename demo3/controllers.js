function TodoListsController(ngDexie, queries) {
  var ctrl = this;
  ctrl.queries = queries;
  ctrl.newTitle = '';

  ctrl.addToDoList = function (newTitle) {
    ngDexie.put('todolists', {text: newTitle, _id: String(Date.now())})
      .then(function () {
              ctrl.newTitle = '';
            });
  };
  ctrl.deleteToDoList = function (id) {
    ngDexie.delete('todolists', id);
  };
}

function TodoListController(queries) {
  var ctrl = this;
  ctrl.queries = queries;
}

function TodoListListController(ngDexie, queries, todolistId) {
  var ctrl = this;
  ctrl.queries = queries;
  ctrl.newTitle = '';

  ctrl.addToDo = function (newTitle) {
    ngDexie
      .put('todos',
           {text: newTitle, _id: String(Date.now()), listId: todolistId})
      .then(function () {
              ctrl.newTitle = '';
            });
  };
  ctrl.deleteToDo = function (id) {
    ngDexie.delete('todolists', id);
  };
}

function TodoController(queries) {
  var ctrl = this;
  ctrl.queries = queries;
}


angular.module('app')
  .controller('TodoListsController', TodoListsController)
  .controller('TodoListController', TodoListController)
  .controller('TodoListListController', TodoListListController)
  .controller('TodoController', TodoController);
