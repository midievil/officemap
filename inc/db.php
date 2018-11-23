<?php
    require_once('models.php');

    class BaseInnerDB {
        function __construct() {
            $this->connection = mysqli_connect(DB_HOST, DB_USER, DB_PASS);
            $this->db_selected = mysqli_select_db($this->connection, DB_NAME);
            mysqli_query($this->connection, "set names 'utf8'");
        }
        protected $connection = null;
        protected $db_selected = null;
    }
    class BaseExternalDB {
        function __construct() {
            $this->connection = mysqli_connect(EXT_DB_HOST, EXT_DB_USER, EXT_DB_PASS);
            $this->db_selected = mysqli_select_db($this->connection, EXT_DB_NAME);
            mysqli_query($this->connection, "set names 'utf8'");
        }
        protected $connection = null;
        protected $db_selected = null;
    }

    class FloorDB extends BaseInnerDB
    {
        public function GetAllFloors() {
            $result = mysqli_query($this->connection, "SELECT id, `name` FROM floors ORDER BY `order`");
            if($result) {
                $floors = array();
                while($row = mysqli_fetch_assoc($result)) {
                    $floor = new Floor($row);
                    $floors []= $floor;
                }
                return $floors;
            }

            return null;
        }
    }

    class RoomDB extends BaseInnerDB
    {
        public function GetAllRooms() {
            $result = mysqli_query($this->connection, "SELECT id, `name`, `description`, x1, y1, x2, y2, floor_id, room_type FROM rooms ORDER BY `name`");
            if($result) {
                $rooms = array();
                while($row = mysqli_fetch_assoc($result)) {
                    $room = new Room($row);
                    $rooms []= $room;
                }
                return $rooms;
            }

            return null;
        }
    }

    class MapDB extends BaseInnerDB
    {
        public function GetAllEmployees() {
            $result = mysqli_query($this->connection, "SELECT m.id, m.employee_id, m.ip, m.x, m.y, m.floor_id, m.room_id, IFNULL(r.name, '') as room_name
            FROM employees_map m
            LEFT JOIN rooms r on r.id = m.room_id");
            if($result) {
                $employees = array();
                while($row = mysqli_fetch_assoc($result)) {
                    $emp = new EmployeeMap($row);
                    $employees []= $emp;
                }
                return $employees;
            }

            return null;
        }

        public function GetEmployee($id) {
            $result = mysqli_query($this->connection,
				"SELECT id, employee_id, ip, x, y, floor_id, room_id FROM employees_map WHERE employee_id=$id");
            if($result && $row = mysqli_fetch_assoc($result)){
                $emp = new EmployeeMap($row);
                return $emp;
            }

            return null;
        }

        public function AddEmployee($id, $ip, $x, $y, $floorId, $roomId)
        {
            mysqli_query($this->connection, "INSERT INTO employees_map (employee_id, ip, x, y, floor_id, room_id) 
                VALUES ($id, '$ip', $x, $y, $floorId, $roomId);"
            );
            return mysqli_affected_rows($this->connection) > 0;                
        }

        public function UpdateEmployee($id, $ip, $x, $y, $floorId, $roomId)
        {
            mysqli_query($this->connection, "UPDATE  employees_map SET ip='$ip', x=$x, y=$y, floor_id=$floorId, room_id=$roomId
                WHERE   employee_id=$id;"
            );
            return mysqli_affected_rows($this->connection) > 0;
        }

        public function DeleteEmployeeFromMap($employeeId)
        {
            mysqli_query($this->connection, "DELETE FROM employees_map WHERE employee_id=$employeeId");
            return mysqli_affected_rows($this->connection) > 0;
        }
    }

    class EmployeeDB extends BaseExternalDB
    {
        public function GetAllEmployees() {

            $result = mysqli_query($this->connection,
			"
                SELECT  e.Id, e.LastName, e.FirstName, e.UserIp, e.IsProjectManager, e.KindOfActivityId, a.Path as Avatar, Skype
                FROM    employees e 
                LEFT JOIN avatars a ON a.EmployeeId = e.Id AND a.IsDeleted = 0
                WHERE   e.IsDismissed = 0 AND e.IsDeleted = 0 AND IsSwitchedOn = 1
                GROUP BY e.Id, e.LastName, e.FirstName, e.UserIp, e.IsProjectManager, e.KindOfActivityId
                ORDER BY e.LastName, e.FirstName");
            if($result) {
                $employees = array();
                while($row = mysqli_fetch_assoc($result)) {
                    $emp = new Employee($row);
                    $employees []= $emp;
                }
                return $employees;
            }

            return null;            
        }

        public function GetEmployeeByLoginPassword($login, $password) {
            $result = mysqli_query($this->connection, "
                SELECT  e.Id, e.LastName, e.FirstName, e.UserIp, e.IsProjectManager, e.KindOfActivityId, a.Path as Avatar, Skype
                FROM    employees e
                LEFT JOIN avatars a ON a.EmployeeId = e.Id AND a.IsDeleted = 0
                WHERE   (e.Login = '$login' OR e.Email='$login') AND TRUE");
            if($result) {
                if($row = mysqli_fetch_assoc($result)) {
                    $emp = new Employee($row);
                    return $emp;
                }                
            }

            return null;          
        }
    }
?>