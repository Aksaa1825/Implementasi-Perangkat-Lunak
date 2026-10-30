<?php session_start(); header('Location: ' . (isset($_SESSION['u']) ? 'dashboard.php' : 'login.php'));
