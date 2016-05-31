<?php
/**
 * Created by PhpStorm.
 * User: endof
 * Date: 5/31/2016
 * Time: 3:15 AM
 */

header('Content-Type: application/json');


echo json_encode($_POST['locationsObject']);
//print_r();