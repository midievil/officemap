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
                echo json_encode($employee);
            }
            else
            {
                echo "{ error: \"Wrong Id\" }";
            }
            
        }

        //$db = new EmployeeDB();

        //$employees = $db->GetAllEmployees();
        
        //echo json_encode($employees);
    }
?>