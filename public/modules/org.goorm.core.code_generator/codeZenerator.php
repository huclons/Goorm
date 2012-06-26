<?php
include("funcCodeZen.php");

class codeZenerator {

	var $PROJECT_DIRECTORY;
	var $PATHXOZ;
	var $PATHTEMPLATE;
	var $PATHGENERATED;
	var $PATHRULE;
	
	var $xml_xozFile;
	var $xml_zenRuleFile;
	
	var $template;
	
	var $errCode;
	var $message;
	
	var $test;
	
	function codeZenerator() {
		if(isset($_POST['project_path'])){
			$this->PROJECT_DIRECTORY	= "../../project/".$_POST['project_path']."/";
	//		$this->PATHXOZ				= $this->PROJECT_DIRECTORY."objProperties.xoz";
			$this->PATHXOZ				= $this->PROJECT_DIRECTORY."main.xoz";
			$this->PATHRULE				= $this->PROJECT_DIRECTORY."rule/zen.rule";
			$this->PATHTEMPLATE			= $this->PROJECT_DIRECTORY."template/";
	//		$this->PATHGENERATED 		= $this->PROJECT_DIRECTORY."generated/";
			$this->PATHGENERATED 		= $this->PROJECT_DIRECTORY."res/layout/";
			
			$this->errCode = 0;
			$this->message = "";
			$this->test = "";
		}
	}
	
	
	function loadXOZ() {
		if (file_exists($this->PATHXOZ)) {
			$this->xml_xozFile = simplexml_load_file($this->PATHXOZ);
			return true;
		}
		else {
			//echo "Failed to open XOZ file! (".$this->PATHXOZ.")<br />";
		}
	}
	
	function loadRule() {
		if (file_exists($this->PATHRULE)) {
			$this->xml_zenRuleFile = simplexml_load_file($this->PATHRULE);
			return true;
		}
		else {
			//echo "Failed to open Zen Rule file! (".$this->PATHRULE.")<br />";
		}
	}
	
	function parsingRule() {
		$countTemplateFiles = count($this->xml_zenRuleFile->filelist->file);
				
		for($i = 0; $i < $countTemplateFiles; $i++) {
			foreach($this->xml_zenRuleFile->filelist->file[$i]->attributes() as $attr => $value) {
				if($attr == "from") {
					 $this->templateFILE[$i] = $value;
				}
				else if ($attr == "to"){
					$this->templateTo[$i] = $value;
				}
			}
		}
		
		$countRule = count($this->xml_zenRuleFile->rules->rule);
		
		for($i = 0; $i < $countRule; $i++) {
			
			$countRuleTarget = count($this->xml_zenRuleFile->rules->rule[$i]->target);
						
			for($j = 0; $j < $countRuleTarget; $j++) {
				foreach($this->xml_zenRuleFile->rules->rule[$i]->target[$j]->attributes() as $attr => $value) {
				}
			}
		}
		return true;
	}
	
	function loadTemplates() {
		for($i = 0; $i < count($this->templateFILE); $i++) {
			if (file_exists($this->PATHTEMPLATE.$this->templateFILE[$i])) {
				$this->template[$i] = implode("", file($this->PATHTEMPLATE.$this->templateFILE[$i]));
			}
			else {
			}
		}
		return true;
	}
	
	function codeGeneration() {
		$xoz_object = $this->xml_xozFile->objects;
		$xoz_elements = $xoz_object->children();
		$count = count($xoz_elements);
		
		for($i = 0; $i < count($this->templateFILE); $i++) {	
			$resultCode = $this->template[$i];
			
			for($j = 0; $j < count($this->xml_zenRuleFile->rules->rule[$i]->target); $j++) {
				if(ereg("\#\(", $this->xml_zenRuleFile->rules->rule[$i]->target[$j]['id']) && ereg("\)\#", $this->xml_zenRuleFile->rules->rule[$i]->target[$j]['id'])) {
					$id = getIDs($xoz_object);
		
					for($k = 0; $k < count($id); $k++) {
						$xozChild = getChildById($xoz_object, $id[$k]);
						
						$generatedCode = "\n".generateCode($xozChild, $this->xml_zenRuleFile->rules->rule[$i], $this->xml_zenRuleFile->rules->rule[$i]->target[$j]['id']);
		
						$anchor = str_replace("#(id)#", $id[$k], $this->xml_zenRuleFile->rules->rule[$i]->target[$j]['id']);
						
						$resultCode = str_replace("[{!".$anchor."!}]", $generatedCode, $resultCode);
					}
				}
				else {
					$generatedCode = "\n".generateCode($xoz_object, $this->xml_zenRuleFile->rules->rule[$i], $this->xml_zenRuleFile->rules->rule[$i]->target[$j]['id']);
					
					$resultCode = str_replace("[{!".$this->xml_zenRuleFile->rules->rule[$i]->target[$j]['id']."!}]", $generatedCode, $resultCode);
				}
			}
		
			$resultCodeDone[$i] = $resultCode;

/*
			$PREFIX = str_replace(".xoz", "", $this->PATHXOZ);
			$PREFIX = explode("/", $PREFIX);
			$PREFIX = $PREFIX[count($PREFIX)-1];
*/
			//$FILENAME = str_replace(".template", "", $this->templateFILE[$i]);
			$FILENAME = $this->templateTo[$i];
			
/*
			$fp = fopen($this->PATHGENERATED.$PREFIX.".".$FILENAME, "w");
*/
			$fp = fopen($this->PATHGENERATED.$FILENAME, "w");
			$this->test .= ($this->PATHGENERATED.$FILENAME."//");
			fwrite($fp, $resultCodeDone[$i]);
			fclose($fp);
			
			
/*�닿� 異�����履쎌���
			echo $FILENAME."\n\n";
			echo $resultCode."\n\n\n";
*/
		}
		return true;
	}
	
	function runCodeZen() {
		if (!$this->loadXOZ()) {
			$this->errCode = 1;
			$this->message = "Fail on loadXOZ()";
		}
		else {
			if (!$this->loadRule()) {
				$this->errCode = 2;
				$this->message = "Fail on loadRule()";
			}
			else {
				if (!$this->parsingRule()) {
					$this->errCode = 3;
					$this->message = "Fail on parsingRule()";
				}
				else {
					if (!$this->loadTemplates()) {
						$this->errCode = 4;
						$this->message = "Fail on loadTemplates()";
					}
					else {
						if (!$this->codeGeneration()) {
							$this->errCode = 5;
							$this->message = "Fail on codeGeneration()";
						}
						else {
							$this->errCode = 0;
							$this->message = "Done.";
						}
					}
				}
			}
		}
	}
	
	function getErrCode() {
		return $this->errCode;
	}
	
	function getMessage() {
		return $this->message;
	}
	
	function getTest() {
		return $this->test;
	}
}


$oCodeZenerator = new codeZenerator;
$oCodeZenerator->runCodeZen();

echo '{"message":"'.$oCodeZenerator->getMessage().'", "errCode":"'.$oCodeZenerator->getErrCode().'", "test":"'.$oCodeZenerator->getTest().'"}';

?>
