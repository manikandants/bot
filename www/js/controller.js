bottrApp.controller('home', ['$scope', 'apiFactory', function($scope, apiFactory) {
  $scope.history = function() {
    apiFactory.getHistory().then(function(resp) {
      console.log(resp);
      $scope.messages = resp.data;
    }, function(err) {
      console.log(err);
    });
  };
  $scope.chat = function() {
    apiFactory.chat({
      chat: $scope.message
    }).then(function(resp) {
      console.log(resp);
      $scope.history();
    }, function(err) {
      console.log(err);
      $scope.history();
    });
  };
  $scope.history();
}]);