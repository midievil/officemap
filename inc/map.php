<?php

    require_once('models.php');
    require_once('inc/db.php');

    $method = $_SERVER['REQUEST_METHOD'];    

    switch ($method){
        case 'GET':
            get();
            return;

        case 'POST':
            post();
            return;

        case 'DELETE':
            delete();
            return;
    }


    function get() {
        $db = new MapDB();

        $roomId = null;
        if(isset($_GET['roomid'])) {
            $roomId = $_GET['roomid'];
        }

        $employees = $db->GetAllEmployees();
        
        echo json_encode($employees);
    }

    function post()
    {
        global $canEdit;
        if(!$canEdit){
            echo 'unauthorized';
            return;
        }

        $db = new MapDB();
        $emp = $db->GetEmployee($_POST['employeeId']);
        if(empty($emp)){
            $db->AddEmployee($_POST['employeeId'], $_POST['ip'], $_POST['x'], $_POST['y'], $_POST['floor'], $_POST['room']);
        } else {
            $db->UpdateEmployee($_POST['employeeId'], $_POST['ip'], $_POST['x'], $_POST['y'], $_POST['floor'], $_POST['room']);
        }
        echo "ok";
    }

    function delete(){
        $id =  str_ireplace(BASE_URI.'map/', '', ($_SERVER[REQUEST_URI]));
        $db = new MapDB();
        $db->DeleteEmployeeFromMap($id);
        die;
    }

    
?>