<?php
ini_set('display_errors', "on");
error_reporting(E_ALL);

header('Content-type: text/html; charset=utf-8');

$result = Array('error' => false, 'errorMessage' => "", 'data' => null);
if(isset($_POST['action'])) {
	$action = $_POST['action'];
	switch($action) {
		case "mailBill":
			if(isset($_POST['email']) && isset($_POST['bill'])) {
				result(mail(
					$_POST['email'],
					"Your postage bill",
					$_POST['bill'],
					'From: donotreply@mayumi.fi'
				));
			}
			else {
				error("email or bill not set");
			}
			break;
		default:
			error("Invalid action");
			break;
	}
}
else {
	error("Action not set");
}

echo json_encode($result);

function result($val) {
	global $result;
	$result['data'] = $val;
}

function error($msg) {
	global $result;
	$result['error'] = true;
	$result['errorMessage'] = $msg;
}

?>