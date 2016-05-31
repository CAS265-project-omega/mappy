/**
 * Created by endof on 5/26/2016.
 */


$(function() {

    var currentLocation = {

    };
    //// geoLocation functions
    // check to see if the user is on a mobile device
    function checkScreenSize() {
        var windowWidth = $(window).width();
        console.log(windowWidth);

        // if user is on a mobile device get mobile location
        if (windowWidth <= 640) {
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
    function mobileOriginLocation(location) {
        // location is the object returned from the getCurrentPosition() function
        console.log('latitude ' + location.coords.latitude);
        console.log('longitude ' + location.coords.longitude);
        // add location to object
        currentLocation.latitude = location.coords.latitude;
        currentLocation.longitude = location.coords.longitude;
        console.log(currentLocation);
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


}); // end ready