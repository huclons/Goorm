/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 * version: 3.0.0
 * This is the module example for YUI_DOCS
 * @module code-generator
 **/


/**
 * This is an goorm code generator.  
 * goorm starts with this code generator.
 * @class codeGenerator
 **/
org.goorm.core.codeGenerator = function () {

};

org.goorm.core.codeGenerator.prototype = {

	init: function () { 
		var self = this;
	},
	
	generate: function() {
		var self = this;
		
		var fileName = core.selectedFile.replace("../../project/"+core.currentProjectPath+"/", "");
		var newFileName = fileName.replace(".ui", ".xml");
				
		var postdata = {
			source: core.currentProjectPath + "/" + fileName,
			target: core.currentProjectPath + "/res/layout/" + newFileName
		};
		
		console.log("source: " + postdata.source);
		console.log("target: " + postdata.target);
		
		$.post("module/org.goorm.core.codeGenerator/codeGenerator.ui2xml.php", postdata, function (data) {			

							
			//self.generateByRule();
			
			core.mainLayout.projectExplorer.refresh();
		});
	},
	
	generateByRule: function() {
		var postdata = {
				source: core.currentProjectPath,
				target: core.currentProjectFile
			};
										
		$.post("module/org.goorm.core.codeGenerator/codeZenerator.php", postdata, function (data) {
//			var receivedData = eval("("+data+")");
//
//			if(receivedData.errCode==0) {
//			}
//			else {
//			}
		});
	}
		
};