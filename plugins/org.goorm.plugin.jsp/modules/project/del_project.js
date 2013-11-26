var fs = require('fs'),
	walk = require('walk'),
	emitter,
	common = require(__path + "plugins/org.goorm.plugin.jsp/modules/common.js");

var exec = require('child_process').exec;



module.exports = {
	do_delete : function(req) {
		var user_id = req.user.id;
		var project_name = req.project_path.split('/').pop();

		g_auth.load_auth_data(user_id, function (auth_data) {
			var host = auth_data.host;

			//ssh ec2-54-238-151-72.ap-northeast-1.compute.amazonaws.com  -l root -i /goormService/vm_manager/modules/key/goorm_pvm_lxc.pem -o StrictHostKeyChecking=no /root/script/delete.sh nys39092
			var command = "ssh "+host+" -l root -i "+keypass+" -o StrictHostKeyChecking=no /root/script/tomcat.sh add "+user_id+" "+req.project_name
			exec(command, function (err, stdout, stderr) {
				if (err) {
					console.log(err);
					console.log('DELETE JSP PROJECT FAIL...', user_id);
				}
				else {
					console.log('DELETE JSP PROJECT SUCCESS !', user_id, req.project_name);
				}
			});
		});
	}
};