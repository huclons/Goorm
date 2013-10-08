/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, node: true, plusplus: false, undef: false */
/*serverside jslint comment for global */
/*global __redis_mode: false, __local_mode: false, __workspace: false, __path: false, __temp_dir: false, __service_mode: false */
/*jshint unused: false */



var utils = require('util');
var exec = require('child_process').exec;
var EventEmitter = require("events").EventEmitter;
var fs = require('fs');

var parser = {
	'html' : require('htmlparser'),
	'css' : require('css-parse')
}

var object_explorer_data = null;

/*
	{
		'java' : {
			[workspace_name1] : {
				[name1] : [
					{item}, {item}, ...
				]
			}	
		},

		'cpp' : {
	
		}

		...
	}
*/
var called_data = {}; // for function call module
var java_libs = {};
var java_basic_class_arr = [];

module.exports = {

	get_object_explorer: function (query, evt) {
		var self = this;
		var type = query.selected_file_path.split(".").pop();

		var get_switch_type = function(type){
			if( type == 'c') return 'c/cpp';
			else if(type == 'cpp') return 'c/cpp';
			else if(type == 'css') return 'css';
			else if(type == 'html') return 'html';
		}

		var switch_type = get_switch_type(type);
		var tags_path = __workspace + query.selected_file_path.split('/')[0]+ '/.tags';
		switch(switch_type) {
			case 'c/cpp':
				//exec('ctags  --excmd=n  ' + __workspace + query.selected_file_path, function (err, stdout, stderr) {
					exec('cat '+tags_path, function (err, stdout, stderr) {
						if(!err)
						var ctags_result = stdout;
						self.get_object_explorer_data({
							'input' : ctags_result,
							'input_type' : type,
							'filepath' : query.filepath
						}, evt);

					//	exec('rm tags');
					});
				//});
				break;
			case 'css':
				fs.readFile( __workspace + query.selected_file_path, "utf8", function(err, raw){
					if(!err) {
						self.get_object_explorer_data({
							'input' : raw,
							'input_type' : 'css',
							'filepath' : query.filepath
						}, evt);
					}
				});
				break;

			case 'html':
				fs.readFile( __workspace + query.selected_file_path, "utf8", function(err, raw){
					var handler = new parser.html.DefaultHandler(function(parse_error, dom){
						if(parse_error) {
							console.log('...fail...', parse_error);
						}
						else{
							self.get_object_explorer_data({
								'input' : dom,
								'input_type' : 'html',
								'filepath' : query.filepath
							}, evt);
						}
					});

					var html_parser = new parser.html.Parser(handler);
					html_parser.parseComplete(raw);
				});
				break;

			default:
				evt.emit("got_object_explorer",false);
				break;
		}		
	},

	get_object_explorer_data : function(options, evt) {
		var self = this;
		if(!options) {
			evt.emit("got_object_explorer",false);
			return false;
		}
		var input = options.input;
		var input_type = options.input_type;
		var filepath = options.filepath;
		if(!input ||  !input_type || !filepath){
			evt.emit("got_object_explorer",false);
			return false;
		}

		if( input_type == 'c' ) {
			var tmp = {
				type: input_type,
				global_var: [],
				global_struct: [],
				global_function: [],

				struct_property: [],

				children : []
			};

			var results = input.split("\n");
			for (var i = 0; i < results.length; i++) {

				if (results[i].indexOf("!") === 0) {
					continue;
				} else {
					if (results[i].indexOf('\t') != -1) {
						var line = results[i].split("\t")[2];

						switch (results[i].split("\t")[3]) {
						case 'v':
							tmp.global_var.push({
								name: results[i].split("\t")[0],
								'use_detailed' : false,
								filetype: 'c/cpp',
								type: "variable",
								line: parseInt(line.substring(0, line.length-2), 10)
							});
							break;

						case 's':
							tmp.global_struct.push({
								name: results[i].split("\t")[0],
								'use_detailed' : false,
								filetype: 'c/cpp',
								children: [],
								type: "struct",
								line: parseInt(line.substring(0, line.length-2), 10)
							});
							break;
						case 'f':
							tmp.global_function.push({
								name: results[i].split("\t")[0],
								'use_detailed' : false,
								filetype: 'c/cpp',
								type: "function",
								line: parseInt(line.substring(0, line.length-2), 10)
							});

							break;
						case 'm':
							if (results[i].split("\t")[4].indexOf("struct") === 0) {
								//strcut property
								var struct_property_obj = {};
								struct_property_obj.parent = results[i].split("\t")[4].split(":")[1];
								struct_property_obj.name = results[i].split("\t")[0];
								struct_property_obj.use_detailed = false;
								struct_property_obj.filetype = 'c/cpp';
								struct_property_obj.type = "property";
								struct_property_obj.line = parseInt(line.substring(0, line.length-2), 10)

								tmp.struct_property.push(struct_property_obj);
							} else {
							}
							break;
						default:
							break;
						}

					}
				}
			}

			//self.object_explorer_data = tmp;

			for (var i = 0; i < tmp.global_struct.length; i++) {

				//get property
				for (var k = 0; k < tmp.struct_property.length; k++) {
					if (tmp.struct_property[k].parent == tmp.global_struct[i].name) {
						tmp.global_struct[i].children.push(tmp.struct_property[k]);
					}
				}

			}

			// self.object_explorer_data = {
			// 	children: []
			// };

			for (var i = 0; i < tmp.global_struct.length; i++) {
				tmp.children.push({
					type: 'struct',
					name: tmp.global_struct[i].name,
					filetype: 'c/cpp',
					'use_detailed' : false,
					line: tmp.global_struct[i].line,
					children: tmp.global_struct[i].children
				});
			}
			for (var i = 0; i < tmp.global_function.length; i++) {
				tmp.children.push({
					type: 'function',
					filetype: 'c/cpp',
					'use_detailed' : false,
					line: tmp.global_function[i].line,
					name: tmp.global_function[i].name 
				});
			}
			for (var i = 0; i < tmp.global_var.length; i++) {
				tmp.children.push({
					type: 'var',
					filetype: 'c/cpp',
					'use_detailed' : false,
					line: tmp.global_var[i].line,
					name: tmp.global_var[i].name 
				});
			}

			evt.emit("got_object_explorer", tmp);
		}
		else if( input_type == 'cpp'){
			var tmp = {
				type: input_type,
				global_var: [],
				global_struct: [],
				global_class: [],
				global_function: [],

				class_property: [],
				class_method: [],
				struct_property: [],
				children : []

			};

			var results = input.split("\n");
			for (var i = 0; i < results.length; i++) {

				if (results[i].indexOf("!") === 0) {
					continue;
				} else {
					if (results[i].indexOf('\t') != -1) {
						var line = results[i].split("\t")[2];

						switch (results[i].split("\t")[3]) {
						case 'v':
							tmp.global_var.push({
								name: results[i].split("\t")[0],
								'use_detailed' : false,
								type: "variable",
								filetype: 'c/cpp',
								line: parseInt(line.substring(0, line.length-2), 10)
							});
							break;
						case 'c':
							tmp.global_class.push({
								name: results[i].split("\t")[0],
								'use_detailed' : false,
								children: [],
								type: "class",
								filetype: 'c/cpp',
								line: parseInt(line.substring(0, line.length-2), 10)
							});
							break;
						case 's':
							tmp.global_struct.push({
								name: results[i].split("\t")[0],
								'use_detailed' : false,
								children: [],
								type: "struct"
							});
							break;
						case 'f':
							if (results[i].split("\t")[4] === undefined) {
								//global function
								tmp.global_function.push({
									name: results[i].split("\t")[0],
									'use_detailed' : false,
									type: "function",
									filetype: 'c/cpp',
									line: parseInt(line.substring(0, line.length-2), 10)
								});
							} else {
								//class method
								var class_method_obj = {};
								class_method_obj.parent = results[i].split("\t")[4].split(":")[1];
								class_method_obj.name = results[i].split("\t")[0];
								class_method_obj.use_detailed = false;
								class_method_obj.type = "method";
								class_method_obj.filetype = 'c/cpp';
								class_method_obj.line = parseInt(line.substring(0, line.length-2), 10)

								tmp.class_method.push(class_method_obj);
							}
							break;
						case 'm':
							if (results[i].split("\t")[4].indexOf("class") === 0) {
								//class property
								var class_property_obj = {};
								class_property_obj.parent = results[i].split("\t")[4].split(":")[1];
								class_property_obj.name = results[i].split("\t")[0];
								class_property_obj.use_detailed = false;
								class_property_obj.type = "property";
								class_property_obj.filetype = 'c/cpp';
								class_property_obj.line = parseInt(line.substring(0, line.length-2), 10);

								tmp.class_property.push(class_property_obj);

							} else if (results[i].split("\t")[4].indexOf("struct") === 0) {
								//strcut property
								var struct_property_obj = {};
								struct_property_obj.parent = results[i].split("\t")[4].split(":")[1];
								struct_property_obj.name = results[i].split("\t")[0];
								struct_property_obj.use_detailed = false;
								struct_property_obj.type = "property";
								struct_property_obj.filetype = 'c/cpp';
								struct_property_obj.line = parseInt(line.substring(0, line.length-2), 10);

								tmp.struct_property.push(struct_property_obj);
							} else {
							}
							break;
						default:
							break;
						}

					}
				}
			}

			//self.object_explorer_data = tmp;

			//build tree

			for (var i = 0; i < tmp.global_class.length; i++) {

				//get property
				for (var k = 0; k < tmp.class_property.length; k++) {
					if (tmp.class_property[k].parent == tmp.global_class[i].name) {
						tmp.global_class[i].children.push(tmp.class_property[k]);
					}
				}

				for (var k = 0; k < tmp.class_method.length; k++) {
					if (tmp.class_method[k].parent == tmp.global_class[i].name) {
						tmp.global_class[i].children.push(tmp.class_method[k]);
					}
				}
			}

			for (var i = 0; i < tmp.global_struct.length; i++) {

				//get property
				for (var k = 0; k < tmp.struct_property.length; k++) {
					if (tmp.struct_property[k].parent == tmp.global_struct[i].name) {
						tmp.global_struct[i].children.push(tmp.struct_property[k]);
					}
				}

			}
			//self.object_explorer_data = tmp;

			// self.object_explorer_data = {
			// 	children: []
			// };

			for (var i = 0; i < tmp.global_class.length; i++) {
				tmp.children.push({
					type: 'class',
					name: tmp.global_class[i].name,
					'use_detailed' : false,
					filetype: 'c/cpp',
					line: tmp.global_class[i].line,
					children: tmp.global_class[i].children
				});
			}
			for (var i = 0; i < tmp.global_struct.length; i++) {
				tmp.children.push({
					type: 'struct',
					name: tmp.global_struct[i].name,
					'use_detailed' : false,
					filetype: 'c/cpp',
					line: tmp.global_struct[i].line,
					children: tmp.global_struct[i].children
				});
			}
			for (var i = 0; i < tmp.global_function.length; i++) {
				tmp.children.push({
					type: 'function',
					filetype: 'c/cpp',
					'use_detailed' : false,
					line: tmp.global_function[i].line,
					name: tmp.global_function[i].name
				});
			}
			for (var i = 0; i < tmp.global_var.length; i++) {
				tmp.children.push({
					type: 'var',
					filetype: 'c/cpp',
					'use_detailed' : false,
					line: tmp.global_var[i].line,
					name: tmp.global_var[i].name
				});
			}

			evt.emit("got_object_explorer", tmp);
		}
		else if( input_type == 'css' ) {
			var tmp = {
				'children' : []
			};

			var parsed_css_data = parser.css(input, {position:true});
			if(parsed_css_data.stylesheet && parsed_css_data.stylesheet.rules) {
				var rules = parsed_css_data.stylesheet.rules;

				for(var j=0; j<rules.length; j++) {
					if(rules[j].type == 'rule') {
						var data = {
							'name' : rules[j].selectors.pop(),
							'type' : 'struct',
							'detailed_type' : 'Selector',
							'use_detailed' : false,
							'expanded' : true,
							'children' : []
						};

						rules[j].declarations.map(function(o){
							data.children.push({
								'name' : o.property + ':' + o.value,
								'type' : 'property',
								'detailed_type' : 'property',
								'use_detailed' : false,
								'filetype': 'css',
								'line' : o.position.start.line
							});
						});

						tmp.children.push(data);
					}
				}

				evt.emit("got_object_explorer", tmp);
			}
		}
		else if( input_type == 'html' ) {
			var tmp = {
				'children' : [],
				'err_code' : null
			};

			var get_css_script = function(input){
				var extract = function(data, target_name, is_all) {
					var target = [];
					var list = [];
					list.push(data);

					while( list.length != 0 ) {
						var node = list.shift();

						for(var i=0; i<node.length; i++) {
							var item = node[i];

							if(item.name == target_name) {
								if(is_all) {
									target.push(item);
								}
								else{
									target = item;
									list = [];
									break;
								}
							}
							
							if(item.children){
								list.unshift(item.children);
							}
						}
					}

					return target;
				}

				try {
					var head_data = extract(input, 'head');
					var link_data = extract(head_data.children, 'link', true);
					var css_data = link_data.filter(function(o){
						if(o.attribs && o.attribs.href && o.attribs.href.split('.').pop() == 'css') return true;
						else return false;
					});
				} catch (e) {
					console.log('Error html parsing error');
					css_data = [];
					tmp.err_code = 0;
				}

				return css_data;
			};

			var evaluate_path = function(relative_path) {
				var path = relative_path.split('/');

				for(var i=0; i<path.length; i++) {
					var item = path[i];

					if( item == '.') {
						path.remove(i, i);
					}
					else if( item == '..') {
						path.remove(i-1, i-1);
						path.remove(i-1, i-1);
					}
				}

				return path.join('/');
			};

			var css_data = get_css_script(input);
			if(css_data.length == 0) {
				evt.emit("got_object_explorer", tmp);
			}
			else {
				var count = 0;
				for(var i=0; i<css_data.length; i++) {
					(function(index){
						var item = css_data[index];
						var href = item.attribs.href;

						var css_file_path = __workspace + filepath + href;
						fs.exists(css_file_path, function(exists){
							if(exists) {
								fs.readFile(css_file_path, 'utf8', function(err, css){
									if(!err){
										var relative_filepath = (filepath + href).split('/');
										var filename = relative_filepath.pop();
										relative_filepath = evaluate_path(relative_filepath.join('/')) + '/' + filename;

										var parsed_css_data = parser.css(css, {position:true});

										if(parsed_css_data.stylesheet && parsed_css_data.stylesheet.rules) {
											var rules = parsed_css_data.stylesheet.rules;

											for(var j=0; j<rules.length; j++) {
												if(rules[j].type == 'rule') {
													var data = {
														'name' : rules[j].selectors.pop(),
														'type' : 'struct',
														'detailed_type' : 'Selector',
														'use_detailed' : false,
														'expanded' : true,
														'children' : []
													};

													rules[j].declarations.map(function(o){
														data.children.push({
															'name' : o.property + ':' + o.value,
															'type' : 'property',
															'detailed_type' : 'property',
															'use_detailed' : false,
															'filetype' : 'html',
															'filepath' : relative_filepath,
															'line' : o.position.start.line
														});
													});

													tmp.children.push(data);
												}
											}

											count++;
											if( count == css_data.length) {
												evt.emit("got_object_explorer", tmp);
											}
										}else{
											count++;
											if( count == css_data.length) {
												evt.emit("got_object_explorer", tmp);
											}
										}
									}
									else{
										count++;
										if( count == css_data.length) {
											evt.emit("got_object_explorer", tmp);
										}
									}
								});
							}
							else{
								count++;
								if( count == css_data.length) {
									evt.emit("got_object_explorer", tmp);
								}
							}
						});
					})(i);
				}
			}
		}
		else{
			// type err
			evt.emit("got_object_explorer",false);
		}
	},

	//for auto complete data
	get_dictionary: function (query, evt) {

		var self = this;
		var parsed_data = {};
		var absolute_workspace_path = __workspace + query.workspace;
		var read_tags_command = 'cat ' + absolute_workspace_path + '/.tags | grep -v "\!_TAG"';
		var type = query.selected_file_path.split(".").pop();
		exec(read_tags_command, function (err, stdout, stderr) {
			if (!err || stdout) {
				var ctags_result = stdout;
				switch (type) {
				case 'c':
					parsed_data = self.parsing_c(ctags_result, type, parsed_data);
					break;
				case 'cpp':
					parsed_data = self.parsing_cpp(ctags_result, type, parsed_data);
					break;
				case 'py':
					parsed_data = self.parsing_python(ctags_result, type, parsed_data);
					break;
				case 'java':
					parsed_data = {
						type: type,
						v: [],
						m: [],
						l: [],
						c: [],
						p: []
				};

					//import statement autocomplete
					if (!query && !query.line_content) break;

					if (query.line_content.indexOf("import") > -1) {
						query.line_content = query.line_content.split(' ').pop().split('\t').pop();
						if (query.line_content !== "") {
							var import_complete = self.proposal_import(query.line_content + "");

							for (var i = 0; i < import_complete.length; i++) {
								if (import_complete[i].type == "class") {
									parsed_data.c.push(import_complete[i].keyword.substring(query.line_content.length - query.line_content.split('.').pop().length));
								} else {
									parsed_data.p.push(import_complete[i].keyword.substring(query.line_content.length - query.line_content.split('.').pop().length));

								}
							}
						}
					} else {
						parsed_data = self.parsing_java(ctags_result, type, parsed_data);
					}
					break;
				default:
					break;
				}
				//parsing end
			}
			evt.emit("edit_get_dictionary", parsed_data);
		});

	},

	parsing_c: function (input, input_type, parsed_data) {
		var self = this;
		parsed_data = {
			type: input_type,
			v: [],
			l: [],
			f: [],
			m: [],
			s: []
		};
		var results = input.split("\n");
		for (var i = 0; i < results.length; i++) {
			if (results[i].indexOf('\t') != -1) {
				/*
					a	/home/simdj/workspace/goorm/workspace/demo2_aaa/src/main.c	/^int a;$/;"	v
					aa	/home/simdj/workspace/goorm/workspace/demo2_aaa/src/main.c	/^	int aa;$/;"	m	struct:abcddd	file:
					abcd	/home/simdj/workspace/goorm/workspace/demo2_aaa/src/main.c	/^int abcd;$/;"	v
					abcddd	/home/simdj/workspace/goorm/workspace/demo2_aaa/src/main.c	/^struct abcddd{$/;"	s	file:
					ahi	/home/simdj/workspace/goorm/workspace/demo2_aaa/src/main.c	/^}ahi;$/;"	v	typeref:struct:abcddd
					main	/home/simdj/workspace/goorm/workspace/demo2_aaa/src/main.c	/^int main(int argc, char* argv[]) {$/;"	f

				*/
				var symbol_type = results[i].split("\t")[3];
				var content = results[i].split("\t")[0];
				switch (symbol_type) {
				case 'v':
				case 'l':
				case 'f':
				case 'm':
				case 's':
					eval("parsed_data." + symbol_type + ".push(content)");
					break;
				default:
										break;
				}
			}
		}
		return parsed_data;
	},
	parsing_cpp: function (input, input_type, parsed_data) {
		var self = this;
		parsed_data = {
			type: input_type,
			v: [],
			l: [],
			f: [],
			c: []
		};
		var results = input.split("\n");
		for (var i = 0; i < results.length; i++) {
			if (results[i].indexOf("!") === 0) {
				continue;
			} else {
				if (results[i].indexOf('\t') != -1) {
					var len = results[i].split("\t").length;
					if (results[i].split("\t")[len - 1] == 'v') {
						parsed_data.v.push(results[i].split("\t")[0]);
					} else if (results[i].split("\t")[len - 1] == 'l') {
						parsed_data.l.push(results[i].split("\t")[0]);
					} else if (results[i].split("\t")[len - 1] == 'f') {
						parsed_data.f.push(results[i].split("\t")[0]);
					} else if (results[i].split("\t")[len - 2] == 'c') {
						parsed_data.c.push(results[i].split("\t")[0]);
					} else {

					}

				}
			}
		}
		return parsed_data;

	},
	parsing_java: function (input, input_type) {
		var self = this;
		parsed_data = {
			type: input_type,
			v: [],
			m: [],
			l: [],
			c: [],
			p: []
		};
		// // v is property     f will be in v....
		// // l is local 
		// // m is method
		// // c is class

		var results = input.split("\n");
		for (var i = 0; i < results.length; i++) {

			if (results[i].indexOf('\t') != -1) {
				var len = results[i].split("\t").length;
				if (results[i].split("\t")[len - 2] == 'f') { //in java f means property that is variable
					parsed_data.v.push(results[i].split("\t")[0]);
				} else if (results[i].split("\t")[len - 1] == 'l') {
					parsed_data.l.push(results[i].split("\t")[0]);
				} else if (results[i].split("\t")[len - 2] == 'm') {
					parsed_data.m.push(results[i].split("\t")[0]);
				} else if (results[i].split("\t")[len - 1] == 'c') {
					parsed_data.c.push(results[i].split("\t")[0]);
				} else {

				}

			}

		}
		return parsed_data;

	},

	parsing_python: function (input, input_type) {
		var self = this;
		var results = input.split("\n");

		parsed_data = {
			type: input_type,
			v: [],
			m: [],
			f: [],
			c: []
		};
		
		for (var i = 0; i < results.length; i++) {
			if (results[i].indexOf("!") === 0) {
				continue;
			} else {
				if (results[i].indexOf('\t') != -1) {
					var len = results[i].split("\t").length;
					if (results[i].split("\t")[len - 2] == 'f') { //in java f means property that is variable
						parsed_data.f.push(results[i].split("\t")[0]);
					} else if (results[i].split("\t")[len - 1] == 'v') {
						parsed_data.v.push(results[i].split("\t")[0]);
					} else if (results[i].split("\t")[len - 2] == 'm') {
						parsed_data.m.push(results[i].split("\t")[0]);
					} else if (results[i].split("\t")[len - 1] == 'c') {
						parsed_data.c.push(results[i].split("\t")[0]);
					} else {

					}

				}
			}
		}
		return parsed_data;
	},

	//...more language parsing

	save_tags_data: function (option) {
		var workspace = option.workspace;
		var project_type = option.project_type;

		
		var base_dir = __workspace;
		

				

		var create_tags = function (workspace, project_type, callback) {
			var absolute_workspace_path = base_dir + workspace;
			var ctags_command = "";

			if (project_type === 'cpp' || project_type === 'c') {
				ctags_command = "find " + absolute_workspace_path + " -regex '.*\.c' -o -regex '.*\.cpp' | xargs ctags  --c-types=+l --java-types=+l  -f " + absolute_workspace_path + "/.tags";
			} else {
				ctags_command = "find " + absolute_workspace_path + " -name '*." + project_type + "' | xargs ctags --c-types=+l --java-types=+l -f  " + absolute_workspace_path + "/.tags";
			}

			exec(ctags_command, function (err, stdout, stderr) {
				if (!err) {
					callback(true);
				} else {
					console.log('Error : save_tags_data [', ctags_command, ']');
					console.log(err);

					callback(false);
				}
			});
		};

		var make_called_data = function (workspace, project_type, callback) {
			var absolute_workspace_path = base_dir + workspace;
			var ctags_command = 'cat ' + absolute_workspace_path + '/.tags | grep -v \'\!_TAG\'';

			var init = function (workspace, project_type) {
				if (called_data[project_type]) {
					called_data[project_type][workspace] = {};
				} else {
					called_data[project_type] = {};
					called_data[project_type][workspace] = {};
				}
			};

			var get_data = function (items) {
				var response = {};
				var type_index;
				var type;

				if (project_type == 'java') {
					for (type_index = items.length - 1; type_index > 0; type_index--) {
						if (items[type_index].length == 1) {
							type = items[type_index];

							// function / local / method / class / package
														if (type == 'f' || type == 'l' || type == 'm' || type == 'c' || type == 'p') {
								break;
							}
						}
					}

					response.type = items[type_index];
					items[type_index + 1] && (response.class = items[type_index + 1]);
					response.name = items[0];
					response.filepath = items[1];
					response.query = "";
					for (var i = 2; i < type_index; i++) {
						response.query += items[i];
						if (i != type_index - 1) response.query += '\t';
					}
				} else if (project_type == 'py') {
					for (type_index = items.length - 1; type_index > 0; type_index--) {
						if (items[type_index].length == 1) {
							type = items[type_index];

							// function, def / variable / method / class
							if (type == 'f' || type == 'v' || type == 'm' || type == 'c') {
								break;
							}
						}
					}

					response.type = items[type_index];
					items[type_index + 1] && (response.class = items[type_index + 1]);
					response.name = items[0];
					response.filepath = items[1];
					response.query = "";
					for (var i = 2; i < type_index; i++) {
						response.query += items[i];
						if (i != type_index - 1) response.query += '\t';
					}
				}

				return response;
			};

			exec(ctags_command, function (err, stdout, stderr) {
				if (!err) {
					init(workspace, project_type);

					var tags = stdout.split('\n');
					for (var i = 0; i < tags.length; i++) {
						var items = tags[i].split('\t');

						if (items.length > 1) {
							var name = items[0];
							var data = get_data(items);

							name = '_' + name;

							if (called_data[project_type][workspace][name]) {
								called_data[project_type][workspace][name].push(data);
							} else {
								called_data[project_type][workspace][name] = [];
								called_data[project_type][workspace][name].push(data);
							}
						}
					}

					var data_file_path = absolute_workspace_path + '/.tags_result';

					fs.writeFile(data_file_path, JSON.stringify(called_data), function (err) {
						if (err) {
							console.log('Error : make_called_data [', data_file_path, ']');
							console.log(err);
						}
					});

				} else {
					console.log('Error : make_called_data [', ctags_command, ']');
					console.log(err);
				}
			});
		};

		switch (project_type) {
		case 'java':
		case 'java_examples':
			project_type = 'java';
			break;
		case 'python':
			project_type = 'py';
			break;
		case 'cpp':
		case 'c_examples':
		case 'c':
			project_type = 'cpp';
			break;
		default:
			project_type = "";
			break;
		}

		if (project_type !== "") {
			create_tags(workspace, project_type, function (status) {
				if (status) {
					setTimeout(function () {
						make_called_data(workspace, project_type);
					}, 100);
				} else {
				}
			});
		}
	},

	/*
		{
			'java' : {
				[workspace_name1] : {
					[name1] : [
						{item}, {item}, ...
					]
				}	
			},

			'cpp' : {
		
			}

			...
		}
	*/
	load_tags_data: function (option, callback) {
		var response = {};
		var workspace = option.workspace;
		var project_type = option.project_type;

		var token = option.token; // name
		token = '_' + token;

		
		var base_dir = __workspace;
		

				

		var absolute_workspace_path = base_dir + workspace;
		var ctags_command = 'cat ' + absolute_workspace_path + '/.tags_result';

		exec(ctags_command, function (err, called_data, stderr) {
			if (called_data) {
				called_data = JSON.parse(called_data);

				switch (project_type) {
				case 'java':
				case 'java_examples':
					project_type = 'java';
					break;
				case 'python':
					project_type = 'py';
					break;
				default:
					project_type = "";
					break;
				}

				if (project_type !== "" && called_data[project_type] && called_data[project_type][workspace]) {
					var parsed_data = called_data[project_type][workspace][token];

					if (parsed_data) {
						response.data = parsed_data;
						response.result = true;
						callback(response);
					} else {
						response.code = 1;
						response.result = false;
						callback(response);
					}
				} else {
					response.code = 0;
					response.result = false;
					callback(response);
				}
			} else {
				response.code = 0;
				response.result = false;
				callback(response);
			}
		});
	},

	proposal_import: function (query) {
		//query form : "java.i" "java." "java"
		if (query === "" || query === null || query === undefined) return [];
		last_point_index = query.split(".").pop().length;
		last_query = query.split(".").pop();
		prefix_query = query.substring(0, query.length - last_point_index - 1);
		prefix_query_origin = prefix_query + "";

		prefix_query = prefix_query.replace(/\./g, "']['");
		prefix_query = "['" + prefix_query + "']";

		var list = {};
		list = eval('java_libs');
		for (var i = 0; i < prefix_query_origin.split('.').length; i++) {
			list = list[prefix_query_origin.split('.')[i]];
			if (!list) return [];
		}

		var res = [];
		for (var l in list) {
			var o = eval('java_libs' + prefix_query + "['" + l + "']");
			var res_entry = {};
			if (o.import_code !== undefined && o.import_code.indexOf(query) === 0) {
				var target = o.import_code;
				if (target.indexOf('$') != -1) continue;

				if (o.type.toString() == 'class') {
					//ex)java.awt.Queue
					res_entry.keyword = target;
					res_entry.type = 'class';
					res_entry.description = target + "   description";
				} else {
					//ex)java.io.*
					res_entry.keyword = target + ".*";
					res_entry.type = 'package';
					res_entry.description = target + "   description";
				}
				res.push(res_entry);
			}

		} //for end

		return res;
	},

	get_proposal_java: function (query, evt) {
		evt.emit("got_proposal_java", {});
	},

	get_auto_import_java: function (query, evt) {
		var self = this;

		var res_packet = {};
		res_packet.last_package_def_sentence = -1;
		var res = [];
		var err_java_file = query.err_java_file;
		var missing_symbol = query.missing_symbol;

		if (!missing_symbol || !java_basic_class_arr) {
			evt.emit("got_auto_import_java", res_packet);
			return false;
		}
		if (java_basic_class_arr.length === 0) self.parsing_pacakge_txt();

		if (java_basic_class_arr.length !== 0 && query.selected_file_path !== undefined && query.selected_file_path !== null) {
			exec("ctags -x " + global.__workspace + query.selected_file_path, function (err, stdout, stderr) {

				var last_package_def_sentence = 0 * 1;
				var first_class_def_sentence = 100000 * 1;

				exec_res = stdout.split('\n');
				for (var i = 0; i < exec_res.length; i++) {
					var target = exec_res[i].toString().split(' ');

					var tmp_len = target.length;
					for (var k = tmp_len - 1; k >= 0; k--) {
						if (target[k] === "") target.splice(k, 1);
					}

					if (target[1] == "package" && last_package_def_sentence < target[2] * 1) {
						last_package_def_sentence = target[2] * 1;
					}
					if (target[1] == "class" && first_class_def_sentence > target[2] * 1) {
						first_class_def_sentence = target[2] * 1;
					}

				}
				//get range where import statement will be 

				res_packet.last_package_def_sentence = last_package_def_sentence;
				res_packet.first_class_def_sentence = first_class_def_sentence;

				// ctags parsing end
				for (var i = 0; i < missing_symbol.length; i++) {

					for (var k = 0; k < java_basic_class_arr.length; k++) {

						if (java_basic_class_arr[k].indexOf("/" + missing_symbol[i] + ".class") >= 0) {

							var candidate = (java_basic_class_arr[k] + "");
							candidate = candidate.substring(0, candidate.length - 6);
							if (err_java_file[i].indexOf(query.selected_file_path) >= 0) {

								var res_o = {};
								res_o.content = "import " + candidate.replace(/\//g, '.') + ';';
								res_o.location = err_java_file[i];
								res.push(res_o);
							}
							//console.log('-\t',java_basic_class_arr[k]);
						}
					}

				}
				res_packet.import_statement = res;

				evt.emit("got_auto_import_java", res_packet);
				return false;

			});

		} else {
			evt.emit("got_auto_import_java", res_packet);
			return false;
		}

	},

};

//java lib ready
//only once executed when server is on
var get_ready_for_java = function (package_root_name, callback) {
	var self = this;
	var each_lib_root = package_root_name;
	//java lib object read
	if (JSON.stringify(java_libs) == "{}") {
		fs.readFile('./plugins/org.goorm.plugin.java/java_basic_libs.json', 'utf-8', function (err, data) {
			if (err) return;
			java_libs = JSON.parse(data);
			if (JSON.stringify(java_libs) == "{}") console.log('no java_basic');
		});
	}

	//class path save
	if (JSON.stringify(java_basic_class_arr) == "[]") {

		fs.readFile('./plugins/org.goorm.plugin.java/java_basic_class_arr.json', 'utf-8', function (err, data) {
			if (err) return;
			java_basic_class_arr = JSON.parse(data);
		});
	}

};

//if java plugin included then right action happen else just return;
get_ready_for_java();
