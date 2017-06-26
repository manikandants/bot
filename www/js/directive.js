bottrApp.directive('enterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          var key = typeof event.which === "undefined" ? event.keyCode : event.which;
          console.log(key);
            if(key === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterKey);
                });
                event.preventDefault();
            }
        });
    };
});