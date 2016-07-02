"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAppCtrl", dashboardAppCtrl)

function dashboardAppCtrl($stateParams, $scope, Application, GoogleCalendarServices, $timeout, $state, store, $location, Milestone, $window, toaster) {
    console.log("dashboardAppCtrl loaded");
    // angular.element('.section').removeClass('hideRightSide');

    (function() {
        console.log("Current user to check: ", $scope.currentUser);
        if ($scope.currentUser && !store.get("id_token") && !store.get("googleAPIAccess") && !store.get("currentUserMId")) {
            $scope.currentUser = null;
            $state.go('dashboard');
            $window.location.reload();
            console.log("Current User after null: ", $scope.currentUser);
        }
    }());
    

    if ($stateParams.applicationId) {
        Application.getOneApplication($stateParams.applicationId).then(res => {
            $scope.application = res.data;
            if (res.data.length < 1) {
                $state.go('dashboard');
            } else {
                $scope.applicationDetail = angular.copy(res.data);
                    // let applicationDateDate = moment(res.data.applicationDate).format("YYYY-MM-DD");
                let applicationDateDate = res.data.applicationDate.split("T")[0];
                $scope.applicationDetail.applicationDate = new Date(applicationDateDate);
                $scope.mileStones = res.data.milestones;
                $scope.stoneDateTime = (date, time) => {
                    // console.log("Time: ", time);
                    let timeDisplay = time.split("T")[1].split(':').slice(0, 2).join(':');
                    let dateDisplay = moment(date).calendar(null, {
                        sameDay: 'MM/DD/YY',
                        nextDay: 'MM/DD/YY',
                        nextWeek: 'MM/DD/YY',
                        lastDay: 'MM/DD/YY',
                        lastWeek: 'MM/DD/YY',
                        sameElse: 'MM/DD/YY'
                    });
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
            title: "Culture-Fit Interview",
            className: "responseIn"
        },
        titleSaved: "Culture-Fit Interview"

    }, {
        state: {
            title: "Technical Interview",
            className: "sendout"
        },
        titleSaved: "Technical Interview"
    }, {
        state: {
            title: "General Interview",
            className: "general"
        },
        titleSaved: "General Interview"

    }, {
        state: {
            title: "Custom Milestone",
            className: "interview"
        },
        titleSaved: "Custom Milestone"
    }];

    $scope.stoneWhereTemplate = [{
        state: "Phone",
        titleSaved: "Phone"
    }, {
        state: "Online",
        titleSaved: "Online"
    }, {
        state: "In-person",
        titleSaved: "In-person"
    }];
    $scope.dbStone = {};
    $scope.dbStone.taskList = [];
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
    };
    $scope.chooseStoneWhere = (stone) => {
        if ($scope.dbStone.stoneWhere == stone.state) {
            return $scope.dbStone.stoneWhere = '';
            if ($scope.dbStone.title == stone.titleSaved) {
                $scope.dbStone.title = '';
            }
        }
        $scope.dbStone.stoneWhere = stone.state;
        $scope.dbStone.title = `Interview arrangement: ${stone.titleSaved}`;

    };
    $scope.stoneTypeActivated = (data) => {
        if ($scope.dbStone.state) {
            if ($scope.dbStone.state.title == data) {
                return true
            }
        }
        return false
    };
    $scope.stoneWhereActivated = (data) => {
        if ($scope.dbStone.stoneWhere == data) {
            return true
        }
        return false
    };
    $scope.addTask = (newTask) => {
        if (newTask) {
            $scope.dbStone.taskList.unshift({
                title: newTask.title,
                done: false
            });
            $scope.newTask = null;
        }
    };
    $scope.addTaskUpdate = (newTask) => {
        var isEmpty = angular.element('#updateNewTaskInput').val() == '';
        if (newTask && !isEmpty) {
            $scope.dbStoneUpdate.taskList.unshift({
                title: newTask.title,
                done: false
            });
            toaster.pop('warning', `Click Save Milstone to save new tasks.`, ``);
        }
    };

    $scope.taskDelete = (i, task) => {
        $scope.dbStone.taskList.splice(i, 1);
    };
    $scope.taskDeleteUpdate = (i, task) => {
        $scope.dbStoneUpdate.taskList.splice(i, 1);
        toaster.pop('warning', `Click Save Milstone to save updated task list.`, ``);
    };

    $scope.dbStoneSubmitted = () => {
        let applicationId = $stateParams.applicationId;
        let toSend = angular.copy($scope.dbStone);
        toSend.date2 = moment(toSend.date).format("YYYY MM DD").replace(/\s/gi, "-");
        Milestone.createOneMilestone(toSend, applicationId, store.get("googleAPIAccess"))
            .then(res => {
                $scope.mileStones = res.data.dbSavedApplication.milestones;
                let newMilestone = res.data.newMilestone;
                $scope.dbStone = null;
                $scope.openAddStoneForm = null;
                toaster.pop('success', `New Milestone created`, `You have ${$scope.mileStones.length} milstones in this narrative.`);
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

            })
            .catch(err => {
                console.log('error while saving milestone', err);
                toaster.pop('error', `There was an error saving the milestone`, `Try creating one again. If the problem persits, trying logging out and back in.`);
            })
    };
/*    if (store.get("googleAPIAccess")) {
        let googleAPIAccess = store.get("googleAPIAccess");
        // console.log('googleAPIAccess: ', googleAPIAccess);
        GmailServices.retrieveInboxList(googleAPIAccess)
            .then(function(res) {
                console.log('email lists: ', res);
                $scope.emailsFromGmail = res.data;
            })
    }*/

    $scope.applicationDetailUpdated = () => {
        Application.updateApplication($scope.applicationDetail, $stateParams.applicationId).then(res => {
            toaster.pop('success', `Application successfully updated!`, `Applied for ${res.data.position} of ${res.data.company}.`);
        }, err => {
            console.log('err when applicationDetailUpdated: ', err);
        })
    }
    $scope.deleteApplication = (applicantId) => {
        let applicationId = $stateParams.applicationId;
        Application.deleteApplication(applicationId, applicantId, store.get("googleAPIAccess")).then(res => {
            toaster.pop({
                type: 'error',
                title: 'Application removed!',
                onHideCallback: function() {
                    $window.location.reload();
                }
            });
        }, err => {
            console.log('err when application delete: ', err);
        })
    };
    $scope.openEditStoneTriggered = false;
    $scope.dbStoneUpdatedSetting = (stoneId) => {
        $scope.openEditStoneTriggered = !$scope.openEditStoneTriggered;
        Milestone.getOneMilestone(stoneId).then(res => {
            $scope.dbStoneUpdate = angular.copy(res.data);
            $scope.dbStoneUpdate._id = res.data._id;
            let accurateDate = moment(res.data.date);
            let accurateTime = moment(res.data.time).add(8, 'hours');
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
        dbStoneUpdate.time = moment(dbStoneUpdate.time).subtract(8, 'hours');
        $timeout(function() {
            Milestone.updateMilestone(dbStoneUpdate, stoneId).then(res => {
                $state.go($state.current, {}, {
                    reload: true
                });
                toaster.pop('success', `Milstone successfully updated!`, ``);
            }, err => {
                console.log('err when updating one stone: ', err);
            })
        }, 0)
    };
    $scope.deleteMilestoneClicked = (milestoneId) => {
        let applicationId = $stateParams.applicationId;
        toaster.pop({
            type: 'error',
            title: 'Milestone removed!'
        });
        Milestone.deleteMilestone(applicationId, milestoneId).then(res => {
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
