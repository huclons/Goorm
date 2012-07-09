var fs = require('fs');
var g_env = require("../../configs/env.js");

module.exports = {
	do_new: function (query, evt) {

		var data = {};
		data.err_code = 0;
		data.message = "process done";

		if ( query.project_type!=null && query.project_detailed_type !=null && query.project_author!=null && query.project_name!=null && query.project_about!=null && query.use_collaboration ) {
			fs.readdir(g_env.path+'workspace/', function(err, files) {
				if (err!=null) {
					data.err_code = 10;
					data.message = "Server can not response";

					evt.emit("project_do_new", data);
				}
				else {
					var project_dir = query.project_author+'_'+query.project_name;
					if (files.hasObject(project_dir)) {
						data.err_code = 20;
						data.message = "Exist project";

						evt.emit("project_do_new", data);
					}
					else {
						fs.mkdir(g_env.path+'workspace/'+project_dir, '0777', function(err) {
							if (err!=null) {
								data.err_code = 30;
								data.message = "Cannot make directory";
		
								evt.emit("project_do_new", data);
							}
							else {
								var file_contents = '<?xml version="1.0" encoding="utf-8"?>\n';
								file_contents += '<PROJECT>\n';
								file_contents += '	<TYPE>'+query.project_type+'</TYPE>\n';
								file_contents += '	<DETAILEDTYPE>'+query.project_detailed_type+'</DETAILEDTYPE>\n';
								file_contents += '	<AUTHOR>'+query.project_author+'</AUTHOR>\n';
								file_contents += '	<NAME>'+query.project_name+'</NAME>\n';
								file_contents += '	<ABOUT>'+query.project_about+'</ABOUT>\n';
								
								var today = new Date();
								var date_string = today.getYear+'/'+today.getMonth()+'/'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
																
								file_contents += '	<DATE>'+date_string+'</DATE>\n';
								file_contents += '	<COLLABORATION>'+query.use_collaboration+'</COLLABORATION>\n';
								file_contents += '</PROJECT>';

								fs.writeFile(g_env.path+'workspace/'+project_dir+'/project.xml', file_contents, function(err) {
									if (err!=null) {
										data.err_code = 40;
										data.message = "Can not make project file";
										
										evt.emit("project_do_new", data);
									}
									else {
										data.project_name = query.project_name;
										data.project_author = query.project_author;
										data.project_type = query.project_type;

										evt.emit("project_do_new", data);
									}
								});
							}
						});
					}
				}
			});	
		}
		else {
			data.err_code = 10;
			data.message = "Invalid query";

			evt.emit("project_do_new", data);
		}
	}

};
