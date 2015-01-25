function LayoutController($scope, $interval, ngDexie) {
  var ctrl = this;
  ctrl.runRefresh = false;

  var interval = $interval(function () {
    if (ctrl.runRefresh) {
      console.log('adding random todo to first list.');
      var now = String(Date.now());
      ngDexie
        .put('todos',
             {
               text: now + ' Random Item',
               _id: now,
               listId: '1'
             });
    }
  }, 5000);

  $scope.$on('$destroy', function () {
    // Make sure that the interval is destroyed too
    $interval.cancel(interval);
  });
}

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
    ngDexie.delete('todos', id);
  };
}

function TodoController(queries) {
  var ctrl = this;
  ctrl.queries = queries;
}


angular.module('app')
  .controller('LayoutController', LayoutController)
  .controller('TodoListsController', TodoListsController)
  .controller('TodoListController', TodoListController)
  .controller('TodoListListController', TodoListListController)
  .controller('TodoController', TodoController);
