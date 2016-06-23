(function() {
    var app = angular.module("multimaze", []);


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

    app.controller("customRoomController", function() {
        this.request = { diff:"medium" }; // Initializes our difficulty as medium

        this.join = function() {
            $("#ui").hide();
            $("#loader").show();
            username = this.request.username;
            socket.emit('ready', this.request, function(resp) {
                console.log(resp);
                if (resp === "full") {
                    alert("that room is full!");
                    $("#ui").show();
                    $("#loader").hide();
                } else if (resp === "ok") {
                    $("#overlay").hide();
                    $("#waiting").show();
                } else {
                    console.error("Malformed acknowledgement of room!");
                    console.error("Response: " + resp);
                }
            });
        };
    });

    app.controller("chatController", function() {
        this.msg = "";

        this.sendMessage = function() {
            var data = {user: username, msg: this.msg};

            socket.emit('chatMsg', data);
            this.msg = "";
            updateScroll();
        };
    });
})();
