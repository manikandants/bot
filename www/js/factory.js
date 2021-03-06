bottrApp.factory('apiFactory', ['$http', function($http) {
  var apiFactory = {};
  var domainURL = 'http://13.126.206.7:3000/api';
  apiFactory.getHistory = function() {
    return $http.get(domainURL + '/chat');
  };
  apiFactory.chat = function (data) {
    return $http.post(domainURL + '/chat', data);
  };
  return apiFactory;
}]);