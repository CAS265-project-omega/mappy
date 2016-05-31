/**
 * Created by endof on 5/26/2016.
 */


$(function() {

    var getGeoLocation = (function() {
        var currentLocation;

        var locations = {};

        location.setCurrentLocation = function() {

        };

        location.getCurrentLocation = function() {

        };

        return locations;
    }());

    //// geoLocation functions
    // check to see if the user is on a mobile device
    function checkScreenSize() {
        var windowWidth = $(window).width();
        console.log(windowWidth);

        // if user is on a mobile device get mobile location
        if (windowWidth <= 768) {
            console.log('small screen');
            getMobileLocation();
        } // end if
    } // end checkScreenSize
    checkScreenSize();

    // if user is on a mobile device get location of user
    function getMobileLocation() {
        // if navigator object is a available
        if (navigator.geolocation) {
            // first parameter = callback with single location object on success
            // second parameter = callback with single error object on error
            navigator.geolocation.getCurrentPosition(mobileOriginLocation, mobileLocationError);
        }
    } // end getLocation

    // if the getLocation is successful
    function mobileOriginLocation(currentLocation) {
        var originInput = $('#origin');

        // location is the object returned from the getCurrentPosition() function
        console.log('latitude ' + currentLocation.coords.latitude);
        console.log('longitude ' + currentLocation.coords.longitude);
        // add location to object
        locations[0].origin.latitude = currentLocation.coords.latitude;
        locations[0].origin.longitude = currentLocation.coords.longitude;

        // add reminder text to origin input
        originInput.attr('value', 'Current Location');
        console.log(locations);
        // return locations;

    } // end originLocation()

    // errors switch if unsuccessful
    function mobileLocationError(error) {
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

    function sendLocationsObject(locations) {
        console.log('Inside send Locations Object' + locations);
    }

    // For submission click events
    var submit = $('#submit');
    submit.on('click', function(evnt)  {
        console.log('Submit clicked');
        console.log(locations);
        sendLocationsObject(locations);
    }); // end submit button click
}); // end ready



