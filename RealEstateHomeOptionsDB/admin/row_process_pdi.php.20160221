<?php

$not_include_javascript = 1;

include "main_include.phtml";


// Comment
// Possible action: get, getPDIType, Delete, Update
// Function getPDIType - JSON Input: PDICatID Return: A JSON list of PDIType according to the given PDICatID 
$find = array (
			"'\''",
			"'\"'",
			"'<'",
			"'>'"
			);
$replace = array (
			"&#039;",
			"&quot;",
			"&lt;",
			"&gt;"
			);


/**
 * Add new PDI Category by providing the cateogry name and category description 
 * @param unknown_type $PDICatID
 * @return new PDICatID after inserting to the database table; -1 if error
 */
function addNewPDICategory($PDICatName, $PDICatDescription = "") {
	global $db;
	
	$PDICatName 		= trim($PDICatName);
	$PDICatDescription 	= trim($PDICatDescription);
	
	if ($PDICatName == "")
		return -1;
	
	$sql = "INSERT INTO PDICategory (Name, Description) values (\"" . $PDICatName . "\", \"" . $PDICatDescription . "\");";
	$result = mysql_query($sql) or die("Error : $sql<br>" . mysql_error());
	//$numOfRecordsAffected = mysqli_affected_rows();
	$PDICatID = mysql_insert_id();
		
	return $PDICatID;
} // addNewPDICategory

/**
 * Add new PDI Type by providing the Type name and Type description and associated PDICatID
 * @param unknown_type $PDITypeID
 * @return new PDITypeID after inserting to the database table; -1 if error
 */
function addNewPDIType($PDITypeName, $PDICatID, $PDITypeDescription = "") {
	global $db;
	
	$PDITypeName 		= trim($PDITypeName);
	$PDITypeDescription = trim($PDITypeDescription);

	if ($PDITypeName == "")
		return -1;

	if ($PDICatID <= 0)
		return -1;
	
	$sql = "INSERT INTO PDIType (Name, PDICatID, Description) values (\"" . $PDITypeName . "\"," . $PDICatID . ", \"" . $PDITypeDescription . "\");";
	$result = mysql_query($sql) or die("Error : $sql<br>" . mysql_error());
	$PDITypeID = mysql_insert_id();

	return $PDITypeID;
} // addNewPDIType


