"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAppCtrl", dashboardAppCtrl)

function dashboardAppCtrl($stateParams, $scope, Application, GoogleCalendarServices, $timeout, $state, store, $location, GmailServices, Milestone, $window) {
    console.log("dashboardAppCtrl loaded");
    console.log('This Narrative Id: ', $stateParams.applicationId);
    if ($stateParams.applicationId) {
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('Narrative: ', res.data);
            $scope.application = res.data;
            if (res.data.length < 1) {
                $state.go('dashboard');
            } else {
                $scope.applicationDetail = angular.copy(res.data);
                let applicationDateDate = res.data.applicationDate.split("T")[0];
                let expectedInitialResponseDate = res.data.expectedInitialResponse.split("T")[0];
                $scope.applicationDetail.applicationDate = new Date(applicationDateDate);
                $scope.applicationDetail.expectedInitialResponse = new Date(expectedInitialResponseDate);
                $scope.mileStones = res.data.milestones;
                console.log('MileStones', $scope.mileStones);
                $scope.stoneDateTime = (date, time) => {
                    let timeDisplay = time.split("T")[1].split(':').slice(0, 2).join(':');;
                    let dateDisplay = moment(date).calendar(null, {
                        sameDay: 'MM/DD/YY',
                        nextDay: 'MM/DD/YY',
                        nextWeek: 'MM/DD/YY',
                        lastDay: 'MM/DD/YY',
                        lastWeek: 'MM/DD/YY',
                        sameElse: 'MM/DD/YY'
                    })
                    // console.log('timeDisplay: ', timeDisplay);
                    return `${timeDisplay}, ${dateDisplay}`;
                    // console.log();

                }
            }
        }, err => {
            console.log('err when getting all application and all milstones: ', err);
            $state.go('dashboard');
        })
    }

    $scope.stoneTypeTemplate = [{
        state: {
            title: "Response from recruiter",
            className: "responseIn"
        },
        titleSaved: "Response from recruiter"

    }, {
        state: {
            title: "Message I sent out",
            className: "sendout"
        },
        titleSaved: "Message I sent out"
    }, {
        state: {
            title: "General Stone",
            className: "general"
        },
        titleSaved: "General Stone"

    }, {
        state: {
            title: "Interview arrangement",
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
        if ($scope.dbStone.state) {
            if($scope.dbStone.state.title == data){
                return true
            }
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
        let toSend = angular.copy($scope.dbStone);
        console.log('toSend: ', toSend);
        console.log('toSend.date: ', toSend.date);
        toSend.date2 = moment(toSend.date).format("YYYY MM DD").replace(/\s/gi, "-");
        // console.log("To Send: ", toSend)
        // console.log("To Send time: ", toSend.time.toISOString().split("T")[1].split(':'))
        // console.log("To Send time: ", toSend.time)
        Milestone.createOneMilestone(toSend, applicationId, store.get("googleAPIAccess"))
            .then(res => {
                $scope.mileStones = res.data.dbSavedApplication.milestones;
                let newMilestone = res.data.newMilestone;
                // console.log("New Milestone: ", newMilestone);
                $scope.dbStone = null;
                $scope.openAddStoneForm = null;
                // console.log("Return Data:", res.data);
                // console.log("To send data prior to milestone creation: ", toSend);
                let newCalendarData = {
                    parentNarrativeId: res.data.dbSavedApplication._id,
                    milestoneId: newMilestone._id,
                    newEndDate: toSend.date2,
                    newStartDate: toSend.date2,
                    description: toSend.description,
                    title: toSend.title
                };
                GoogleCalendarServices.calendarNewEvent(store.get("googleAPIAccess"), store.get("currentUserMId"), newCalendarData)
                    .then((response) => {
                        console.log("Response after event creation: ", response.data);
                    })
                    .catch((error) => {
                        console.log("Error: ", error);
                    });
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
        }, err => {
            console.log('err when applicationDetailUpdated: ', err);
        })
    }
    $scope.deleteApplication = (applicantId) => {
        let applicationId = $stateParams.applicationId;
        console.log('delete: ', applicationId, applicantId);
        Application.deleteApplication(applicationId, applicantId).then(res => {
            console.log('application delete res: ', res.data);
            $state.go('dashboard');
        }, err => {
            console.log('err when application delete: ', err);
        })
    };
    $scope.openEditStoneTriggered = false;
    $scope.dbStoneUpdatedSetting = (stoneId) => {
        $scope.openEditStoneTriggered = !$scope.openEditStoneTriggered;
        Milestone.getOneMilestone(stoneId).then(res => {
            console.log('stone before setting: ', res.data);
            $scope.dbStoneUpdate = angular.copy(res.data);
            $scope.dbStoneUpdate._id = res.data._id;
            let accurateDate = moment(res.data.date);
            let accurateTime = moment(res.data.time).add(8, 'hours');
            console.log('accurateDate: ' ,accurateDate);
            $scope.dbStoneUpdate.date = new Date(accurateDate);
            $scope.dbStoneUpdate.time = new Date(accurateTime);

            $scope.isTheOne = (stoneId) => {

                if (stoneId == res.data._id) {
                    return true
                } else {
                    return false
                }
            }
        }, err => {
            console.log('err when getting one one stone: ', err);
        })

    }

    $scope.dbStoneUpdated = (dbStoneUpdate, stoneId) => {
        console.log('dbStoneUpdate: ', dbStoneUpdate);
        console.log('stoneId: ', stoneId);
        console.log('dbStoneUpdate triggerred');
        dbStoneUpdate.time = moment(dbStoneUpdate.time).subtract(8, 'hours');
        $timeout(function(){
            Milestone.updateMilestone(dbStoneUpdate, stoneId).then(res => {
                console.log('stone updated, res: ', res.data);
                // $window.location.reload();
                $state.go($state.current, {}, {
                    reload: true
                });
            }, err => {
                console.log('err when updating one stone: ', err);
            })
        },0)
    }
    $scope.deleteMilestoneClicked = (milestoneId) => {
        let applicationId = $stateParams.applicationId;
        console.log('delete: ', applicationId, milestoneId);
        console.log('deleteMilestoneClicked triggerred');
        Milestone.deleteMilestone(applicationId, milestoneId).then(res => {
            console.log('stone delete, res: ', res.data);
            // $window.location.reload();
            $state.go($state.current, {}, {
                reload: true
            });
            GoogleCalendarServices.deleteCalendaredEvent(store.get("currentUserMId"), milestoneId, store.get("googleAPIAccess"))
                .then((response) => {
                    console.log("Response: ", response);
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });

        }, err => {
            console.log('err when deleting one stone: ', err);
        })
    }


}
