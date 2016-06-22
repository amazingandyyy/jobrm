"use strict";

angular
    .module("jobrmApp", ["ui.router", "auth0", "angular-storage", "angular-jwt"])
    .config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, $locationProvider, jwtInterceptorProvider) {
        ///Auth0 Shit
        authProvider.init({
            domain: 'durbina.auth0.com',
            clientID: 'USRhQhbNBhwGgJguSUHubkKjcAXY0zcX',
            loginState: 'login'
        });
        //Angular HTTP Interceptor function
        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('token');
        };
/*        //Called when login is successful
        authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
            console.log("Login Success");
            profilePromise.then(function(profile) {
                store.set('profile', profile);
                store.set('token', idToken);
            });
            $location.path('/');
        });*/
        //Called when login fails
        authProvider.on('loginFailure', function() {
            console.log("Error logging in");
            $location.path('/login');
        });
        //Push interceptor function to $httpProvider's interceptors
        $httpProvider.interceptors.push('jwtInterceptor');

        $stateProvider
            .state(dashboard)
            .state(application)
            .state(addApplication)
            .state(setting)

        $urlRouterProvider.otherwise("/dashboard");
    })
    .run(function($rootScope, auth, store, jwtHelper, $location) {
        $rootScope.$on('$locationChangeStart', function() {

            var token = store.get('token');
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {
                        //Re-authenticate user if token is valid
                        auth.authenticate(store.get('profile'), token);
                    }
                } else {
                    // Either show the login page or use the refresh token to get a new idToken
                    $location.path('/');
                }
            }
        });
    });


let dashboard = {
    name: 'dashboard',
    url: '/dashboard',
    views: {
        'map': {
            templateUrl: '/html/dashboard_summary.html',
            controller: 'dashboardCtrl'
        }
    }
};
let application = {
    name: 'application',
    url: '/app/:applicationId',
    views: {
        'map': {
            templateUrl: '/html/dashboard_map.html',
            controller: 'dashboardAppCtrl'
        },
        'details': {
            templateUrl: '/html/dashboard_details.html',
            controller: 'dashboardAppCtrl'
        }
    }
};
let addApplication = {
    name: 'addApplication',
    url: '/create',
    views: {
        'map': {
            templateUrl: '/html/dashboard_add.html',
            controller: 'dashboardCtrl'
        }
    }
};
let setting = {
    name: 'setting',
    url: '/setting',
    views: {
        'map': {
            templateUrl: '/html/setting.html',
            controller: 'settingCtrl'
        }
    }
};
