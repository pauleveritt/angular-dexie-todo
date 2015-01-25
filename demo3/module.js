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
               todolists: function () {
                 var _this = this;
                 _this.groups = [1, 2, 3];
                 return _this.groups;
               }
             }
           });


  $urlRouterProvider.otherwise("/home");
}

function ModuleRun($log, ngDexie) {
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

}

angular.module('app', ['ui.router', 'idb.utils'])
  .config(ModuleConfig)
//.run(ModuleRun);