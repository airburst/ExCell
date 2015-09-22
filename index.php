<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

date_default_timezone_set('Europe/London');

require_once dirname(__FILE__) . '/vendor/phpoffice/phpexcel/Classes/PHPExcel.php';
require_once dirname(__FILE__) . '/classes/exCell.php';

/** Parse spreadsheet into collection data */
$calc = new ExCell();

// Read a file
$calc->readfile("Eligibility-checker.xlsx");

// Dump inputs and outputs
//mprint($calc->data, "Data");
// mprint($calc->count, "Count of cells");
//mprint($calc->inputs(), "Inputs");
//mprint($calc->outputs(), "Outputs");
//mprint($calc->formulae(), "Formulae");
mprint($calc->formulaeSorted(), "Formulae sorted");


// Test parsing a formula
//mprint($calc->dependencies("=SUM(NEEDS)"), "Dependencies");
//mprint($calc->namedRanges, "Named Ranges");

// Echo memory peak usage
echo " Peak memory usage: " , (memory_get_peak_usage(true) / 1024 / 1024) , " MB" , EOL;

/**
 * Helper print function
 */
function mprint($val, $title) {
    if ($title) { echo $title . EOL; }
    echo "<pre>";
    print_r($val);
    echo "</pre>" . EOL . EOL;
}