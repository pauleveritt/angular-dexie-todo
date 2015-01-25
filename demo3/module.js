function ModuleConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('layout', {
             abstract: true,
             templateUrl: 'templates/layout.html',
             controller: 'LayoutController as ctrl'
           })
    .state('home', {
             url: '/home',
             parent: 'layout',
             templateUrl: 'templates/home.html'
           })
    .state('todolists', {
             abstract: true,
             url: '/todolists',
             parent: 'layout',
             template: '<div ui-view></div>'
           })
    .state('todolists.list', {
             url: '/list',
             templateUrl: 'templates/todolists_list.html',
             controller: 'TodoListsController as ctrl',
             resolve: {
               queries: function (BoundQuery, ngDexie) {
                 var _this = this;
                 _this.todolists = [];

                 BoundQuery(
                   'todolists',
                   function () {
                     ngDexie.list('todolists')
                       .then(function (data) {
                               _this.todolists = data;
                             });
                   });

                 return _this;

               }
             }
           })
    .state('todolist', {
             url: '/{todolistId}',
             abstract: true,
             parent: 'todolists',
             templateUrl: 'templates/todolist.html',
             controller: 'TodoListController as ctrl',
             resolve: {
               queries: function (BoundQuery, ngDexie, $stateParams) {
                 var _this = this;
                 _this.todolist = {};
                 todolistId = $stateParams.todolistId;

                 BoundQuery(
                   'todolists',
                   function () {
                     ngDexie.get('todolists', todolistId)
                       .then(function (data) {
                               _this.todolist = data;
                             });
                   });

                 return _this;

               }
             }
           })
    .state('todolist.list', {
             url: '/list',
             templateUrl: 'templates/todolist_list.html',
             controller: 'TodoListListController as ctrl',
             resolve: {
               todolistId: function ($stateParams) {
                 return $stateParams.todolistId;
               },
               queries: function (BoundQuery, ngDexie, todolistId) {
                 var _this = this;
                 _this.todos = [];

                 BoundQuery(
                   'todos',
                   function () {
                     ngDexie.list('todos')
                       .then(function (data) {
                               _this.todos = data;
                             });
                   });

                 return _this;

               }
             }
           })
    .state('todo', {
             url: '/{todoId}',
             parent: 'todolist',
             templateUrl: 'templates/todo.html',
             controller: 'TodoController as ctrl',
             resolve: {
               todoId: function ($stateParams) {
                 return $stateParams.todoId;
               },
               queries: function (BoundQuery, ngDexie, todoId) {
                 var _this = this;
                 _this.todo = {};

                 BoundQuery(
                   'todos',
                   function () {
                     ngDexie.get('todos', todoId)
                       .then(function (data) {
                               _this.todo = data;
                             });
                   });

                 return _this;

               }
             }
           });

  $urlRouterProvider.otherwise("/home");
}


function ModuleRun($log, ngDexie) {
  var configuration = function (db) {
    db.version(1).stores(
      {
        todolists: '_id',
        todos: '_id, listId'
      }
    );
    db.on("populate", function () {
      db.todolists.put({_id: '1', text: 'First List'});
      db.todos.put(
        {_id: '1', listId: '1', text: 'First List Item'}
      );
    });
    db.on('error', function (err) {
      $log.error("db error", err);
    });
  };

  ngDexie.init('ToDoListApp', configuration, false)
    .then(function () {
            $log.debug('Opened ToDoList Database');
          });

}

angular.module('app', ['ui.router', 'idb.utils'])
  .config(ModuleConfig)
  .run(ModuleRun);