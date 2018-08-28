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
        $db = new RoomDB();
        $rooms = $db->GetAllRooms();
        echo json_encode($rooms);
    }

    
?>


