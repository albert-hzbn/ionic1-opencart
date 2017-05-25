// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionicLazyLoad'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html'
            }
        }
    })

    .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                    templateUrl: 'templates/browse.html'
                }
            }
        })
        .state('app.playlists', {
            url: '/playlists',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlists.html',
                    controller: 'PlaylistsCtrl'
                }
            }
        })

    .state('app.single', {
            url: '/playlists/:playlistId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlist.html',
                    controller: 'PlaylistCtrl'
                }
            }
        })
        .state('app.products', {
            url: '/products',
            views: {
                'menuContent': {
                    templateUrl: 'templates/products.html'
                }
            }
        })
        .state('app.product', {
            url: '/product',
            views: {
                'menuContent': {
                    templateUrl: 'templates/product.html'
                }
            }
        })
        .state('app.cart', {
            url: '/cart',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cart.html'
                }
            }
        })
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html'
                }
            }
        })
        .state('app.register', {
            url: '/register',
            views: {
                'menuContent': {
                    templateUrl: 'templates/register.html'
                }
            }
        })

    .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html'
                }
            }
        })
        .state('app.checkoutlogin', {
            url: '/checkoutlogin',
            views: {
                'menuContent': {
                    templateUrl: 'templates/checkoutlogin.html'
                }
            }
        })
        .state('app.addcoupon', {
            url: '/addcoupon',
            views: {
                'menuContent': {
                    templateUrl: 'templates/addcoupon.html'
                }
            }
        })
        .state('app.checkoutaddress', {
            url: '/checkoutaddress',
            views: {
                'menuContent': {
                    templateUrl: 'templates/checkoutaddress.html'
                }
            }
        })
        .state('app.orderplaced', {
            url: '/orderplaced',
            views: {
                'menuContent': {
                    templateUrl: 'templates/orderplaced.html'
                }
            }
        })
        .state('app.terms_conditions', {
            url: '/terms_conditions',
            views: {
                'menuContent': {
                    templateUrl: 'templates/terms_conditions.html'
                }
            }
        })
        .state('app.faq', {
            url: '/faq',
            views: {
                'menuContent': {
                    templateUrl: 'templates/faq.html'
                }
            }
        })
        .state('app.about', {
            url: '/about',
            views: {
                'menuContent': {
                    templateUrl: 'templates/about.html'
                }
            }
        })
        .state('app.coupon_description', {
            url: '/coupon_description',
            views: {
                'menuContent': {
                    templateUrl: 'templates/coupon_description.html'
                }
            }
        })
        .state('app.order_history', {
            url: '/order_history',
            views: {
                'menuContent': {
                    templateUrl: 'templates/order_history.html'
                }
            }
        })
        .state('app.order_history_details', {
            url: '/order_history_details',
            views: {
                'menuContent': {
                    templateUrl: 'templates/order_history_details.html'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
