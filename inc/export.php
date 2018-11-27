<?php

    require_once('models.php');
    require_once('inc/db.php');

    exportCsv();

    function exportCsv() {
        $employeeDB = new EmployeeDB();
        $employees = $employeeDB->GetAllEmployees();

        $mapDB = new MapDB();
        $map = $mapDB->GetAllEmployees();

        $roomDB = new RoomDB();
        $rooms = $roomDB->GetAllRooms();

        //var_dump($employees);
        
        for($i=0; $i<count($map); $i++)
        {
            $mapRecord = $map[$i];
            $employee = findById($employees, $mapRecord->Id);
            $room = findById($rooms, $mapRecord->RoomId);
            
            if($employee->Name)
                echo "$employee->Name;$mapRecord->RoomName\n";
        }
    }

    function findById($array, $id) {
        for($i = 0; $i < count($array); $i++) {
            if($array[$i]->Id == $id)
                return $array[$i];
        }
        return null;
    }
?>