<?php
ini_set('display_errors', "on");
error_reporting(E_ALL);

$title = "Shipping calculator";


/************************************************************\
					Page head
\************************************************************/
echo "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n";
echo "<html>\n<head>\n";
echo "<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n";
echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n";
echo "<script type=\"text/javascript\" src=\"jquery.js\"></script>\n";
echo "<script type=\"text/javascript\" src=\"javascript.js\"></script>\n";
echo "<script type=\"text/javascript\" src=\"common.js\"></script>\n";
echo "<title>".$title."</title>\n";
echo "</head>\n";

/************************************************************\
					Page body
\************************************************************/
echo "<body>\n";
echo "<div class=\"tooltip\"></div>\n";

echo "<div class=\"mainContainer\">\n";

echo "<div class=\"title\">".$title."</div>\n";
echo "<div class=\"content\">";
echo "</div>\n";

echo "</div>\n";

echo "</body>\n";
echo "</html>\n";

/************************************************************\
					Functions
\************************************************************/

function convertSize($s) {
	$u = 0;
	$sizeUnits = Array('b', 'kb', 'mb', 'gb', 'tb', 'pb', 'yb');
	$fs = $s.$sizeUnits[$u];
	while($s / 1024 > 1) {
		$u++;
		$s = $s / 1024;
		$fs = round($s, $u-1)." ".$sizeUnits[$u];
	}
	return $fs;
}

function pre($arr) {
	echo "<pre>";
	var_dump($arr);
	echo "</pre>";
}

?>