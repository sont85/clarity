(function() {
  'use strict';
  var app = angular.module('clarity.controller.teacher', []);
  app.controller('TeacherCtrl', function($scope, TeacherService, ChartService, $location, $state) {
    socket.on('result', function(msg) {
      ChartService.chart(msg)
    });

    function bindSet() {
      TeacherService.allQuestions()
      .success(function(allQuestion) {
        console.log(allQuestion);
        $scope.allQuestion = allQuestion;
      }).catch(function(err) {
        console.log(err);
      });
    }
    bindSet();

    $scope.addSet = function() {
      TeacherService.addSet($scope.newSetName)
        .success(function(response) {
          bindSet();
          $scope.newSetName = '';
          $('#setModal').modal('hide');
        }).catch(function(err) {
          console.log(err);
        });
    };
    $scope.linkToList = function(set) {
      $location.url('/teacher/questionList/' + set._id);
    };
    $scope.deleteSet = function(set) {
      swal({
        title: 'Delete question set?',
        text: 'All questions within this set will be deleted!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: false
      }, function() {
        swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
        TeacherService.deleteSet(set);
        $state.reload();
      });

    };
  });
  app.controller('QuestionListCtrl', function($scope, TeacherService, $location, $stateParams, $state) {
  $scope.messages = []
    function bindCurrentSet() {
      TeacherService.getCurrentSet($stateParams.setId)
        .success(function(currentSet) {
          $scope.currentSet = currentSet;
          console.log(currentSet)
          //chat message
          $scope.sendMessage = function() {
            socket.emit('chat message', $scope.message, $scope.currentSet.teacherName, $scope.currentSet.createdBy);
            $scope.message = '';
          };
          socket.on('message', function(text, name) {
            $scope.$apply(function(){
              var message = {
                text: text,
                name: name
              };
              $scope.messages.unshift(message);
            });
          });
          //end of chat message

          socket.emit('join', currentSet.teachername, currentSet.createdBy);
        }).catch(function(err) {
          console.log(err);
        });
    }
    bindCurrentSet();
    socket.on('user in room', function(names, numberOfUser) {
      $scope.$apply(function() {
        $scope.userCount = numberOfUser;
      });
    });
    $scope.addQuestion = function() {
      TeacherService.addQuestion($scope.newQuestion)
        .success(function(response) {
          bindCurrentSet();
          $scope.newQuestion = '';
          $('#questionModal').modal('hide');
        }).catch(function(err) {
          console.log(err);
        });
    };
    $scope.startTest = function(question) {
      $('#container').empty();
      $('#container2').empty();
      var roomId = $scope.currentSet.createdBy;
      socket.emit('startTest', question, roomId);
    };
    $scope.linkToQuestion = function(question) {
      $location.url('teacher/' + $stateParams.setId + '/question/' + question._id);
    };
  });
  app.controller('QuestionCtrl', function(TeacherService, $scope, $location, $stateParams) {
    function bindQuestion() {
      TeacherService.currentQuestion($stateParams.questionId)
        .success(function(response) {
          $scope.currentQuestion = response;
        }).catch(function(err) {
          console.log(err);
        });
    }
    bindQuestion();

    $scope.deleteQuestion = function() {
      TeacherService.deleteQuestion($scope.currentQuestion);
      $location.url('teacher/questionList/' + $stateParams.setId);
    };
    $scope.editQuestion = function() {
      TeacherService.editQuestion($scope.editedQuestion)
        .success(function(response) {
          bindQuestion();
          $('#editQuestion').modal('hide');
          $scope.editedQuestion = '';
        }).catch(function(err) {
          console.log(err);
        });
    };
  });
  app.controller('MainCtrl', function($scope, StudentService) {
    StudentService.getUserInfo()
      .success(function(response) {
        $scope.user = response;
        console.log(response);
      }).catch(function(err) {
        console.error(err);
      });
    $scope.registerUser = function() {
      StudentService.registerUser($scope.type)
        .success(function(response) {
          swal({
            title: 'Successfully Registered',
            text: response.displayName + ' Added To System',
            type: 'success',
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Confirm'
          }, function() {
            location.href = 'http://localhost:3000/auth/google';
          });
        }).catch(function(err) {
          console.error(err);
        });
    };
  });
})();