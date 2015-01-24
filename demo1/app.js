(function () {

  function AppController($scope, $window) {
    var db = new Dexie('todos');
    db.version(1).stores({todo: '_id'});
    db.open();

    var ctrl = this;
    ctrl.todos = [];
    ctrl.newTitle = '';

    function refresh() {
      db.todo.toArray(function (todos) {
        $scope.$apply(function () {
          ctrl.todos = todos;
        })
      });
    }

    refresh();

    ctrl.addToDo = function (newTitle) {
      console.log('adding', newTitle)
      db.todo.put({text: newTitle, _id: String(Date.now())})
        .then(function () {
                ctrl.newTitle = '';
              });
    };

    ctrl.deleteToDo = function (id) {
      db.todo.where('_id').equals(id).delete();
    };

    $window.db = db;

    // Listeners
    db.todo.hook('deleting', function (primKey, obj, transaction) {
      this.onsuccess = function () {
        refresh();
      }
    });
    db.todo.hook('creating', function (primKey, obj, transaction) {
      this.onsuccess = function () {
        refresh();
      }
    });
    db.todo.hook('updating', function (primKey, obj, transaction) {
      this.onsuccess = function () {
        refresh();
      }
    });
  }

  angular.module('app', [])
    .controller('AppController', AppController);


}());
