"use strict";

angular
    .module("jobrmApp", ["ui.router", "auth0", "angular-storage", "angular-jwt", 'nvd3', 'toaster', 'ngAnimate', "angular-loading-bar", "ui.bootstrap"])
    .directive('dateInput', function() {
        return {
            restrict: 'A',
            scope: {
                ngModel: '='
            },
            link: function(scope) {
                if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
            }
        }
    })
    .directive('focusMe', function($timeout) {
        return {
            link: function(scope, element, attrs) {
                scope.$watch(attrs.focusMe, function(value) {
                    if (value === true) {
                        element[0].focus();
                        $(element[0]).val('');
                        scope[attrs.focusMe] = false;
                    }
                });
            }
        };
    })

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider, $locationProvider, jwtInterceptorProvider) {
        ///Auth0 Shit
        authProvider.init({
            domain: 'durbina.auth0.com',
            clientID: 'USRhQhbNBhwGgJguSUHubkKjcAXY0zcX',
            loginState: 'login'
        });
        //Angular HTTP Interceptor function
        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('id_token');
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
    .run(function($rootScope, auth, store, jwtHelper, $location, GoogleCalendarServices, $state) {

        auth.hookEvents();

        //this should get triggered on refresh or url changes
        $rootScope.$on('$locationChangeStart', function () {
            let googleAccess = store.get("googleAPIAccess");
            if (googleAccess) {
                GoogleCalendarServices.verifyToken(googleAccess)
                    .then((response) => {
                        if (response.data.logout) {
                            store.remove("currentUserMId");
                            store.remove("id_token");
                            store.remove("googleAPIAccess");
                            $state.go('dashboard');
                        }
                    })
                    .catch((error) => {
                        console.log("Error: ", error);
                    });
            }

            let token = store.get('id_token');
            if (token) {
                if (jwtHelper.isTokenExpired(token)) {
                    auth.signout();
                    store.remove("profile");
                    store.remove("googleAPIAccess");
                    store.remove("currentUserMId");
                    store.remove("id_token");
                    $location.path("/");
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
