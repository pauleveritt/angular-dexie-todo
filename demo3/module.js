function ModuleConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('layout', {
             abstract: true,
             templateUrl: 'templates/layout.html'
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
             templateUrl: 'templates/todolists_lists.html',
             controller: 'TodoListsController as ctrl',
             controllerAs: 'ctrl',
             resolve: {
               queries: function (BoundQuery, ngDexie) {
                 var _this = this;
                 _this.todos = [1, 2, 3];

                 BoundQuery(
                   'todo',
                   function () {
                     ngDexie.list('todo')
                       .then(function (data) {
                                                    console.log('in here')
                               _this.todos = data;
                             });
                   });

                 return _this;

               }
             }
           });


  $urlRouterProvider.otherwise("/home");
}

function ModuleRun($rootScope, $log, ngDexie) {
  var configuration = function (db) {
    db.version(1).stores(
      {todo: '_id'}
    );
    db.on('error', function (err) {
      $log.error("db error", err);
    });
  };

  ngDexie.init('ToDoList', configuration, false)
    .then(function () {
            $log.debug('Opened ToDoList Database');
          });

  $rootScope
    .$on(
    '$stateChangeError',
    function (event, toState, toParams, fromState, fromParams, error) {
      console.debug('stateChangeError', error);
    });

}

angular.module('app', ['ui.router', 'idb.utils'])
  .config(ModuleConfig)
  .run(ModuleRun);