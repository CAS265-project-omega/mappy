/**
 * Created by endof on 5/26/2016.
 */


$(function() {

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

            // location is the object returned from the getCurrentPosition() function
            console.log('latitude ' + currentLocation.coords.latitude);
            console.log('longitude ' + currentLocation.coords.longitude);
            // add location to object
            locations[0].origin.latitude = currentLocation.coords.latitude;
            locations[0].origin.longitude = currentLocation.coords.longitude;

            // add reminder text to origin input
            originInput.attr('value', 'Current Location');
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

    var sendLocationsObject = function(locations) {
        // console.log(locations);
        $.ajax({
            url: 'includes/php/testAJAX.php',
            method: 'POST',
            data: { locationsObject: locations[0] },
            dataType: 'json',
            success: function(response) {
                // This needs to build the DOM with countDown Ticker
                var buildCountdownTicker = {
                    getRemainingTime: function(endTime) {
                        // var endTime = '2016-31-5T06:00';
                        var endTime = Number(1464701422815 + 701422815);
                        // var testingDate = Date.parse(endTime);
                        // var testingDate = new Date();
                        var mili = Date.now();
                        var arrivalTime = endTime - mili;

                        console.log(arrivalTime);
                        // console.log(mili);
                        // var newDate = new Date(endTime);
                        // var time = Date.parse(endtime) - Date.parse(new Date());
                        var time = arrivalTime;
                        var seconds = Math.floor((time / 1000) % 60);
                        var minutes = Math.floor((time / 1000 / 60) % 60);
                        var hours = Math.floor((time / 1000 * 60 * 60) % 24);
                        var days = Math.floor((time / 1000 * 60 * 60 * 24) % 24);

                        return {
                            'total': time,
                            'seconds': seconds,
                            'minutes': minutes,
                            'hours': hours,
                            'days': days
                        }
                    }, // getRemainingTime()
                    initializeClock: function(endTime) {
                        // endTime will be an object from response
                        // var endTime = 'May 05 2016 06:00:00 GMT+0200';
                        // need to get the time when user needs to leave and create date object
                        // console.log(endTime);
                        var clock = document.getElementById('countdownClockView');

                        function updateClock() {
                            // call get time remaining for the user to leave
                            var time = buildCountdownTicker.getRemainingTime(endTime);

                            clock.innerHTML = 'days: ' + time.days + '<br>' +
                                'hours: ' + time.hours + '<br>' +
                                'minutes: ' + time.minutes + '</br>' +
                                'seconds: ' + time.seconds + '</br>';

                            // stop the counter when time is up
                            if (time.total <= 0) {
                                clearInterval(timeInterval);
                            }
                        } // end updateClock()

                        // Start the clock up
                        updateClock();
                        // var timeInterval = setInterval(updateClock, 1000);

                        // Date.setHours(hour,min,sec,millisec)
                        // var setDate = new Date.setHours();

                    } // end initializeClock
                };
                console.log(response);
                // var deadline = new(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
                buildCountdownTicker.initializeClock();
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

        // if was on mobile device
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
            console.log('On mobile device');
            locations[0].destination.stringDestinationLocation = destinationInputValue;
            locations[0].destination.stringDestinationState = destinationStateInputValue;
            
            locations[0].arrivalTransit.stringArrivalLocation = arrivalInputValue;
            locations[0].arrivalTransit.stringTransitLocation = transitSelectInputValue;
            // console.log(locations);
            sendLocationsObject(locations);
        }
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