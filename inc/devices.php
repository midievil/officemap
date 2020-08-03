<?php

    require_once('models.php');
    require_once('inc/db.php');

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method){
        case 'GET':
            get();
            return;
    }


    function get(){
        $db = new DeviceDB();
        $devices = $db->GetAllDevices();
        echo json_encode($devices);
    }

    
?>


