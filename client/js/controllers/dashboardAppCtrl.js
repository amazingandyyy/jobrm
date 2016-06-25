"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAppCtrl", dashboardAppCtrl)

function dashboardAppCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GmailServices, Milestone, $window) {
    console.log("dashboardAppCtrl loaded");
    console.log('This Narrative Id: ', $stateParams.applicationId);
    if ($stateParams.applicationId) {
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('Narrative: ', res.data);
            $scope.application = res.data;
            $scope.applicationDetail = angular.copy(res.data);
            $scope.mileStones = res.data.milestones;
            console.log('$scope.mileStones', $scope.mileStones);
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
        let applicationId = $stateParams.applicationId;
        Milestone.createOneMilestone($scope.dbStone, applicationId, store.get("googleAPIAccess"))
            .then(res => {
                console.log('response when milestone is saved', res.data)
                $scope.mileStones = res.data.milestones;
                $scope.dbStone = null;
                $scope.openAddStoneForm = null;
                //$window.location.reload();

            })
            .catch(err => {
                console.log('error while saving milestone', err);
            })
    };
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
            console.log('applicationDetailUpdated res: ', res.data);
            $window.location.reload();

        }, err => {
            console.log('err when applicationDetailUpdated: ', err);
        })
    }
    $scope.deleteApplication = (applicantId) => {
        let applicationId = $stateParams.applicationId;
        console.log('delete: ', applicationId, applicantId);
        Application.deleteApplication(applicationId, applicantId).then(res => {
            console.log('application delete res: ', res.data);
        }, err => {
            console.log('err when application delete: ', err);
        })
    }
    $scope.openEditStoneTriggered = false;
    $scope.dbStoneUpdatedSetting = (stoneId) => {
        $scope.openEditStoneTriggered = !$scope.openEditStoneTriggered;
        Milestone.getOneMilestone(stoneId).then(res => {
            console.log('stone before setting: ', res.data);
            $scope.dbStoneUpdate = angular.copy(res.data);
            $scope.dbStoneUpdate._id = res.data._id;
            $scope.isTheOne = (stoneId) => {

                if(stoneId == res.data._id){
                    return true
                }else{
                    return false
                }
            }
        }, err => {
            console.log('err when getting one one stone: ', err);
        })

    }

    $scope.dbStoneUpdated = (dbStoneUpdate, stoneId) => {
        console.log('dbStoneUpdate: ',dbStoneUpdate);
        console.log('stoneId: ',stoneId);
        console.log('dbStoneUpdate triggerred');
        Milestone.updateMilestone(dbStoneUpdate,stoneId).then(res => {
            console.log('stone updated, res: ', res.data);
            $window.location.reload();
        }, err => {
            console.log('err when updating one stone: ', err);
        })
    }
    $scope.deleteMilestoneClicked = (milestoneId) => {
        let applicationId = $stateParams.applicationId;
        console.log('delete: ', applicationId, milestoneId);
        console.log('deleteMilestoneClicked triggerred');
        Milestone.deleteMilestone(applicationId, milestoneId).then(res => {
            console.log('stone delete, res: ', res.data);
            // $window.location.reload();

        }, err => {
            console.log('err when deleting one stone: ', err);
        })
    }


}
