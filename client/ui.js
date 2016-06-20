(function() {
    var app = angular.module("multimaze", []);

    app.controller("UIctrl", function() {
    });

    app.controller("customRoomController", function() {
        this.request = { };
        this.join = function() {
            socket.emit('ready', this.request);
        };
    });

    app.directive('lengthValidation', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, mCtrl) {
                function myValidation(value) {
                    if (value.length == 0 || value.length >= 3) {
                        mCtrl.$setValidity('length', true);
                    } else {
                        mCtrl.$setValidity('length', false);
                    }
                    return value;
                }
                mCtrl.$parsers.push(myValidation);
            }
        };
    });
})();
