"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAppCtrl", dashboardAppCtrl)

function dashboardAppCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GmailServices) {
    console.log("dashboardAppCtrl loaded");
    console.log('This Narrative Id: ', $stateParams.applicationId);
    if ($stateParams.applicationId) {
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('Narrative: ', res.data);
            $scope.application = res.data.generalNarrativeData;
            $scope.applicationDetail = angular.copy(res.data.generalNarrativeData);
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }

    $scope.stoneTypeTemplate = [{
        display: "Response from recruiter",
        color: "",
        titlePassing: "Response from recruiter"

    }, {
        display: "Message I sent out",
        color: "",
        titlePassing: "Message I sent out"
    }, {
        display: "General Stone",
        color: "",
        titlePassing: "MileStone"

    }, {
        display: "Interview arrangement",
        color: "",
        titlePassing: "Interview arrangement"

    }]
    $scope.stoneWhereTemplate = [{
        display: "Phone",
        titlePassing: "Phone"
    },{
        display: "Online",
        titlePassing: "Online"
    }, {
        display: "In-person",
        titlePassing: "In-person"
    }]
    $scope.newStone = {};
    $scope.chooseStoneType = (stone) => {
        if ($scope.newStone.stonetype == stone.display) {
            return $scope.newStone.stonetype = '';
            if ($scope.newStone.title == stone.titlePassing) {
                $scope.newStone.title = ''
            }
        }
        $scope.newStone.stonetype = stone.display;
        $scope.newStone.title = stone.titlePassing;
    }
    $scope.chooseStoneWhere = (stone) => {
        if ($scope.newStone.stoneWhere == stone.display) {
            return $scope.newStone.stoneWhere = '';
            if ($scope.newStone.title == stone.titlePassing) {
                $scope.newStone.title = ''
            }
        }
        $scope.newStone.stoneWhere = stone.display;
        $scope.newStone.title = `Interview arrangement: ${stone.titlePassing}`;
    }

    $scope.stoneTypeActivated = (data) => {
        if ($scope.newStone.stonetype == data) {
            return true
        }
        return false
    }
    $scope.stoneWhereActivated = (data) => {
        if ($scope.newStone.stoneWhere == data) {
            return true
        }
        return false
    }

    $scope.newStoneSubmitted = () => {
        console.log('newStone: ', $scope.newStone);
    }
    if (store.get("googleAPIAccess")) {
        let googleAPIAccess = store.get("googleAPIAccess");
        // console.log('googleAPIAccess: ', googleAPIAccess);
        GmailServices.retrieveInboxList(googleAPIAccess)
            .then(function(res) {
                console.log('email lists: ', res);
                $scope.emailsFronGmail = res.data;
            })
    }


}
