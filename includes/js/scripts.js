/**
 * Created by endof on 5/26/2016.
 */


$(function() {

    // check to see if the user is on a mobile device
    function checkScreenSize() {
        var windowWidth = $(window).width();
        console.log(windowWidth);

        if (windowWidth <= 640) {
            console.log('small screen');
            getMobileLocation();
        } // end if
    } // end checkScreenSize
    checkScreenSize();

    // if user is on a mobile device get location of user
    function getMobileLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(mobileOriginLocation, mobileLocationError);
        }
    } // end getLocation

    // if the getLocation is successful
    function mobileOriginLocation(location) {
        // location is the object returned from the getCurrentPosition() function
        console.log('latitude ' + location.coords.latitude);
        console.log('longitude ' + location.coords.longitude);
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