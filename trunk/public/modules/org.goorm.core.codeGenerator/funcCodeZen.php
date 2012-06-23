<?php

function generateCode($xoz, $xmlRule, $targetId) {
	$generatedCode = "";
	
	$xoz_children = $xoz->children();

	$parent = $xoz['id'];

	for($i = 0; $i < count($xoz_children); $i++) {

		$header = getCode($xmlRule, $targetId, $xoz_children[$i]->getName(), "header");		
		$footer = getCode($xmlRule, $targetId, $xoz_children[$i]->getName(), "footer");
		
		$header = str_replace("#(parent)#", $parent, $header);
		$footer = str_replace("#(parent)#", $parent, $footer);
		
		$header = substr($header, 1, -1);
		$footer = substr($footer, 1, -1);
		
		foreach($xoz_children[$i]->attributes() as $attr => $value) {
			//$generatedCode .= "\t\t".$attr."=\"".$value."\" ";
			$header = str_replace("#(".$attr.")#", $value, $header);
			$footer = str_replace("#(".$attr.")#", $value, $footer);
			
			$header = str_replace("#BIG(".$attr.")#", strtoupper(substr($value, 0, 1)).substr($value, 1, strlen($value)-1), $header);
			$footer = str_replace("#BIG(".$attr.")#", strtoupper(substr($value, 0, 1)).substr($value, 1, strlen($value)-1), $footer);
			
			$header = str_replace("#IF(".$attr.":".$value.")ENDIF#", "true", $header);
			$footer = str_replace("#IF(".$attr.":".$value.")ENDIF#", "true", $footer);
			
			if(ereg("\#IF\(".$attr.":", $header)) {
				$temp = substr($header, strpos($header, "#IF(".$attr.":"), strpos($header, ")ENDIF#") - strpos($header, "#IF(".$attr.":") + 7);
				echo $temp;
				$header = str_replace($temp, "false", $header);
			}
			
			if(ereg("\#IF\(".$attr.":", $footer)) {
				$temp = substr($footer, strpos($footer, "#IF(".$attr.":"), strpos($footer, ")#") - strpos($footer, "#BIG(".$attr.":") + 7);
				echo $temp;
				$footer = str_replace($temp, "false", $footer);			
			}
		}	

		$generatedCode .= $header;
		
		if($xoz_children[$i]->getName() == "window" || $xoz_children[$i]->getName() == "view" || $xoz_children[$i]->getName() == "tab" || $xoz_children[$i]->getName() == "tabItem" || $xoz_children[$i]->getName() == "interaction") {
			$generatedCode .= generateCode($xoz_children[$i], $xmlRule, $targetId);
		}
		
		$generatedCode .= $footer;		
		
		//$generatedCode = arrangeCode($generatedCode, 1);		
	}
	
	return $generatedCode;
}

function getCode($xmlRule, $targetId, $from, $where) {
	$code = "";
	
	$countTarget = count($xmlRule->target);
	
	for($i = 0; $i < $countTarget; $i++) {
	
		if($xmlRule->target[$i]['id'] == $targetId) {
			$countMapping = count($xmlRule->target[$i]->mapping);

			for($j = 0; $j < $countMapping; $j++) {
				if($xmlRule->target[$i]->mapping[$j]['from'] == $from) {
					if($where == "header") {
						$code = $xmlRule->target[$i]->mapping[$j]->header;
					}
					else if($where == "footer") {
						$code = $xmlRule->target[$i]->mapping[$j]->footer;
					}
					else {
						echo "unknown parameter.";
					}
				}
			}
		}				
	}
	
	return $code;
}

function arrangeCode($code, $depth) {
		
	$tmp = explode("\n", $code); 
	$code = ""; 
	
	foreach ($tmp as $val) { 
		$code .= trim($val)."\n"; 
	}; 
	
	$tab = "";
	
	for($i = 0; $i < $depth; $i++) {
		$tab .= "\t";
	}
	
	$code = $tab.$code;
	$code = str_replace("\n", "", $code);
	$code = str_replace(";", ";\n".$tab, $code);
	$code = str_replace(">", ">\n".$tab, $code);
	
	return $code;
}

function getIDs($xoz) {
	$xoz_children = $xoz->children();

	$ids[0] = "";
	$k = 0;

	for($i = 0; $i < count($xoz_children); $i++) {
		if($xoz_children[$i]->getName() == "window" || $xoz_children[$i]->getName() == "view" || $xoz_children[$i]->getName() == "tab" || $xoz_children[$i]->getName() == "tabItem" || $xoz_children[$i]->getName() == "interaction") {
			foreach($xoz_children[$i]->attributes() as $attr => $value) {
				if($attr == "id") {
					$ids[$k] = $value;
				}
			}	
			
			$k++;
			
			$tempIds = getIDs($xoz_children);
			
			for($j = 0; $j < count($tempIds); $j++) {
				if($tempIds[$j] != "") {
					$ids[$k] = $tempIds[$j];
					$k++;
				}
			}
		}
	}
	
	return $ids;
}

function getChildById($xoz, $id) {
	$xozChild = $xoz->children();
	
	$countChild = count($xozChild);
	
	for($i = 0; $i < $countChild; $i++) {
		if($xozChild[$i]['id'] == $id) {
			return $xozChild[$i];		
		}
	}

	$xozChild = getChildById($xozChild, $id);	

	return $xozChild;
}

?>
