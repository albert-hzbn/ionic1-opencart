angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $http, $ionicModal, $timeout, $ionicLoading, $location, $ionicNavBarDelegate, $ionicSideMenuDelegate, $ionicPopup, $ionicSlideBoxDelegate) {


    $scope.custom = true;
    $scope.toggleCustom = function () {
        $scope.custom = $scope.custom === false ? true : false;
    };


    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    $scope.session = [
        {
            status: "failed"
        }
    ];
    $scope.show = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        }).then(function () {
            console.log("The loading indicator is now displayed");
        });
    };

    $scope.hide = function () {
        $ionicLoading.hide().then(function () {
            console.log("The loading indicator is now hidden");
        });
    };


    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    };
    
    $scope.arrParentCategories = [];
    $scope.parentCategories = function () {
        $scope.show();
        $http.get('http://localhost/ionic1-opencart/api/parentcategories.php', config)
            .success(function (response) {
                $scope.arrParentCategories = response;

                response = replaceand(response);

                $scope.arrParentCategories = response;
                console.log($scope.arrParentCategories);
                $scope.hide();
            });


        $http.get('http://localhost/ionic1-opencart/api/featured.php', config)
            .success(function (response) {
                console.log(response);
                $scope.featuredproducts = response;

            });

    };

    $http.get('http://localhost/ionic1-opencart/api/homepage-banner.php', config)
        .success(function (response) {
            $scope.banner = response;
            console.log($scope.banner);
            setTimeout(function () {
                $ionicSlideBoxDelegate.update();
            }, 5000);


        });


    //Get coupon list
    $scope.getCouponList = function () {
        $http.get('http://localhost/ionic1-opencart/api/couponlist.php', config)
            .success(function (response) {
                $scope.coupon = response;
                console.log($scope.coupon);

            });
    };


    $scope.arrSubCategories = [];
    $scope.subCategories = function (category) {
        $scope.show();
        $http.post('http://localhost/ionic1-opencart/api/subcategories.php', category, config)
            .success(function (response) {

                response = replaceand(response);
                $scope.arrSubCategories = response;
                console.log(response);

            });

        $http.post('http://localhost/ionic1-opencart/api/category-products.php', category, config)
            .success(function (response) {

                $scope.arrProducts = response;
                console.log(response);
                $scope.hide();

            });

    };


    //replace array with &amp; with &
    var replaceand = function fReplaceAnd(response) {
        arrlen = response.length;
        for (var i = 0; i < arrlen; i++) {
            response[i].name = response[i].name.replace(/&amp;/g, '&');
        }
        return response;
    }

    $scope.fproduct = function (product) {
        $scope.show();
        $scope.productdetails = product;
        var str = JSON.stringify($scope.productdetails);
        localStorage.setItem("lProduct", str);

        $scope.lproduct = $scope.productdetails;
        console.log($scope.productdetails);
        $scope.hide();
    };

    $scope.flastproduct = function () {
        var str = localStorage.getItem("lProduct");
        $scope.productdetails = JSON.parse(str);
        $scope.lproduct = $scope.productdetails;

        console.log("product details");
        console.log($scope.productdetails);

    };




    $scope.cart = [{}];
    $scope.cartQuantity = 0;
    $scope.total = 0;
    $scope.totalSaving = 0;
    $scope.shipping = 0;
    $scope.beforecoupon = 0;


    //Add to cart or increase the quantity of the item
    $scope.addToCart = function (product) {
        var exists = false;
        var len = $scope.cart.length;

        //if product in the cart exists increase the quantity
        for (var i = 0; i < len; i++) {
            if (product.name == $scope.cart[i].name) {
                exists = true;
                $scope.cart[i].quantity += 1;

            }
        }
        // if does not exists add new item in the cart
        if (!exists) {
            $scope.cart.push({
                product_id: product.product_id,
                name: product.name,
                image: product.image,
                price: product.price,
                dprice: product.dprice,
                quantity: 1
            });
        }

        $scope.total += parseFloat(product.dprice);
        $scope.totalSaving += (parseFloat(product.price) - parseFloat(product.dprice));
        console.log($scope.cart);

        $scope.fcartquantity();
        checkshipping();

    };


    //Check whether the delivery charge should be applied
    var checkshipping = function () {
        if ($scope.total < 500) {
            $scope.shipping = 35;
        } else {
            $scope.shipping = 0;
        }
    }


    //Decrease the quantity or reomve the item of the cart 
    $scope.removeCart = function (product) {

        var len = $scope.cart.length;
        for (var i = 0; i < len; i++) {
            if (product.name == $scope.cart[i].name) {

                //if product exists in the cart decrese the quantity
                if ($scope.cart[i].quantity > 1) {
                    $scope.cart[i].quantity -= 1;
                    $scope.total -= parseFloat(product.dprice);
                    $scope.totalSaving -= (parseFloat(product.price) - parseFloat(product.dprice));
                }
                //if product count is 1 then delete the object as well
                else if ($scope.cart[i].quantity > 0) {
                    $scope.cart[i].quantity -= 1;
                    delete $scope.cart[i];

                    //remove the empty object
                    $scope.cart = $scope.cart.filter(function (element) {
                        return element !== undefined;
                    });

                    $scope.total -= parseFloat(product.dprice);
                    $scope.totalSaving -= (parseFloat(product.price) - parseFloat(product.dprice));

                }


            }
        }
        console.log($scope.cart);

        $scope.fcartquantity();
        checkshipping();

    };

    $scope.fcartquantity = function () {
        $scope.cartQuantity = 0;
        var len = $scope.cart.length;
        for (var i = 1; i < len; i++) {
            $scope.cartQuantity += $scope.cart[i].quantity;
        }

    };

    //Register
    $scope.registerUser = function (register) {
        $scope.registerMessage = "";
        console.log(register);
        if (register) {
            if (register.firstname === undefined || register.lastname === undefined || register.email === undefined || register.telephone === undefined || register.password1 === undefined || register.password2 === undefined || register.address === undefined || register.city === undefined || register.postcode === undefined || register.firstname === "" || register.lastname === "" || register.email === "" || register.telephone === "" || register.password1 === "" || register.password2 === "" || register.address === "" || register.city === "" || register.postcode === "") {

                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: "All field are required"
                });


            } else if (register.password1 != register.password2) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: "Password did not match"
                });


            } else if (!validateEmail(register.email)) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: "Invalid mail format"
                });
            } else {
                $scope.show();
                $http.post('http://localhost/ionic1-opencart/api/register.php', register, config)
                    .success(function (response) {

                        $scope.hide();
                        var registerResponse = response;
                        if (registerResponse.status === "success") {
                            $scope.showAlert(registerResponse);
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Alert',
                                template: registerResponse.message
                            });
                        }
                        console.log(registerResponse);

                    });
            }
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: "All field are empty"
            });
        }

        $scope.showAlert = function (registerResponse) {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: registerResponse.message
            });

            alertPopup.then(function (res) {
                $location.path("app/home");
                $ionicSideMenuDelegate.toggleLeft();
                register.firstname = register.lastname = register.email = register.telephone = register.password1 = register.password2 = register.address = register.city = register.postcode = "";
            });
        };

    };


    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    //Login

    $scope.loginData.username = "";
    $scope.loginData.password = "";

    $scope.login = function (loginData) {
        console.log("logindata");

        console.log(loginData);
        if (loginData.username === "" && loginData.password === "") {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Empty field'
            });
        } else if (loginData.username === "") {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Username required'
            });
        } else if (loginData.password === "") {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Password required'
            });
        } else {
            $http.post('http://localhost/ionic1-opencart/api/login.php', loginData, config)
                .success(function (response) {
                    console.log(response);
                    $scope.session = response;
                    if ($scope.session[0].status == "success") {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Alert',
                            template: 'Login Successfull'
                        });


                        //$ionicNavBarDelegate.showBar(false);
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Alert',
                            template: 'Invalid email/password combination'
                        });
                    }
                    $scope.sessionToData();
                    console.log($scope.customerinfo);

                });
        }
    };


    $scope.logout = function () {
        $scope.session = [
            {
                status: "failed"
            }
    ];

        $scope.customerinfo = [];
        var alertPopup = $ionicPopup.alert({
            title: 'Alert',
            template: 'Logout Succussfully'
        });
    };

    //Side pannel login
    $scope.userlogin = function (loginData) {
        $scope.show();
        $scope.login(loginData);
        console.log("he he");
        if ($scope.session[0].status == "success") {
            $location.path("app/home");
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.hide();

    }

    //Check whether user is loggged in during checkout
    $scope.checkcheckoutlogin = function () {
        if ($scope.session[0].status == "success") {
            $location.path("app/addcoupon");
        } else {
            $location.path("app/checkoutlogin");
        }
        $scope.aftercoupon = $scope.total;
        $scope.couponmessage = "";
    };


    //If user is not logged in login appears after checkout
    $scope.checkoutlogin = function (loginData) {
        $scope.show();
        $scope.login(loginData);
        if ($scope.session[0].status == "success") {
            $location.path("app/addcoupon");
        }
        $scope.hide();
        console.log($scope.customerinfo);
    };



    $scope.sessionToData = function () {

        var session = $scope.session[1];
        $http.post('http://localhost/ionic1-opencart/api/session.php', session, config)
            .success(function (response) {

                //console.log($scope.customerinfo);
                $scope.customerinfo = response;


            });
    };

    $scope.customerinfoaddress = function () {
        $scope.show();
        var info = $scope.customerinfo;
        $http.post('http://localhost/ionic1-opencart/api/address.php', info, config)
            .success(function (response) {

                console.log(response);

                $scope.customeraddress = response;

                $location.path("app/checkoutaddress");

                $scope.hide();


            });
    };


    var couponapplied = false;
    $scope.addCoupon = function (coupon_code) {
        coupon = {
            coupon_code: coupon_code,
            customer_id: $scope.customerinfo.customer_id
        };
        $http.post('http://localhost/ionic1-opencart/api/coupon.php', coupon, config)
            .success(function (response) {

                if (!couponapplied) {
                    if (response.status === "success") {
                        if ($scope.aftercoupon >= response.total) {
                            couponapplied = true;
                            if (response.type === "F") {
                                $scope.aftercoupon = $scope.aftercoupon - response.discount;
                            } else if (response.type === "P") {
                                $scope.aftercoupon = $scope.aftercoupon - (response.discount / 100) * $scope.aftercoupon;
                            }
                            $scope.couponmessage = "Coupon Applied Succussfully";

                        } else {
                            $scope.couponmessage = "Minimum order for coupon is  \n Rs. " + parseInt(response.total);

                        }
                    } else {
                        $scope.couponmessage = "Invalid coupon";

                    }
                } else {
                    $scope.couponmessage = "Only one coupon can be applied at a time";
                }
                console.log(response);
                console.log($scope.aftercoupon);

                $scope.customeraddress = response;


            });
    }

    var address;
    //Place order
    $scope.selectedaddress = function (address) {
        if (!address) {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Please select address'
            });
        } else {
            var customerinfo = $scope.customerinfo;
            $scope.order = {};
            $scope.order.firstname = address.firstname;
            $scope.order.lastname = address.lastname;
            $scope.order.address_1 = address.address_1;
            $scope.order.address_2 = address.address_2;
            $scope.order.city = address.city;
            $scope.order.postcode = address.postcode;
            $scope.order.customer_id = customerinfo.customer_id;
            $scope.order.email = customerinfo.email;
            $scope.order.telephone = customerinfo.telephone;
            $scope.order.total = $scope.aftercoupon;
            $scope.order.shipping = $scope.shipping;
            //get current date and time
            $scope.order.date_added = (new Date((new Date((new Date(new Date())).toISOString())).getTime() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' '); 

            var cart = $scope.cart;
            cart[0] = undefined;
            cart = cart.filter(function (element) {
                return element !== undefined;
            });
            $scope.order.cart = cart;

            console.log($scope.order);
            $scope.address = address;

            //$location.path("app/orderplaced");
            $http.post('http://localhost:8081/opencart/api/placeorder.php', $scope.order, config)
                .success(function (response) {
                    console.log(response);
                    $location.path("app/orderplaced");
                });

            address = null;
            var totalamount = $scope.order.total + $scope.order.shipping;
            totalamount = "&#8377; ".totalamount;
            var smsdetails = {
                phone: customerinfo.telephone,
                total: totalamount
            };
            /* $http.post('http://localhost/ionic1-opencart/api/sms/sms-order.php', smsdetails, config)
                 .success(function (response) {
                     console.log(response);
                     $location.path("app/orderplaced");
                 });*/
        }

    };
    $scope.orderHistory = function () {
        $scope.show();
        var session = $scope.session[1];
        $http.post('http://localhost/ionic1-opencart/api/order-history.php', session, config)
            .success(function (response) {
                console.log(response);
                $scope.orderHistoryList = response;
                $scope.hide();


            });
    };

    $scope.orderHistoryDetails = function (item) {
        $scope.currentOrderHistory = item;
        $scope.show();
        $http.post('http://localhost/ionic1-opencart/api/order-history-details.php', item, config)
            .success(function (response) {
                console.log(response);
                $scope.orderHistoryDetailsContent = response;
                $scope.hide();
                $location.path("app/order_history_details");

            });
    };


    $scope.reinit = function () {
        $scope.order = {};
        $scope.cart = [{}];
        $scope.cartQuantity = 0;
        $scope.total = 0;
        $scope.totalSaving = 0;
        $scope.shipping = 0;
        $location.path("app/home");

    }

})

.controller('MyCtrl', function ($scope, $ionicHistory) {
    $scope.myGoBack = function () {
        $ionicHistory.goBack();
    };
});
