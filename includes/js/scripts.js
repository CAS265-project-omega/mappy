/**
 * Created by endof on 5/26/2016.
 */
$(function() {
    // initialize locations object
    var locations = [
        {
            origin: {},
            destination: {},
            arrivalTransit: {}
        }
    ];
    //// geoLocation functions
    var geoLocationFunctions = {
        checkScreenSize: function() {
            var windowWidth = $(window).width();
            console.log(windowWidth);

            // if user is on a mobile device get mobile location
            if (windowWidth <= 768) {
                console.log('small screen');
                geoLocationFunctions.getMobileLocation();
            } // end if
        }, // end checkScreenSize
        getMobileLocation: function() {
            // if navigator object is a available
            if (navigator.geolocation) {
                // first parameter = callback with single location object on success
                // second parameter = callback with single error object on error
                navigator.geolocation.getCurrentPosition(geoLocationFunctions.mobileOriginLocation, geoLocationFunctions.mobileLocationError);
            }
        }, // end getLocation
        // if the getLocation is successful
        mobileOriginLocation: function(currentLocation) {
            var originInput = $('#origin');
            var originStateInput = $('#originState');

            // location is the object returned from the getCurrentPosition() function
            console.log('latitude ' + currentLocation.coords.latitude);
            console.log('longitude ' + currentLocation.coords.longitude);
            // add location to object
            locations[0].origin.latitude = currentLocation.coords.latitude;
            locations[0].origin.longitude = currentLocation.coords.longitude;

            // add reminder text to origin input
            originInput.attr('value', 'Current Location');
            originStateInput.attr('value', 'Current State');

            // console.log(locations);
        }, // end originLocation()
        // errors switch if unsuccessful
        mobileLocationError: function(error) {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    // x.innerHTML = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    // x.innerHTML = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    // x.innerHTML = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    // x.innerHTML = "An unknown error occurred.";
                    break;
            } // end switch
        } // end locationError()
    };
    // initiate Mobile
    geoLocationFunctions.checkScreenSize();

    // if the user clicks on the useMyGeoLocation button
    var useMyGeoLocation = $('#useMyGeoLocation');
    useMyGeoLocation.on('click', function(evnt) {
        var originInput = $('#origin');
        var originStateInput = $('#originState');

        evnt.preventDefault();
        geoLocationFunctions.getMobileLocation();

        // add reminder text to origin input
        originInput.attr('value', 'Current Location');
        originStateInput.attr('value', 'Current State');
    });

    var sendLocationsObject = function(locations) {
        console.log(locations);
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour *24;
        var timer;

        $.ajax({
            url: 'includes/php/testAJAX.php',
            method: 'POST',
            data: { locationsObject: locations[0] },
            dataType: 'json',
            success: function(duration) {
                // This needs to build the DOM with countDown Ticker
                var buildTimer = {
                    initializeClock: function(timeToLeave) {
                        // console.log(timeToLeave + ' Time to Leave');
                        // console.log(Date.now() + ' Now');

                        var countdownToLeave = timeToLeave - Date.now();
                        // console.log('distance: ' + countdownToLeave);
                        if (countdownToLeave < 0) {
                            // handle expiry here..
                            clearInterval(timer); // stop the timer from continuing ..
                            alert('Expired'); // alert a message that the timer has expired..

                            return; // break out of the function so that we do not update the counters with negative values..
                        }

                        var hours = Math.floor((countdownToLeave % _day ) / _hour);
                        var minutes = Math.floor((countdownToLeave % _hour) / _minute);
                        var seconds = Math.floor((countdownToLeave % _minute) / _second);

                        // update the DOM
                        $('#countdownClockView .hours').text(hours);
                        $('#countdownClockView .minutes').text(minutes);
                        $('#countdownClockView .seconds').text(seconds);
                    }
                }; // end build timer object
                console.log(duration);
                // var deadline = new(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
                // console.log('Desired Arrival Time - duration');
                var desiredArrivalTime = locations[0].arrivalTransit.stringArrivalLocation;
                // console.log(desiredArrivalTime + ' Before Split');
                var time = desiredArrivalTime.split(":");
                var date = new Date();
                var desiredArrivalTimeInMilliseconds = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time[0], time[1], date.getUTCSeconds()).getTime();
                // console.log(desiredArrivalTimeInMilliseconds + ' desiredArrivalTimeInMilliseconds');
                var testDuration = 6000;
                var timeToLeave = Number(desiredArrivalTimeInMilliseconds - testDuration);
                // console.log(timeToLeave + ' Time to Leave outside Timer function');
                timer = setInterval(function() {
                    buildTimer.initializeClock(timeToLeave);
                }, 1);

            }, // end success
            error: function(error) {
                console.log('error');
                console.log(error);
            }
        }); // end ajax
    }; // end sendLocationsObject

    // get the values for the user's input
    var getInputValues = function(locations) {
        // get the input values form the user
        var originInput = $('#origin');
        var originStateInput = $('#originState');
        var destinationInput = $('#destination');
        var destinationStateInput = $('#destinationState');
        var arrivalInput = $('#arrival');
        var transitSelectInput = $('#transit');

        var originInputValue = originInput.val();
        var originStateInputValue = originStateInput.val();
        var destinationInputValue = destinationInput.val();
        var destinationStateInputValue = destinationStateInput.val();
        var arrivalInputValue = arrivalInput.val();
        var transitSelectInputValue = transitSelectInput.val();


        // Form validation
        var inputErrorsDiv = $('#formValidationErrors');
        if (originInputValue === '') {
            inputErrorsDiv.html('<h3>Please add a origin city and state.</h3>');

        } else if (destinationInputValue === '') {
            inputErrorsDiv.html('<h3>Please add a destination city and state.</h3>');

        } else if (arrivalInputValue === '') {
            inputErrorsDiv.html('<h3>Please add a desired arrival time.</h3>');

        } else if (transitSelectInputValue === 'Transit selection') {
            inputErrorsDiv.html('<h3>Please select a mode of transportation.</h3>');

        } else {
            inputErrorsDiv.html('<h3></h3>');
            // Not mobile device
            if ($.isEmptyObject(locations[0].origin)) {
                // add values to locations object for serialized
                locations[0].origin.stringOriginLocation = originInputValue;
                locations[0].origin.stringOriginState = originStateInputValue;

                locations[0].destination.stringDestinationLocation = destinationInputValue;
                locations[0].destination.stringDestinationState = destinationStateInputValue;

                locations[0].arrivalTransit.stringArrivalLocation = arrivalInputValue;
                locations[0].arrivalTransit.stringTransitLocation = transitSelectInputValue;
                // console.log(locations);
                sendLocationsObject(locations);
            } else {
                // if was on mobile device
                console.log('On mobile device');
                locations[0].destination.stringDestinationLocation = destinationInputValue;
                locations[0].destination.stringDestinationState = destinationStateInputValue;

                locations[0].arrivalTransit.stringArrivalLocation = arrivalInputValue;
                locations[0].arrivalTransit.stringTransitLocation = transitSelectInputValue;
                // console.log(locations);
                sendLocationsObject(locations);
            }
        } // end form validation
    }; // end getInputValues

    // For submission click events
    var submit = $('#submit');
    submit.on('click', function(evnt)  {
        evnt.preventDefault();
        console.log('Submit clicked');
        // form validation
        // if ()
        getInputValues(locations);
    }); // end submit button click
}); // end ready