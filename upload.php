<!DOCTYPE html>
<html>
<body>

<?php

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
date_default_timezone_set('Europe/London');

require_once dirname(__FILE__) . '/vendor/phpoffice/phpexcel/Classes/PHPExcel.php';
require_once dirname(__FILE__) . '/classes/exCell.php';

// UPload stuff

$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$fileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    //$check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    $check = true;
    if($check !== false) {
        //echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not a spreadsheet.";
        $uploadOk = 0;
    }
}
// Check if file already exists
// if (file_exists($target_file)) {
//     echo "Sorry, file already exists.";
//     $uploadOk = 0;
// }
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($fileType != "xlsx") {
    echo "Sorry, only XLSX files are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        //echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";

        process(basename( $_FILES["fileToUpload"]["name"]));

    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

function process($filename) {
    /** Parse spreadsheet into collection data */
    $calc = new ExCell();

    // Read a file
    $calc->readfile($filename);

    // Dump inputs and outputs
    //mprint($calc->data, "Data");
    // mprint($calc->count, "Count of cells");
    //mprint($calc->inputs(), "Inputs");
    //mprint($calc->outputs(), "Outputs");
    //mprint($calc->formulae(), "Formulae");
    mprint($calc->formulaeSorted(), "Formulae sorted");

    // Echo memory peak usage
    echo " Peak memory usage: " , (memory_get_peak_usage(true) / 1024 / 1024) , " MB" , EOL;
}
    
/**
 * Helper print function
 */
function mprint($val, $title) {
    if ($title) { echo $title . EOL; }
    echo "<pre>";
    print_r($val);
    echo "</pre>" . EOL . EOL;
}
?>

<p>
    <a href="index.php">Load another file</a>
</p>

</body>
</html>