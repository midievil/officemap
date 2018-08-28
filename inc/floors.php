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
        $db = new FloorDB();
        $rooms = $db->GetAllFloors();
        echo json_encode($rooms);
    }

    
?>


