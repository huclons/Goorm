
module.exports = {
	load: function (options, evt) {
		var data = options.data;
		var workspace = options.workspace;
		var token = options.token;

		var response = {};
		response.data = [];
		response.result = true;

		for (var path in data) {
			var file_data = data[path];

			file_data.map(function (o){
				if (o.name == token) {
					o.filepath = workspace + '/' + path;
					response.data.push(o);
				}
			});
		}

		if (response.data.length == 0) {
			response.result = false;
		}

		console.log(response);

		evt.emit('jump_to_definition', response);
	}	
}