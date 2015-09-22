<?php
class CellComment
{
    public $type;
    public $name;
    public $dataType;
    public $rows;
    public $cols;

    function __construct($type = "", $name = "", $dataType = "s", $rows = 0, $cols = 0) {
        $this->type     = $type;
        $this->name     = $name;
        $this->dataType = $dataType;
        $this->rows     = $rows;
        $this->cols     = $cols;
    }
}

class ExCell
{
    public $data;

    function __construct($data = [])
    {
        $this->data = $data;
        $this->count = count($this->data);
        $this->namedRanges = [];
        $phpExcel = '';
        $this->sheets = [];
    }

    public function setCount() {
        $this->count = count($this->data);
    }

    public function readFile($filename) {
        /** Load the file */
        if (file_exists($filename)) {

            // Dependency on PHPExcel library
            $phpExcel = PHPExcel_IOFactory::load($filename);
            $sheetIndex = 0;

            foreach($phpExcel->getAllSheets() as $sheet) {
                // Update worksheets index
                $worksheet = $sheet->getTitle();
                array_push($this->sheets, ["index"=>$sheetIndex, "title"=>$worksheet]);

                // Get all comments in sheet into array
                $commentsArray = $sheet->getComments();

                // Walk through the non-empty cells in this sheet
                $cells = $sheet->getCellCollection();

                if (count($cells) > 0) {
                    foreach($cells as $cellRef) {
                        $cell = $sheet->getCell($cellRef);
                        $coord = $cell->getCoordinate();

                        //$r = $cell->getRow();
                        //$c = $cell->getColumn();
                        $s = $sheetIndex;
                        $r = $coord;
                        $v = ($cell->isFormula() == 1) ? "" : $cell->getValue();
                        $f = ($cell->isFormula() == 1) ? $cell->getValue() : "";
                        $t = $cell->getDataType();
                        $d = 0;    // Default depth

                        // Derive remaining fields from comment
                        $n = "";
                        $i = false;
                        $o = false;

                        if (isset($commentsArray[$coord])) {
                            $cellComment = $this->getCommentData($commentsArray[$coord]);
                            $n = $cellComment->name;
                            $i = ($cellComment->type == "input") ? true : false;
                            $o = ($cellComment->type == "output") ? true : false;
                        }

                        array_push($this->data, ["s"=>$s, "n"=>$n, "i"=>$i, "o"=>$o, "t"=>$t, "r"=>$r, "v"=>$v, "f"=>$f, "d"=>$d]);
                    }
                }
                $sheetIndex++;
            }

            // Update count
            $this->setCount();

            // Set named ranges object
            // NOTE: PHPExcel does not support split ranges
            foreach($phpExcel->getNamedRanges() as $name => $namedRange) {
                array_push($this->namedRanges, [
                    "name"=>$namedRange->getName(),
                    "range"=>$namedRange->getRange(),
                    "sheet"=>$namedRange->getWorksheet()->getTitle()
                ]);
            }

            // Set calculation depth on each cell
            $this->calculateDepths();

            /** Release the spreadsheet from memory */
            $phpExcel->disconnectWorksheets();
            unset($phpExcel);

            return $this;
        } else {
            exit("File" . $filename . " not found or cannot be opened." . EOL);
        }
    }

    /**
     * @param $text
     * @return CellComment
     */
    public function getCommentData($text) {
        $c = new CellComment();
        foreach(explode("\n", $text) as $commentPart) {
            $pair = explode(":", $commentPart);
            if($pair[1] != "") {            //TODO: ensure that $pair key 1 exists before this line
                switch (trim($pair[0])) {
                    case "type":
                        $c->type = trim($pair[1]);
                        break;
                    case "name":
                        $c->name = trim($pair[1]);
                        break;
                    case "dataType":
                        $c->dataType = trim($pair[1]);
                        break;
                    case "rows":
                        $c->rows = trim($pair[1]);
                        break;
                    case "cols":
                        $c->cols = trim($pair[1]);
                        break;
                }
            }
        }
        return $c;
    }

    /**
     * Return a filtered set of cells that are tagged as inputs
     * @return array
     */
    public function inputs()
    {
        $inputs = [];
        $iList = array_column($this->data, "i");
        for ($i = 0; $i < count($iList); $i++) {
            if ($iList[$i]) { array_push($inputs, $this->data[$i]); }
        }
        return $inputs;
    }

    public function outputs()
    {
        $outputs = [];
        $iList = array_column($this->data, "o");
        for ($i = 0; $i < count($iList); $i++) {
            if ($iList[$i]) { array_push($outputs, $this->data[$i]); }
        }
        return $outputs;
    }

    public function formulae()
    {
        $formulae = [];
        $iList = array_column($this->data, "t");
        for ($i = 0; $i < count($iList); $i++) {
            if ($iList[$i] == 'f') {
                array_push($formulae, $this->data[$i]);
            }
        }
        return $formulae;
    }

    // Return a list of formulae in order of depth (lowest first)
    // and filtered for those that affect output values
    public function formulaeSorted() {
        $sorted = $this->array_msort($this->formulae(), array('d'=>SORT_ASC));
        $list = [];

        // Remove any cells with depth = 0
        foreach($sorted as $key=>$cell) {
            if ($cell['d'] > 0) { array_push($list, $cell['f']); }
        }
        return $list;
    }

