<?php
    require_once('inc/enums.php');

    class Floor {
        function __construct($row) {
            $this->Id = $row['id'];
            $this->Name = $row['name'];
            $this->Img = $this->Id.'.png';
        }

        public $Id;
        public $Name;
        public $Img;
    }

    class Room {
        function __construct($row) {
            $this->Id = $row['id'];
            $this->Name = $row['name'];
            $this->Description = $row['description'];
            $this->FloorId = $row['floor_id'];
            $this->X1 = $row['x1'];            
            $this->Y1 = $row['y1'];
            $this->X2 = $row['x2'];
            $this->Y2 = $row['y2'];
            $this->RoomType = Enums::$RoomTypes[$row['room_type']];
            $this->EmployeesCount = $row['employees_count'];
        }

        public $Id;
        public $Name;
        public $Description;
        public $FloorId;
        public $X1;
        public $Y1;
        public $X2;
        public $Y2;
        public $RoomType;
        public $EmployeesCount;
    }

    class EmployeeMap
    {
        function __construct($row) {
            $this->Id = $row['employee_id'];
            $this->IP = $row['ip'];
            $this->X = $row['x'];
            $this->Y = $row['y'];
            $this->RoomX = $row['room_x'];
            $this->RoomY = $row['room_y'];
            $this->FloorId = $row['floor_id'];
            $this->RoomId = $row['room_id'];
            $this->RoomName = $row['room_name'];
        }

        public $Id;
        public $IP;
        public $X;
        public $Y;
        public $RoomId;
        public $RoomName;
        public $RoomDescription;
        public $FloorId;
        public $FloorName;
    }

    class Employee
    {
        function __construct($row) {
            $this->Id = $row['Id'];
            $this->Name = $row['LastName'] . ' ' . $row['FirstName'];
            $this->Ip = $row['UserIp'];
            $this->Avatar = $row['Avatar'];
            $this->IsProjectManager = $row['IsProjectManager'];
            $this->IsAdmin = $row['IsAdmin'];
            $this->KindOfActivityId = $row['KindOfActivityId'];
            $this->Skype = $row['Skype'];
            $this->Login = $row['Login'];
        }

        public $Id;
        public $Name;
        public $Ip;
        public $Avatar;
        public $IsProjectManager;
        public $KindOfActivityId;
        public $Skype;
        public $Login;
        public $IsAdmin;
    }

    class Device
    {
        function __construct($row) {
            $this->Id = $row['id'];
            $this->Name = $row['name'];
            $this->Description = $row['description'];
            $this->X = $row['x'];
            $this->Y = $row['y'];
            $this->FloorId = $row['floor_id'];
            $this->RoomId = $row['room_id'];
            $this->RoomName = $row['room_name'];
            $this->FloorName = $row['floor_name'];
            $this->Type = $row['type'];
        }

        public $Id;
        public $Name;
        public $Description;
        public $X;
        public $Y;
        public $RoomId;
        public $RoomName;
        public $FloorId;
        public $FloorName;
        public $Type;
    }
?>