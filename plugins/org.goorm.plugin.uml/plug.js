/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the GPL v2 License:
 * http://www.goorm.org/License
 **/

org.goorm.plugin.uml = function () {
	this.name = "uml";
	this.filetypes = "uml|ui";
	this.toolboxName = "";
	this.stencil_css = "org.goorm.stencil.uml/stencil.uml.css";
	this.window_manager = null;
	this.mainmenu = null;
};

org.goorm.plugin.uml.prototype = {
	init: function () {
	
		
		var self = this;
	
		this.window_manager = core.module.layout.workspace.window_manager;
		
		this.mainmenu = core.module.layout.mainmenu;
		
		/*
		$.ajax({
			type: "GET",
			dataType: "xml",
			async :false,
			url: "org.goorm.plugin.uml/config.xml",
			success: function(xml) {
				self.toolboxName = $(xml).find("toolbox").attr("name");

				self.add_toolbox();
			},
			error: function(xhr, status, error) {
			}
		});
		*/
		
		this.add_toolbox();
		
		//Loading CSS
		this.load_css();
		
		//Add Project Item
		this.add_project_item();
		
		//Add Toolbar
		this.add_toolbar();
		
		//Add Main Menu
		this.add_mainmenu();
		
		//Add Context Menu
		this.add_context_menu();
		
		console.log("uml designer...");
	},
	
	new_project : function(project_name, project_author, project_type, project_detailed_type, project_path) {
/*
		var postdata = {
	    		"project_name" : project_name,
	    		"project_author" : project_author,
	    		"project_type" : project_type,
	    		"project_detailed_type" : project_detailed_type,
	    		"project_path" : project_path
	    };
	    
		$.post("org.goorm.plugin.uml/new_project.php", postdata, function (data) {
			var receivedData = eval("("+data+")");
			
			if(receivedData.errCode==0) {
				core.mainLayout.projectExplorer.refresh();
			}
			else {
				alert.show(receivedData.errCode + " : " + receivedData.message);
			}
		});
*/
	},

	load_css: function () {
		$("head").append("<link>");
	    var css = $("head").children(":last");
	    css.attr({
	    	rel:  "stylesheet",
	    	type: "text/css",
	    	href: this.stencil_css
	    });
	},

	add_project_item: function () {

		$("div[id='project_new']").find(".project_types").append("<div class='project_wizard_first_button' project-type='umlp'><div class='project_type_icon'><img src='org.goorm.plugin.uml/images/uml.png' class='project_icon' /></div><div class='project_type_title'>UML Project</div><div class='project_type_description'>Unified Modeling Language Project</div></div>");
		
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all umlp' description='  Create New UML Project for Class Diagram' project_type='uml'><img src='org.goorm.plugin.uml/images/class_diagram.png' class='project_item_icon' /><br /><a>Class Diagram</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all umlp' description='  Create New UML Project for State Diagram' project_type='uml'><img src='org.goorm.plugin.uml/images/sequence_diagram.png' class='project_item_icon' /><br /><a>State Diagram</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all umlp' description='  Create New UML Project for Sequence Diagram' project_type='uml'><img src='org.goorm.plugin.uml/images/state_diagram.png' class='project_item_icon' /><br /><a>Sequence Diagram</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all umlp' description='  Create New UML Project for Component Diagram' project_type='uml'><img src='org.goorm.plugin.uml/images/state_diagram.png' class='project_item_icon' /><br /><a>Component Diagram</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all umlp' description='  Create New UML Project for Activity Diagram' project_type='uml'><img src='org.goorm.plugin.uml/images/state_diagram.png' class='project_item_icon' /><br /><a>Activity Diagram</a></div>");
		$("div[id='project_new']").find(".project_items").append("<div class='project_wizard_second_button all umlp' description='  Create New UML Project for UseCase Diagram' project_type='uml'><img src='org.goorm.plugin.uml/images/state_diagram.png' class='project_item_icon' /><br /><a>UseCase Diagram</a></div>");	
	
		$(".project_dialog_type").append("<option value='UML'>UML Project</option>");
		
		console.log("add_project_item...");
	},
	
	add_toolbar: function () {
		
	},
	
	add_mainmenu: function () {
		var self = this;
		
		$("ul[id='plugin_new_project']").append("<li class=\"yuimenuitem\"><a class=\"yuimenuitemlabel\" href=\"#\" action=\"new_file_uml\" localizationKey='file_new_uml_project'>UML Project</a></li>");
		this.mainmenu.render();
	},
	
	add_menu_action: function () {
		$("a[action=new_file_uml]").unbind("click");
		$("a[action=new_file_uml]").click(function () {
			core.dialognew_project.show();
			$(".project_wizard_first_button[project-type=uml]").trigger("click");
			$("#project_new").find(".project_types").scrollTop($(".project_wizard_first_button[project-type=uml]").position().top - 100);
		});	
	},

	add_new_other_filelist: function () {
		var val =	"<div id='selector_uml' value='umlClassDiagram' class='selectDiv' url='org.goorm.plugin.web/template/template.uml.uml' style='height:16px;'>" +
					"<div style='float:left; width:20px; height:16px;'>" +
					"<img src='config/image/icons/filetype/uml.filetype.png' />" + 
					"</div>" +
					"<div style='float:left; padding-top:2px; padding-left:2px;'>UML Class Diagram</div>" +
					"</div>" +
					"</div>";
		val 	+=	"<div id='selector_uml' value='umlStateDiagram' class='selectDiv' url='org.goorm.plugin.web/template/template.uml.uml' style='height:16px;'>" +
					"<div style='float:left; width:20px; height:16px;'>" +
					"<img src='config/image/icons/filetype/uml.filetype.png' />" + 
					"</div>" +
					"<div style='float:left; padding-top:2px; padding-left:2px;'>UML State Diagram</div>" +
					"</div>" +
					"</div>";
		val 	+=	"<div id='selector_uml' value='umlSequenceDiagram' class='selectDiv' url='org.goorm.plugin.web/template/template.uml.uml' style='height:16px;'>" +
					"<div style='float:left; width:20px; height:16px;'>" +
					"<img src='config/image/icons/filetype/uml.filetype.png' />" + 
					"</div>" +
					"<div style='float:left; padding-top:2px; padding-left:2px;'>UML Sequence Diagram</div>" +
					"</div>" +
					"</div>";
		val 	+=	"<div id='selector_uml' value='umlUsecaseDiagram' class='selectDiv' url='org.goorm.plugin.web/template/template.uml.uml' style='height:16px;'>" +
					"<div style='float:left; width:20px; height:16px;'>" +
					"<img src='config/image/icons/filetype/uml.filetype.png' />" + 
					"</div>" +
					"<div style='float:left; padding-top:2px; padding-left:2px;'>UML Usecase Diagram</div>" +
					"</div>" +
					"</div>";
					
					
		$("#newOtherFileList").append(val);			
	},
	
	add_context_menu: function () {
		
	},
	
	add_toolbox: function () {
		var self = this;

		$("#toolBoxSelectBoxDummy").append("<option value='"+self.name+"'>"+self.toolboxName+"</option>");
		
		$("#toolBox").append("<div id='uml_toolset' class='toolsets'><div id='toolUML_title' class='toolTitle'>UML Tool</div></div>");
		
		
		//Title : General		
		$("#uml_toolset").append("<div id='toolUML_general' class='toolCategory categoryIcon'>General</div>");
		
		//General Tool : Label
		$("#uml_toolset").append("<a href='#' action='addUMLGeneral_Label'><div id='toolUML_General_Label' class='toolItem itemIconSquare'>Label</div></a>");
		
		//General Tool : Note
		$("#uml_toolset").append("<a href='#' action='addUMLGeneral_Note'><div id='toolUML_General_Note' class='toolItem itemIconSquare'>Note</div></a>");
		
		//General Tool : Package
		$("#uml_toolset").append("<a href='#' action='addUMLGeneral_Package'><div id='toolUML_General_Package' class='toolItem itemIconSquare'>Package</div></a>");
		
		
		
		//Title : Class Diagram		
		$("#uml_toolset").append("<div id='toolUML_classDiagram' class='toolCategory categoryIcon'>Class Diagram</div>");
		
		//Class Diagram Tool : Class
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Class'><div id='toolUML_ClassDiagram_Class' class='toolItem itemIconSquare'>Class</div></a>");
		
		//Class Diagram Tool : Package
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Package'><div id='toolUML_ClassDiagram_Package' class='toolItem itemIconSquare'>Package</div></a>");
		
		//Class Diagram Tool : Association
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Association'><div id='toolUML_ClassDiagram_Association' class='toolItem itemIconLine'>Association</div></a>");
		
		//Class Diagram Tool : Inheritance
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Inheritance'><div id='toolUML_ClassDiagram_Inheritance' class='toolItem itemIconLine'>Inheritance</div></a>");
		
		//Class Diagram Tool : Aggregation
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Aggregation'><div id='toolUML_ClassDiagram_Aggregation' class='toolItem itemIconLine'>Aggregation</div></a>");
		
		//Class Diagram Tool : Composition
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Composition'><div id='toolUML_ClassDiagram_Composition' class='toolItem itemIconLine'>Composition</div></a>");
		
		//Class Diagram Tool : Interface
		$("#uml_toolset").append("<a href='#' action='addUMLClassDiagram_Interface'><div id='toolUML_ClassDiagram_Interface' class='toolItem itemIconLine'>Interface</div></a>");
		
		
		
		//Title : Component Diagram
		$("#uml_toolset").append("<div id='toolUML_componentDiagram' class='toolCategory categoryIcon'>Component Diagram</div>");
		
		//Component Diagram Tool : Component
		$("#uml_toolset").append("<a href='#' action='addUMLComponentDiagram_Component'><div id='toolUML_ComponentDiagram_Component' class='toolItem itemIconSquare'>Component</div></a>");
		
		//Component Diagram Tool : Node
		$("#uml_toolset").append("<a href='#' action='addUMLComponentDiagram_Node'><div id='toolUML_ComponentDiagram_Node' class='toolItem itemIconSquare'>Node</div></a>");
		
		//Component Diagram Tool : Artifact
		$("#uml_toolset").append("<a href='#' action='addUMLComponentDiagram_Artifact'><div id='toolUML_ComponentDiagram_Artifact' class='toolItem itemIconSquare'>Artifact</div></a>");
				
		
		
		//Title : State Diagram		
		$("#uml_toolset").append("<div id='toolUML_stateDiagram' class='toolCategory categoryIcon'>State Diagram</div>");
		
		//State Diagram Tool : State
		$("#uml_toolset").append("<a href='#' action='addUMLStateDiagram_State'><div id='toolUML_StateDiagram_State' class='toolItem itemIconSquare'>State</div></a>");
		
		//State Diagram Tool : Start
		$("#uml_toolset").append("<a href='#' action='addUMLStateDiagram_Start'><div id='toolUML_StateDiagram_Start' class='toolItem itemIconSquare'>Start</div></a>");
		
		//State Diagram Tool : End
		$("#uml_toolset").append("<a href='#' action='addUMLStateDiagram_End'><div id='toolUML_StateDiagram_End' class='toolItem itemIconSquare'>End</div></a>");
		
		//State Diagram Tool : Transition
		$("#uml_toolset").append("<a href='#' action='addUMLStateDiagram_Transition'><div id='toolUML_ClassDiagram_Interface' class='toolItem itemIconLine'>Transition</div></a>");
		
		
		
		//Title : Sequence Diagram		
		$("#uml_toolset").append("<div id='toolUML_sequenceDiagram' class='toolCategory categoryIcon'>Sequence Diagram</div>");
		
		//Sequence Diagram Tool : Timeline
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Timeline'><div id='toolUML_SequenceDiagram_Timeline' class='toolItem itemIconSquare'>Timeline</div></a>");
		
		//Sequence Diagram Tool : Actor
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Actor'><div id='toolUML_SequenceDiagram_Actor' class='toolItem itemIconSquare'>Actor</div></a>");
		
		//Sequence Diagram Tool : Sequence
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Sequence'><div id='toolUML_SequenceDiagram_Sequence' class='toolItem itemIconSquare'>Sequence</div></a>");
		
		//Sequence Diagram Tool : Initialize
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Initialize'><div id='toolUML_SequenceDiagram_Initialize' class='toolItem itemIconLine'>Initialize</div></a>");
		
		//Sequence Diagram Tool : Return
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Return'><div id='toolUML_SequenceDiagram_Return' class='toolItem itemIconLine'>Return</div></a>");
		
		//Sequence Diagram Tool : Asynchronous
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Asynchronous'><div id='toolUML_SequenceDiagram_Asynchronous' class='toolItem itemIconLine'>Asynchronous</div></a>");
		
		//Sequence Diagram Tool : Synchronous
		$("#uml_toolset").append("<a href='#' action='addUMLSequenceDiagram_Synchronous'><div id='toolUML_SequenceDiagram_Synchronous' class='toolItem itemIconLine'>Synchronous</div></a>");
		
		
		
		//Title : Activity Diagram		
		$("#uml_toolset").append("<div id='toolUML_activityDiagram' class='toolCategory categoryIcon'>Activity Diagram</div>");
		
		//Activity Diagram Tool : Start
		$("#uml_toolset").append("<a href='#' action='addUMLActivityDiagram_Start'><div id='toolUML_ActivityDiagram_Start' class='toolItem itemIconSquare'>Start</div></a>");
		
		//Activity Diagram Tool : End
		$("#uml_toolset").append("<a href='#' action='addUMLActivityDiagram_End'><div id='toolUML_ActivityDiagram_End' class='toolItem itemIconSquare'>End</div></a>");

		//Activity Diagram Tool : Activity
		$("#uml_toolset").append("<a href='#' action='addUMLActivityDiagram_Activity'><div id='toolUML_ActivityDiagram_End' class='toolItem itemIconSquare'>Activity</div></a>");
		
		//Activity Diagram Tool : Parallel_Vertical
		$("#uml_toolset").append("<a href='#' action='addUMLActivityDiagram_ParallelVertical'><div id='toolUML_ActivityDiagram_ParallelVertical' class='toolItem itemIconSquare'>Parallel(Vertical)</div></a>");
		
		//Activity Diagram Tool : Parallel_Horizontal
		$("#uml_toolset").append("<a href='#' action='addUMLActivityDiagram_ParallelHorizontal'><div id='toolUML_ActivityDiagram_ParallelHorizontal' class='toolItem itemIconSquare'>Parallel(Horizontal)</div></a>");
		
		//Activity Diagram Tool : ControlFlow
		$("#uml_toolset").append("<a href='#' action='addUMLActivityDiagram_ControlFlow'><div id='toolUML_ActivityDiagram_ControlFlow' class='toolItem itemIconLine'>ControlFlow</div></a>");
		
		
		
		//Title : Usecase Diagram		
		$("#uml_toolset").append("<div id='toolUML_usecaseDiagram' class='toolCategory categoryIcon'>Use Case Diagram</div>");
		
		//Usecsae Diagram Tool : Usecase
		$("#uml_toolset").append("<a href='#' action='addUMLUsecaseDiagram_Usecase'><div id='toolUML_UsecaseDiagram_Usecase' class='toolItem itemIconSquare'>Use case</div></a>");
		
		//Usecsae Diagram Tool : Usecase_round
		$("#uml_toolset").append("<a href='#' action='addUMLUsecaseDiagram_Usecase_round'><div id='toolUML_UsecaseDiagram_Usecase_round' class='toolItem itemIconSquare'>Use case(round)</div></a>");
		
		//Usecsae Diagram Tool : Extends
		$("#uml_toolset").append("<a href='#' action='addUMLUsecaseDiagram_Extends'><div id='toolUML_UsecaseDiagram_Extends' class='toolItem itemIconLine'>Extends</div></a>");
		
		//Usecsae Diagram Tool : Includes
		$("#uml_toolset").append("<a href='#' action='addUMLUsecaseDiagram_Includes'><div id='toolUML_UsecaseDiagram_Includes' class='toolItem itemIconLine'>Includes</div></a>");
		
		
		
		//Add Fuctions
		//Genral : Label
		$("a[action=addUMLGeneral_Label]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/general.label";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Genral : Note
		$("a[action=addUMLGeneral_Note]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/general.note";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Genral : Package
		$("a[action=addUMLGeneral_Package]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/general.package";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		
		
		//Class Diagram : Class
		$("a[action=addUMLClassDiagram_Class]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.class";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Class Diagram : Packabe
		$("a[action=addUMLClassDiagram_Package]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.package";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Class Diagram : Association
		$("a[action=addUMLClassDiagram_Association]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.association";
			//classdiagram.association
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Class Diagram : Inheritance
		$("a[action=addUMLClassDiagram_Inheritance]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.inheritance";
			//classdiagram.inheritance
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Class Diagram : Aggregation
		$("a[action=addUMLClassDiagram_Aggregation]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.aggregation";
			//classdiagram.aggregation
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Class Diagram : Composition
		$("a[action=addUMLClassDiagram_Composition]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.composition";
			//classdiagram.composition
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Class Diagram : Interface
		$("a[action=addUMLClassDiagram_Interface]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/classdiagram.interface";
			//classdiagram.interface
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter, {dashed:true});	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		
		
		//Component Diagram : Component
		$("a[action=addUMLComponentDiagram_Component]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/componentdiagram.component";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Component Diagram : Node
		$("a[action=addUMLComponentDiagram_Node]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/componentdiagram.node";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Component Diagram : Artifact
		$("a[action=addUMLComponentDiagram_Artifact]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/componentdiagram.artifact";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});		
			


		//State Diagram : State
		$("a[action=addUMLStateDiagram_State]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/statediagram.state";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//State Diagram : Start		
		$("a[action=addUMLStateDiagram_Start]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/statediagram.start";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//State Diagram : End
		$("a[action=addUMLStateDiagram_End]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/statediagram.end";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//State Diagram : Transition
		$("a[action=addUMLStateDiagram_Transition]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/statediagram.transition";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
	
		
		//Sequence Diagram : Timeline
		$("a[action=addUMLSequenceDiagram_Timeline]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.timeline";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Sequence Diagram : Actor
		$("a[action=addUMLSequenceDiagram_Actor]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.actor";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter, {proportion:[2,3]});	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Sequence Diagram : Actor
		$("a[action=addUMLSequenceDiagram_Sequence]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.sequence";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Sequence Diagram : Initialize
		$("a[action=addUMLSequenceDiagram_Initialize]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.initialize";
			//sequencediagram.initialize
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter, {dashed:true});	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Sequence Diagram : Return
		$("a[action=addUMLSequenceDiagram_Return]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.return";
			//sequencediagram.return
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter, {dashed:true});	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Sequence Diagram : Asynchronous
		$("a[action=addUMLSequenceDiagram_Asynchronous]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.asynchronous";
			//sequencediagram.asynchronous
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Sequence Diagram : Synchronous
		$("a[action=addUMLSequenceDiagram_Synchronous]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/sequencediagram.synchronous";
			//sequencediagram.synchronous
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		
		
		//Activity diagram : Start
		$("a[action=addUMLActivityDiagram_Start]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/activitydiagram.start";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//Activity diagram : End
		$("a[action=addUMLActivityDiagram_End]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/activitydiagram.end";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//Activity diagram : Activity
		$("a[action=addUMLActivityDiagram_Activity]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/activitydiagram.activity";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//Activity diagram : Parallel_Vertical
		$("a[action=addUMLActivityDiagram_ParallelVertical]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/activitydiagram.parallel_vertical";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//Activity diagram : Parallel_Horizontal
		$("a[action=addUMLActivityDiagram_ParallelHorizontal]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/activitydiagram.parallel_horizontal";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//Activity Diagram : ControlFlow
		$("a[action=addUMLActivityDiagram_ControlFlow]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/activitydiagram.controlflow";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Usecase Diagram : Usecase(box)
		$("a[action=addUMLUsecaseDiagram_Usecase]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/usecasediagram.usecase";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Usecase Diagram : Usecase(round)
		$("a[action=addUMLUsecaseDiagram_Usecase_round]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/usecasediagram.usecase_round";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("square", shapeAdapter);	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("square");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});
		
		//Usecase Diagram : Extends
		$("a[action=addUMLUsecaseDiagram_Extends]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/usecasediagram.extends";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter, {dashed:true});	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
		//Usecase Diagram : Includes
		$("a[action=addUMLUsecaseDiagram_Includes]").click(function () {
			var shapeAdapter = "org.goorm.stencil.uml/usecasediagram.includes";
			
			if (self.window_manager.window[self.window_manager.activeWindow].designer) {
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.add("line", shapeAdapter, {dashed:true});	
				self.window_manager.window[self.window_manager.activeWindow].designer.canvas.setDrawingMode("line");
			}
			else {
				m.er("Active window does not have a desginer!", "plugin: design.uml");
			}
		});	
		
	},
	
	refreshToolBox: function(){

		$("#uml_toolset").css("display", "block");
		$("#uml_toolset").children().each(function(){
			$(this).css("display","none");
		});
		
		$("#uml_toolset #toolUML_general").css("display","block")
			.next().css("display","block")
			.next().css("display","block")
			.next().css("display","block");
			
		switch (core.dialogProjectProperty.property['DETAILEDTYPE']){
			case "Class Diagram" :
				$("#uml_toolset #toolUML_classDiagram").css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block");
				break;
			case "State Diagram" :
				$("#uml_toolset #toolUML_stateDiagram").css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block");
				break; 
			case "Sequence Diagram" :
				$("#uml_toolset #toolUML_sequenceDiagram").css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block");
				break;
			case "Component Diagram" :
				$("#uml_toolset #toolUML_componentDiagram").css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block");
				break;
			case "Activity Diagram" :
				$("#uml_toolset #toolUML_activityDiagram").css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block");
				break; 
			case "UseCase Diagram" :
				$("#uml_toolset #toolUML_usecaseDiagram").css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block")
					.next().css("display","block");
				break;
		}
	}
};