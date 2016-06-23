"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAppCtrl", dashboardAppCtrl)

function dashboardAppCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GmailServices, Milestone) {
    console.log("dashboardAppCtrl loaded");
    console.log('This Narrative Id: ', $stateParams.applicationId);
    if ($stateParams.applicationId) {
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('Narrative: ', res.data);
            $scope.application = res.data.generalNarrativeData;
            $scope.applicationDetail = angular.copy(res.data.generalNarrativeData);
            $scope.mileStones = res.data.milestones;
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }

    $scope.stoneTypeTemplate = [{
        state: {
            title: "Response from recruiter",
            color: "23D38C",
            className: "responseIn"
        },
        titleSaved: "Response from recruiter"

    }, {
        state: {
            title: "Message I sent out",
            color: "52A2FF",
            className: "sendout"
        },
        titleSaved: "Message I sent out"
    }, {
        state: {
            title: "General Stone",
            color: "F6F6F6",
            className: "general"
        },
        titleSaved: "General Stone"

    }, {
        state: {
            title: "Interview arrangement",
            color: "FF5252",
            className: "interview"
        },
        titleSaved: "Interview arrangement"
    }]
    $scope.stoneWhereTemplate = [{
        state: "Phone",
        titleSaved: "Phone"
    }, {
        state: "Online",
        titleSaved: "Online"
    }, {
        state: "In-person",
        titleSaved: "In-person"
    }]
    $scope.dbStone = {};
    $scope.chooseStoneType = (stone) => {
        if ($scope.dbStone.state == stone.state) {
            return $scope.dbStone.stonetype = '';
            if ($scope.dbStone.title == stone.titleSaved) {
                $scope.dbStone.title = ''
            }
        }
        $scope.dbStone.stoneWhere = '';
        $scope.dbStone.state = stone.state;
        $scope.dbStone.title = stone.titleSaved;
        console.log('$scope.dbStone: ', $scope.dbStone);
    }
    $scope.chooseStoneWhere = (stone) => {
        if ($scope.dbStone.stoneWhere == stone.state) {
            return $scope.dbStone.stoneWhere = '';
            if ($scope.dbStone.title == stone.titleSaved) {
                $scope.dbStone.title = '';
            }
        }
        $scope.dbStone.stoneWhere = stone.state;
        $scope.dbStone.title = `Interview arrangement: ${stone.titleSaved}`;
        console.log('$scope.dbStone: ', $scope.dbStone);
        console.log('$scope.dbStone: ', $scope.dbStone.title);

    }

    $scope.stoneTypeActivated = (data) => {
        if ($scope.dbStone.state && $scope.dbStone.state.title == data) {
            return true
        }
        return false
    }
    $scope.stoneWhereActivated = (data) => {
        if ($scope.dbStone.stoneWhere == data) {
            return true
        }
        return false
    }

    $scope.dbStoneSubmitted = () => {
        console.log('dbStone: ', $scope.dbStone);
        let applicationId = $stateParams.applicationId
        Milestone.createOneMilestone($scope.dbStone, applicationId)
            .then(res => {
                console.log('response when milestone is saved', res.data.generalNarrativeData)
                $scope.mileStones = res.data.milestones;
                $scope.dbStone = null;
                $scope.openAddStoneForm = null;
            })
            .catch(err => {
                console.log('error while saving milestone', err);
            })
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

    $scope.applicationDetailUpdated = () => {
        console.log('applicationDetailUpdated: ', $scope.applicationDetail);
        Application.updateApplication($scope.applicationDetail, $stateParams.applicationId).then(res => {
            console.log('res: ', res.data);
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }


}