    /*======================================================================*\
    |  Private Methods                                                       |
    \*======================================================================*/
    // Set initial depth of each cell (number of levels of affecting cells)
    // no formula (inputs) = 0; has formula = -1 (recognisable as an uncalculated depth)
    private function calculateDepths() {
        foreach ($this->outputs() as $output) {
            if ($output['t'] == 'f') {
                $this->getDepth($output['r'], $output['s']);
            };
        }
    }

    private function setDepth($ref = NULL, $sheet = 0, $depth) {
        if ($ref != NULL) {
            $i = $this->getCellIndexByRef($ref, $sheet);            
            $this->data[$i]['d'] = $depth;          
        }
    }

    private function getDepth($ref = '', $sheet = 0) {
        $c = $this->getCellByRef($ref, $sheet);

        // Check that cell exists
        if ($c == NULL) { return NULL; }

        // Cell contains a formula
        if ($c['t'] != 'f') { return 0; }

        // Avoid unnecessary recalculation by reading existing depth > 0
        if ($c['d'] > 0) { return $c['d']; }

        // Calculate recursively for the first time
        $d = $this->dependencies($c['f'], $sheet);
        $depth = 0;
        $children = [];
        for ($i = 0; $i < count($d); $i++) {
            array_push($children, $this->getDepth($d[$i]['ref'], $d[$i]['sheet']));
        }

        $depth = 1 + max($children);
        $this->setDepth($ref, $sheet, $depth);
        return $depth;
    }

    private function getCellByRef($ref = '', $sheet = 0) {
        // Find all matches on cell reference
        $refCollection = $this->pluck('r', $this->data);
        $keys = $this->filter($refCollection, $ref);

        // Identify cell with matching reference AND sheet
        foreach ($keys as $key) {
            if ($this->data[$key]['s'] == $sheet) { return $this->data[$key]; }
        }
        return NULL;
    }

    private function getCellIndexByRef($ref = '', $sheet = 0) {
        // Find all matches on cell reference
        $refCollection = $this->pluck('r', $this->data);
        $keys = $this->filter($refCollection, $ref);

        // Identify cell with matching reference AND sheet
        foreach ($keys as $key) {
            if ($this->data[$key]['s'] == $sheet) { return $key; }
        }
        return NULL;
    }

    private function getFormulaByCellRef($ref = '', $sheet = 0) {
        $cell = $this->getCellByRef($ref);
        return ($cell == NULL) ? NULL : $cell['f'];
    }

    private function filter($array, $find) {
        $keys = [];
        foreach($array as $key=>$value) {
            if ($value == $find) { array_push($keys, $key); }
        }
        return $keys;
    }

    // Takes a range and returns an array of dependent cells ["sheet", "ref"]
    private function dependencies($formula = '', $sheet = 0) {
        // Parse out all Range tokens as dependencies
        $d = [];
        $parser = New PHPExcel_Calculation_FormulaParser($formula);
        $tokens = $parser->getTokens();
        foreach ($tokens as $token) {
            if ($token->getTokenSubType() == "Range") {
                $cells = $this->explodeRange($token->getValue(), $sheet);
                foreach ($cells as $cell) {
                    array_push($d, $cell);
                }
            }
        }
        return $d;
    }

    // Takes a range and returns an array of ["sheet", "ref"]
    private function explodeRange($range = '', $sheet = 0) {
        // Decode any named ranges
        $nr = $this->resolveName($range, $sheet);
        $range = $nr['range'];
        $sheet = $nr['sheet'];

        // Split out any sheet refs like Sheet1!A1:B2
        $r = explode("!", $range);
        if (count($r) == 2) {
            $range = $r[1];
            $sheet = $this->getSheetIndexByTitle($r[0]);
        }

        $cell = new PHPExcel_Cell(NULL, NULL, new PHPExcel_Worksheet());
        $result = $cell->extractAllCellReferencesInRange($range);

        // Add sheet ref back into each cell
        for($i = 0; $i < count($result); $i++) {
            $result[$i] = ["sheet"=>$sheet, "ref"=>$result[$i]];
        };
        return $result;
    }

    private function getSheetIndexByTitle($title) {
        foreach($this->sheets as $sheet) {
            if ($sheet['title'] == $title) { return $sheet['index'];}
        }
        return NULL;
    }

    private function resolveName($name = '', $sheet = 0) {
        foreach($this->namedRanges as $key=>$value) {
            if ($value['name'] == $name) {
                return ['sheet'=>$this->getSheetIndexByTitle($value['sheet']), 'range'=>$value['range']];
            }
        }
        // Default - send back what we got in
        return ['sheet'=>$sheet, 'range'=>$name];
    }
    
    private function pluck($key, $data) {
        return array_reduce($data, function($result, $array) use($key){
            isset($array[$key]) &&
            $result[] = $array[$key];

            return $result;
        }, array());
    }

    private function array_msort($array, $cols) {
        $colarr = array();
        foreach ($cols as $col => $order) {
            $colarr[$col] = array();
            foreach ($array as $k => $row) { $colarr[$col]['_'.$k] = strtolower($row[$col]); }
        }
        $eval = 'array_multisort(';
        foreach ($cols as $col => $order) {
            $eval .= '$colarr[\''.$col.'\'],'.$order.',';
        }
        $eval = substr($eval,0,-1).');';
        eval($eval);
        $ret = array();
        foreach ($colarr as $col => $arr) {
            foreach ($arr as $k => $v) {
                $k = substr($k,1);
                if (!isset($ret[$k])) $ret[$k] = $array[$k];
                $ret[$k][$col] = $array[$k][$col];
            }
        }
        return $ret;
    }
}
