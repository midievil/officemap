<?php

    require_once('inc/ad.php');
    require_once("inc/db.php");

    class Authorization
    {
        public function IsAuthorized() {            
            return isset($_SESSION['is_logged_in']) 
                && $_SESSION['is_logged_in'] === true;
        }

        public function TryLogin($login, $password) {
            $ad = new ActiveDirectory();
            if($ad->TryLogin($login, $password))
            {
                $_SESSION['is_logged_in'] = true;

                $db = new EmployeeDB();
                $emp = $db->GetEmployeeByLoginPassword($login, $password);
                $_SESSION['user_id'] = $emp->Id;

                if(isset($_POST["remember"])) {
                    setcookie('remember', 'true');
                } else {
                    setcookie('remember', '', time()-3600);
                }

                return true;
            }

            return false;
        }

        public function Logout() {
            $_SESSION['user_id'] = null;
            $_SESSION['is_logged_in'] = false;
        }

        public function GetUserId(){
            return $_SESSION['user_id'];
        }

        public function CanEdit() {
            return isset($_SESSION['user_id']) && in_array($_SESSION['user_id'], array(14, 64, 92, 255));
        }
    }
?>