<?php
require_once ("api.php");
$locations = $_POST["locationsObject"];
$origin = ($locations["origin"]["latitude"]) ?
    $locations["origin"]["latitude"] . "," .$locations["origin"]["longitude"]:
    $locations["origin"]["stringOriginLocation"] . "," . $locations["origin"]["stringOriginState"];

$destination = $locations["destination"]["stringDestinationLocation"] . $locations["destination"]["stringDestinationState"];

$mode = $locations["arrivalTransit"]["stringTransitLocation"];
$transit = "";
switch($mode){
    case "car":
        $transit = "driving";
        break;
    case "bus":
        $transit = "transit";
        break;
    default:
        print_r ("I don't know how to handle ".$mode);
        break;
}
$units = "imperial";
$arrivalTime = $locations["arrivalTransit"]["stringArrivalLocation"];

// $traffic = "pessimistic";
$getUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?";
$getUrl .= "origins=".$origin ."&";
$getUrl .= "destinations=".$destination."&";
$getUrl .= "mode=".$transit."&";
$getUrl .= "units=".$units."&";
$getUrl .= "arrival_time=".intval($arrivalTime)."&";
// $getUrl .= "traffic_model=".$traffic."&";
$getUrl .= "key=".$key;

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => str_replace(" ", "%20", $getUrl)
]);

$resp = curl_exec($curl);
curl_close($curl);

$response = json_decode($resp);

print_r($response->rows[0]->elements[0]->duration);