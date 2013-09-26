/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, notice: false */
/*jshint unused: false */



org.goorm.core.project._import = {
	dialog: null,
	buttons: null,
	project_detailed_type_list : [],
	target_zip_file : null,

	init: function () {

		var self = this;

		var handle_ok = function (panel) {
			//check start
			//input_import_project_author
			// input_import_project_author_name
			// select_import_project_type
			// input_import_project_name
			// input_import_project_desc
			// project_import_file
			if($("#input_import_project_author").val()===""){

				alert.show(core.module.localization.msg.alert_project_author);
				return false;
			}else if($("#input_import_project_author_name").val()===""){
				alert.show(core.module.localization.msg.alert_project_author);
				return false;
			}else if($("#select_import_project_type").val()===""){
				alert.show(core.module.localization.msg.alert_project_detailed_type);
				return false;
			}else if($("#input_import_project_name").val()===""){
				alert.show(core.module.localization.msg.alert_project_name);
				return false;
			}else if($("#input_import_project_desc").val()===""){
				alert.show(core.module.localization.msg.alert_project_desc);
				return false;
			}else if(!self.target_zip_file || (self.target_zip_file.type!=='application/x-zip-compressed'  && self.target_zip_file.type!=='application/zip') ){
				alert.show(core.module.localization.msg.alert_only_zip_allowed);
				return false;
			}else if (!/^[\w가-힣 0-9a-zA-Z._-]*$/.test($("#input_import_project_author").val())) {
				alert.show(core.module.localization.msg.alert_allow_character);
				return false;
			} else if (!/^[\w-_]*$/.test($("#input_import_project_name").val())) {
				alert.show(core.module.localization.msg.alert_allow_character);
				return false;
			}
			//check end


			
			for(var i=0;i<self.project_detailed_type_list.length;i++){
				if( $("#select_import_project_type").val() === self.project_detailed_type_list[i].project_detailed_type ){
					$("#select_import_project_type").attr("plugin_name", self.project_detailed_type_list[i].plugin_name  );		
					$("#select_import_project_type").attr("project_detailed_type", self.project_detailed_type_list[i].project_detailed_type  );		
					$("#select_import_project_type").attr("project_type", self.project_detailed_type_list[i].project_type  );		
					break;
				}
			}

			var use_collaboration = $("#check_use_collaboration").attr("checked");
			if (use_collaboration === undefined || use_collaboration == "undefined") {
				use_collaboration = "not checked";
			}



			var plugin_name = $("#select_import_project_type").attr("plugin_name");
			//org.goorm.plugins.dart.....
			var plugin = {};
			core.preference.plugins[plugin_name] && (plugin[plugin_name] = core.preference.plugins[plugin_name]);



			var project_desc = $("#input_import_project_desc").val();
			project_desc = project_desc.replace(/&(lt|gt);/g, function (strMatch, p1) {
				return (p1 == "lt") ? "<" : ">";
			});
			project_desc = project_desc.replace(/<\/?[^>]+(>|$)/g, "");






			var senddata = {
				project_type: $("#select_import_project_type").attr("project_type"),
				//
				project_detailed_type: $("#select_import_project_type").attr("project_detailed_type"),

				project_author: $("#input_import_project_author").val(),
				project_author_name: $("#input_import_project_author_name").val(),
				project_name: $("#input_import_project_name").val(),
				project_desc: project_desc,
				use_collaboration: use_collaboration,
				plugins: plugin,
			};


			$.get("project/new", senddata, function (data) {
				if (data.err_code === 0) {

					

					core.status.current_project_path = data.project_author + "_" + data.project_name;
					core.status.current_project_name = data.project_name;
					core.status.current_project_type = data.project_type;
					core.dialog.open_project.open(data.project_author + "_" + data.project_name, data.project_name, data.project_type);

					//core.module.plugin_manager.new_project(senddata,false);
					$("#project_import_location").val(core.status.current_project_path);
					
					//$('#project_import_form').submit();
					{


						var formData = new FormData($("#project_import_form"));

						//for (var i = 0; i < files.length; i++) {
						if(!self.target_zip_file){
							//empty zip
							return false;
						}

						formData.append('file', self.target_zip_file);
						formData.append('project_import_location', core.status.current_project_path);
						// now post a new XHR request
						var xhr = new XMLHttpRequest();
						xhr.open('POST', '/project/import');
						xhr.onloadstart = function(){
							core.module.loading_bar.start("Import processing...");
						};
						xhr.onerror = function () {
							core.module.loading_bar.stop();
							alert.show('Import error');
						};

						xhr.onloadend = function () {
							core.module.loading_bar.stop();
							console.log(xhr);

							if (xhr.status === 200) {
								console.log('all done: ' + xhr.status);
						  	} else {
						  		alert.show('Import Fail');
								console.log('Something went terribly wrong...');
						  	}

						  	setTimeout(function(){
						  		core.module.layout.project_explorer.refresh();
						  	},500);

						};

						xhr.send(formData);

					}








					core.module.layout.terminal.resize_terminal();	
					$(core).trigger('project_is_created');
					
				} else {
					alert.show(data.message);
					return false;
				}

				self.dialog.panel.hide();
			});


			if (typeof(this.hide) !== 'function' && panel) {
				panel.hide();
			}
			else{
				this.hide();
			}
		};

		var handle_cancel = function () {
			this.hide();
		};

		this.buttons = [{
			id: "g_project_import_btn_ok",
			text: "<span localization_key='ok'>OK</span>",
			handler: handle_ok,
			isDefault: true
		}, {
			id: "g_project_import_btn_cancel",
			text: "<span localization_key='cancel'>Cancel</span>",
			handler: handle_cancel
		}];

		this.dialog = org.goorm.core.project._import.dialog;
		this.dialog.init({
			localization_key: "title_import_project",
			title: "Import Project",
			path: "configs/dialogs/org.goorm.core.project/project._import.html",
			width: 800,
			height: 500,
			modal: true,
			opacity: true,
			buttons: this.buttons,
			kind: "import",
			success: function () {
				

				// var form_options = {
				// 	target: "#project_import_upload_output",

				// 	beforeSubmit : function(){

				// 		core.module.loading_bar.start("Import processing...");
				// 	},

				// 	success: function (data) {
				// 		self.dialog.panel.hide();
				// 		core.module.loading_bar.stop();
				// 		if (data.err_code === 0) {
				// 			notice.show(data.message);
				// 			core.module.layout.project_explorer.refresh();
				// 		} else {
				// 			alert.show(data.message);
				// 		}
				// 	},

				// 	error : function(){
				// 		core.module.loading_bar.stop();
				// 	}
				// };

				// $('#project_import_form').ajaxForm(form_options);
				
				var doc = document.getElementById('import_project_field');
				doc.ondragover = function () { this.className = 'hover'; return false; };
				doc.ondragend = function () { this.className = ''; return false; };
				doc.ondrop = function (event) {
					event.preventDefault && event.preventDefault();
					this.className = '';

					// now do something with:
					var files = event.dataTransfer.files;
					console.log(files);
					//only one zip file
					
					if(files.length!==1){
						alert.show('only one zip file');
						return false;
					}else if(files[0].type!=='application/x-zip-compressed' && files[0].type!=='application/zip'){
						alert.show(core.module.localization.msg.alert_only_zip_allowed);
						return false;
					}else if(files[0].size >= 10000000){
						alert.show('You can not upload files if total size is bigger than 10MB ');
						return false;
					}

					self.target_zip_file=files[0];

					$("#project_import_upload_output").text(files[0].name);
					
					// var formData = new FormData($("#project_import_form"));

					// for (var i = 0; i < files.length; i++) {
					//   formData.append('file', files[i]);
					// }
					// formData.append('project_import_location', upload_path);




					// now post a new XHR request
					// var xhr = new XMLHttpRequest();
					// xhr.open('POST', '/upload');
					// xhr.onload = function () {
					// 	console.log(xhr);

					// 	if (xhr.status === 200) {
					// 		console.log('all done: ' + xhr.status);
					//   	} else {
					//   		alert.show('Upload Fail');
					// 		console.log('Something went terribly wrong...');
					//   	}
					//   	setTimeout(function(){
					// 	  	self.refresh();
					//   	}, 500);

					// };

					// xhr.send(formData);
				  
				  
				  return false;
				};



			}
		});
		this.dialog = this.dialog.dialog;




		

	},

	show: function () {
		var self=this;

		//for init
		$("#input_import_project_author").val(core.user.id.replace(/ /g, "_"));
		$("#input_import_project_author").attr('readonly', 'readonly');
		$("#input_import_project_author").addClass('readonly');

		$("#input_import_project_author_name").val( core.user.name.replace(/ /g, "_") );
		$("#input_import_project_author_name").attr('readonly', 'readonly');
		$("#input_import_project_author_name").addClass('readonly');

		$("#input_import_project_name").val("");
		$("#input_import_project_desc").val("");
		$("#project_import_file").val("");



		this.dialog.panel.show();
		self.make_project_detailed_type_list();
		self.target_zip_file=null;
		$("#project_import_upload_output").text('');

	},

	//only once executed
	make_project_detailed_type_list : function(){
		var self=this;
		if(self.project_detailed_type_list.length===0){
			var detail_button=$(".project_wizard_second_button");
			for(var i=0;i<detail_button.length;i++){
				if($(detail_button[i]).attr("plugin_name").indexOf('examples')>-1 || $(detail_button[i]).text().indexOf('sample')>-1 ){
					continue;
				}

				self.project_detailed_type_list.push({
					'project_detailed_type' :  $(detail_button[i]).text(),
					'project_type' : $(detail_button[i]).attr("project_type"),
					'plugin_name' : $(detail_button[i]).attr("plugin_name")
				});

				$("#select_import_project_type").append('<option value="'+$(detail_button[i]).text()+'">'+$(detail_button[i]).text()+'</option>');

			}
		}
	}
};
