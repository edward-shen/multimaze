(function() {
    var app = angular.module("multimaze", []);

    app.controller("customRoomController", function() {
        this.request = { diff:"medium" }; // Initializes our difficulty as medium

        this.join = function() {
            socket.emit('ready', this.request);
        };
    });

    // If this directive is added to an input, said input only becomes valid if the length is equal to zero or at least three characters
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
