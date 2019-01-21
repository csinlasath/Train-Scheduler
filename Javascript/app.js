$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCNoKmzakh3HwW-4DEe6sY0YqdL3HEBbEc",
    authDomain: "train-scheduler-51e30.firebaseapp.com",
    databaseURL: "https://train-scheduler-51e30.firebaseio.com",
    projectId: "train-scheduler-51e30",
    storageBucket: "train-scheduler-51e30.appspot.com",
    messagingSenderId: "57139755851"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  

  database.ref().on("child_added", function(snapshot) {
    var trainTimeConverted = moment(snapshot.val().trainStartTime, "hh:mm").subtract(1, "years");
    var differenceInTime = moment().diff(moment(trainTimeConverted), "minutes");
    var remainderTime = differenceInTime % snapshot.val().trainFrequency;
    var minutesUntilTrain = snapshot.val().trainFrequency - remainderTime;
    var trainTimeArrival = moment().add(minutesUntilTrain, "minutes").format("h:mm a");

    var newTrainRow = $("<tr>");
    newTrainRow.append("<td>" + snapshot.val().trainName + "</td>");
    newTrainRow.append("<td>" + snapshot.val().trainDestination + "</td>");
    newTrainRow.append("<td>" + snapshot.val().trainFrequency + "</td>");
    newTrainRow.append("<td>" + trainTimeArrival + "</td>");
    newTrainRow.append("<td>" + minutesUntilTrain + "</td>");
    $("#train-table-body").prepend(newTrainRow);
});

  $(document).on("click", "#submit-button", function(event) {
    event.preventDefault();

    var trainNameField = $("#train-name-field").val().trim();
    var destinationNameField = $("#destination-name-field").val().trim();
    var trainTimeField = $("#train-time-field").val().trim();
    var frequencyField = $("#frequency-field").val().trim();

    database.ref().push({
        trainName: trainNameField,
        trainDestination: destinationNameField,
        trainStartTime: trainTimeField,
        trainFrequency: frequencyField,
        trainAdded: firebase.database.ServerValue.TIMESTAMP
    });

    var trainTimeConverted = moment(trainTimeField, "hh:mm").subtract(1, "years");
    var differenceInTime = moment().diff(moment(trainTimeConverted), "minutes");
    var remainderTime = differenceInTime % frequencyField;
    var minutesUntilTrain = frequencyField - remainderTime;
    var trainTimeArrival = moment().add(minutesUntilTrain, "minutes").format("h:mm a");
    
    var newTrainRow = $("<tr>");
    newTrainRow.append("<td>" + snapshot.val().trainName + "</td>");
    newTrainRow.append("<td>" + snapshot.val().trainDestination + "</td>");
    newTrainRow.append("<td>" + snapshot.val().trainFrequency + "</td>");
    newTrainRow.append("<td>" + trainTimeArrival + "</td>");
    newTrainRow.append("<td>" + minutesUntilTrain + "</td>");
    $("#train-table-body").append(newTrainRow);
    
    $("#train-name-field").val("");
    $("#destination-name-field").val("");
    $("#train-time-field").val("");
    $("#frequency-field").val("");
  });
});