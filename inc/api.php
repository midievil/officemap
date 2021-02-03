<?php

    require_once('inc/db.php');

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method){
        case 'GET':
            get();
            return;
    }


    function get() {
        $queryParts = explode('/', $_SERVER['QUERY_STRING']);

        if($queryParts[1] == 'map'){
            
            $mapdb = new MapDB();
            $employee = $mapdb->GetEmployee($queryParts[2]);

            if(!empty($employee)){
                $floorDB = new FloorDB();
                $floor = $floorDB->GetById($employee->FloorId);
                $employee->FloorName = $floor->Name;

                $roomDB = new RoomDB();
                $room = $roomDB->GetById($employee->RoomId);
                $employee->RoomDescription = $room->Description;

                echo json_encode($employee);
            }
            else
            {
                echo "{ error: \"Wrong Id\" }";
            }
            
        }
        else if( count($queryParts) > 3 && $queryParts[1] == 'floors' && $queryParts[3] == 'rooms'){
            $db = new RoomDb();
            echo json_encode($db->GetByFloorId($queryParts[2])); 
        }
        else if($queryParts[1] == 'floors'){
            $db = new FloorDB();

            if(empty($queryParts[2])) 
                echo json_encode($db->GetAllFloors()); 
            else
                echo json_encode($db->GetById($queryParts[2])); 
        }
        else if($queryParts[1] == 'rooms'){
            $db = new RoomDB();

            if(empty($queryParts[2]))
                echo json_encode($db->GetAllRooms()); 
            else 
                echo json_encode($db->GetById($queryParts[2])); 
        }

        //$db = new EmployeeDB();

        //$employees = $db->GetAllEmployees();
        
        //echo json_encode($employees);
    }
?>