if ($action == "get") {
	// display existing records in edittable fields
	$sql	= "SELECT PDIDefectID, DefectDesc, PDIDefect.SectionID SectionID, Section.name room, 
				PDIDefect.ContractorID ContractorID, Contractor.ContractorName trader, 
				QADefect, QAReportDate, QAFixed, QAFixedDate, PDIDefect, PDIReportDate, PDIFixed, PDIFixedDate, PDISignoff,
				day30Defect, day30ReportDate, day30Fixed, day30FixedDate, day30Signoff, 
				month11Defect, month11ReportDate, month11Fixed, month11FixedDate, month11Signoff,
				PDICatID, PDITypeID, TradeContacted
			FROM PDIDefect
			LEFT JOIN Section
			ON (PDIDefect.SectionID = Section.SectionID)
			LEFT JOIN Contractor
			ON (PDIDefect.ContractorID = Contractor.ContractorID)
			where PDIDefect.UnitNumber = $unit
			ORDER BY PDIDefectID";
	
	$result = mysql_query($sql,$db) or die("Error : $sql<br>" . mysql_error());
	
	$rtn_rows = array();
	
	while ($row = mysql_fetch_array($result)) {
		array_push($rtn_rows, $row);
	}
	
	echo json_encode($rtn_rows);
} elseif ($action == "getPDIType") {
	// display existing records in edittable fields
	$sql	= "SELECT * FROM PDIType where PDICatID=$PDICatID ORDER BY Name";
	
	$result = mysql_query($sql,$db) or die("Error : $sql<br>" . mysql_error());
	
	$rtn_rows = array();
//a	array_push($rtn_rows, "PDICatID=$PDICatID");
	
	while ($row = mysql_fetch_array($result)) {
		array_push($rtn_rows, $row);
	}
	
	echo json_encode($rtn_rows);
} elseif ($action == "getPDICategory") {
	// display existing records in edittable fields
	$sql	= "SELECT * FROM PDICategory ORDER BY Name";
	
	$result = mysql_query($sql,$db) or die("Error : $sql<br>" . mysql_error());
	
	$rtn_rows = array();
	//a	array_push($rtn_rows, "PDICatID=$PDICatID");
	
	while ($row = mysql_fetch_array($result)) {
		array_push($rtn_rows, $row);
	}
	
	echo json_encode($rtn_rows);	
} elseif ($action == "update") {
	// delete existing records for the unit
	$sql = "DELETE FROM PDIDefect WHERE UnitNumber = $unit";

	$result = mysql_query($sql) or die("Error : $sql<br>" . mysql_error());

	$rtn_rows = array();
	
	// handle "DefectDesc", replace special chars with chars can be saved in db
	for($i = 0; $i < 200; $i++)
	{
		// $DefectDesc_name = "DefectDesc_" . $i;
		// use the new combo box PDIType instead of the original DefectDesc text field
		$DefectDesc_name = "PDITypeID_" . $i;
	//print("DefectDesc_name $i" .  $$DefectDesc_name . "<BR>");	
		if (trim($$DefectDesc_name) <> "")
		{
			$SectionID_name 		= "SectionID_" . $i;
			$ContractorID_name 		= "ContractorID_" . $i;
			$QADefect_name 			= "QADefect_" . $i;
			$QAReportDate_name 		= "QAReportDate_" . $i;
			$QAFixed_name 			= "QAFixed_" . $i;
			$QAFixedDate_name 		= "QAFixedDate_" . $i;
			$PDIDefect_name 		= "PDIDefect_" . $i;
			$PDIFixed_name 			= "PDIFixed_" . $i;
			$PDIReportDate_name 	= "PDIReportDate_" . $i;
			$PDIFixedDate_name 		= "PDIFixedDate_" . $i;
			$PDISignoff_name 		= "PDISignoff_" . $i;
			$day30Defect_name 		= "day30Defect_" . $i;
			$day30ReportDate_name 	= "day30ReportDate_" . $i;
			$day30Fixed_name 		= "day30Fixed_" . $i;
			$day30FixedDate_name 	= "day30FixedDate_" . $i;
			$day30Signoff_name 		= "day30Signoff_" . $i;
			$month11Defect_name 	= "month11Defect_" . $i;
			$month11ReportDate_name = "month11ReportDate_" . $i;
			$month11Fixed_name 		= "month11Fixed_" . $i;
			$month11FixedDate_name 	= "month11FixedDate_" . $i;
			$month11Signoff_name 	= "month11Signoff_" . $i;
			$PDICatID_name			= "PDICatID_" . $i;
			$PDITypeID_name			= "PDITypeID_" . $i;
			$TradeContacted_name	= "TradeContacted_" . $i;
				

			$DefectDesc = preg_replace($find, $replace, $$DefectDesc_name);
			
			if ($$QADefect_name)	$QADefect = 1;
			else $QADefect = 0;
		
			if ($$QAFixed_name)	$QAFixed = 1;
			else $QAFixed = 0;

			if ($$PDIDefect_name)	$PDIDefect = 1;
			else $PDIDefect = 0;
		
			if ($$PDIFixed_name)	$PDIFixed = 1;
			else $PDIFixed = 0;
		
			if ($$PDISignoff_name)	$PDISignoff = 1;
			else $PDISignoff = 0;
		
			if ($$day30Defect_name)	$day30Defect = 1;
			else $day30Defect = 0;
		
			if ($$day30Fixed_name)	$day30Fixed = 1;
			else $day30Fixed = 0;

			if ($$day30Signoff_name)	$day30Signoff = 1;
			else $day30Signoff = 0;
		
			if ($$month11Defect_name)	$month11Defect = 1;
			else $month11Defect = 0;
		
			if ($$month11Fixed_name)	$month11Fixed = 1;
			else $month11Fixed = 0;

			if ($$month11Signoff_name)	$month11Signoff = 1;
			else $month11Signoff = 0;
			
			if ($$PDICatID_name)		$PDICatID = $$PDICatID_name;
			else $PDICatID = 0;
			
			if ($$PDITypeID_name)		$PDITypeID = $$PDITypeID_name;
			else $PDITypeID = 0;

			if ($$TradeContacted_name)		$TradeContacted = 1;
			else $TradeContacted = 0;
				
			
			// Create new PDIType
			// This is needed for eitehr a new PDIType is entered from the GUI, 
			// or a new Category is created with an existing PDIType. Since relationship
			// between PDIType and PDICategory is 1 to 1, so any existing PDIType with a NEW
			// PDICategory requires a new PDIType link to the new PDICategory
			$createNewPDIType = false;
			
			// if PDICatID is not a number, means it's a new Category ID added in the 
			// combo box. Call add new category function
			if (!is_numeric($PDICatID)) {
				$newPDICatID 		= 0;
				$newPDICatID 		= addNewPDICategory($PDICatID);
				$createNewPDIType 	= true;
				if ($newPDICatID <= 0) {
					// Error handling
					die("Error : Cannot create new PDICategory for \"" . $PDICatID . "\"");
					return;
				} else {
					$PDICatID 	= $newPDICatID;
				}				
			}
			
			// if PDITypeID is not a number, means it's a new Type ID added in the
			// combo box. Call add new category function
			if (!is_numeric($PDITypeID) || $createNewPDIType) {
				$newPDITypeID = 0;
				$newPDITypeID = addNewPDIType($PDITypeID, $PDICatID);
				if ($newPDITypeID <= 0) {
					// Error handling
					die("Error : Cannot create new PDI Type for \"" . $PDITypeID . "\"");
					return;
				} else {
					$PDITypeID 		= $newPDITypeID;
					// @TODO Allen to properly remove below DefectDesc
					$DefectDesc 	= $newPDITypeID; 
				}
			}			

			$sql = "INSERT INTO PDIDefect (UnitNumber, DefectDesc, SectionID, ContractorID, 
					QADefect, QAReportDate, QAFixed, QAFixedDate, PDIDefect, PDIReportDate, PDIFixed, PDIFixedDate, PDISignoff,
					day30Defect, day30ReportDate, day30Fixed, day30FixedDate, day30Signoff, 
					month11Defect, month11ReportDate, month11Fixed, month11FixedDate, month11Signoff,
					PDICatID, PDITypeID, TradeContacted)
					VALUES ('$unit', '$DefectDesc', '" . $$SectionID_name . "', '" . $$ContractorID_name . "', 
					$QADefect, '" . $$QAReportDate_name . "', $QAFixed, '" . $$QAFixedDate_name ."', 
					$PDIDefect,  '" . $$PDIReportDate_name . "', $PDIFixed, '" . $$PDIFixedDate_name ."', $PDISignoff,
					$day30Defect,  '" . $$day30ReportDate_name . "', $day30Fixed, '" . $$day30FixedDate_name ."', $day30Signoff, 
					$month11Defect,  '" . $$month11ReportDate_name . "', $month11Fixed, '" . $$month11FixedDate_name ."', $month11Signoff,
					$PDICatID, $PDITypeID, $TradeContacted)";

			$row = array();
			$row['status'] = "ERROR";
			$row['sql']		= $sql;
			//die("Error : $sql<br>" . mysql_error());
//			$result = mysql_query($sql) or die("Error : $sql<br>" . mysql_error());
			$result = mysql_query($sql);
			if (result) {
				$row['status'] = "SUCCESS";
			} else { 
				$row['status'] = "ERROR";
				$row['sql_error'] = $sql_error;
			}
			
			array_push($rtn_rows, $row);			
				
		}

		// @TODO ALLEN Need more time return proper error message 
		//echo json_encode($rtn_rows);
		
	}
} elseif ($action == "delete") {
	$sql = "DELETE FROM PDIDefect 
			WHERE PDIDefectID = $PDIDefectID";

	$result = mysql_query($sql) or die("SQL failed:\n" . mysql_error() . "\nFull SQL:\n" . $sql . $PHP_SELF);
}
?>
