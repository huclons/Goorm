/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

 /*
 this code is 
 	about making auto-complete data
 	about making object explorer
 */


var utils=require('util')
var exec=require('child_process').exec;
var EventEmitter = require("events").EventEmitter;

var parsed_data={};
var object_explorer_data=null;


module.exports = {
	get_object_explorer : function(query,evt){
		var self=this;
	
		exec('ctags  --excmd=n  ./workspace/'+query.selected_file_path,function(err,stdout,stderr){
			exec('cat tags',function(err,stdout,stderr){
				var ctags_result=stdout;
				var type=query.selected_file_path.split(".").pop();

				if(type=='c'){
					self.get_object_explorer_data_c(ctags_result,type);
				} else if(type=='cpp'){
					self.get_object_explorer_data_cpp(ctags_result,type);
				}else{
					//console.log('another language parsing to get object explorer data');
				}
				exec('rm tags');
				evt.emit("got_object_explorer",self.object_explorer_data);

			});
		});
	},

	get_object_explorer_data_cpp : function(input,input_type){
		var self=this;
		var tmp={
			type : input_type,
			global_var : [],
			global_struct : [],
			global_class : [],
			global_function : [],


			class_property : [],
			class_method : [],
			struct_property : []

		}

		//console.log('');
		//console.log('result!!!!!!!!!');
		var results=input.split("\n");
		for(var i=0;i<results.length;i++){
			
			if(results[i].indexOf("!")==0){
				continue;
			}
			else{
				if(results[i].indexOf('\t')!=-1){
					
				
					switch( results[i].split("\t")[3] ){
						case 'v':
							tmp.global_var.push({
								name : results[i].split("\t")[0],
								//children : [],
								type : "variable"
								}
							);
							break;
						case 'c':
							tmp.global_class.push(
								{
									name : results[i].split("\t")[0],
									children : [],
									type : "class"
								}
							);
							break;
						case 's':
							tmp.global_struct.push(
								{
									name :	results[i].split("\t")[0],
									children : [],
									type : "struct"
								}
							);
							break;
						case 'f':
							if(results[i].split("\t")[4]==undefined){
								//global function
								tmp.global_function.push(
									{
										name :results[i].split("\t")[0],
										//children : [],
										type : "function"
									}
								);
							}else{
								//class method
								var class_method_obj={};
								class_method_obj.parent=results[i].split("\t")[4].split(":")[1];
								class_method_obj.name=results[i].split("\t")[0];
								class_method_obj.type="method";
								//class_method_obj.children=[];

								tmp.class_method.push(class_method_obj);
							}
							break;
						case 'm':
							if(results[i].split("\t")[4].indexOf("class")==0){
								//class property
								var class_property_obj={};
								class_property_obj.parent=results[i].split("\t")[4].split(":")[1];
								class_property_obj.name=results[i].split("\t")[0];
								class_property_obj.type="property";
								//class_property_obj.children=[];

								tmp.class_property.push(class_property_obj);

							}else if(results[i].split("\t")[4].indexOf("struct")==0){
								//strcut property
								var struct_property_obj={};
								struct_property_obj.parent=results[i].split("\t")[4].split(":")[1];
								struct_property_obj.name=results[i].split("\t")[0];
								struct_property_obj.type="property";
								//struct_property_obj.children=[];

								tmp.struct_property.push(struct_property_obj);
							}else{
								//console.log("???????? parsing ??");
							}
							break;
						default:
							break;	
					}


				}
			}
		}

		self.object_explorer_data=tmp;


		//////build tree
		


		for(var i=0; i<tmp.global_class.length;i++){
				
			//get property
			for(var k=0; k< tmp.class_property.length ; k++){
				if(tmp.class_property[k].parent==tmp.global_class[i].name){
					tmp.global_class[i].children.push(tmp.class_property[k]);
				}
			}

			for(var k=0; k<tmp.class_method.length; k++){
				if(tmp.class_method[k].parent==tmp.global_class[i].name){
					tmp.global_class[i].children.push(tmp.class_method[k]);
				}
			}
			//get method
		}


		for(var i=0; i<tmp.global_struct.length;i++){
				
			//get property
			for(var k=0; k< tmp.struct_property.length ; k++){
				if(tmp.struct_property[k].parent==tmp.global_struct[i].name){
					tmp.global_struct[i].children.push(tmp.struct_property[k]);
				}
			}

		}			
		self.object_explorer_data=tmp;
		
		self.object_explorer_data={
			//name : "object_explorer",
			//type : "root",
			children :[]
		}



		for(var i=0;i<tmp.global_class.length;i++){
			self.object_explorer_data.children.push({
				type : 'class',
				name : tmp.global_class[i].name,
				children : tmp.global_class[i].children
			});
		}
		for(var i=0;i<tmp.global_struct.length;i++){
			self.object_explorer_data.children.push({
				type : 'struct',
				name : tmp.global_struct[i].name,
				children : tmp.global_struct[i].children
			});
		}
		for(var i=0;i<tmp.global_function.length;i++){
			self.object_explorer_data.children.push({
				type : 'function',
				name :tmp.global_function[i].name//,
				// : tmp.global_function[i].children
			});
		}
		for(var i=0;i<tmp.global_var.length;i++){
			self.object_explorer_data.children.push({
				type : 'var',
				name : tmp.global_var[i].name//,
				//children : tmp.global_var[i].children
			});
		}




		// console.log('');
		// console.log('from server to client');
		// console.log(self.object_explorer_data);
		// console.log('');

	
	},

	get_object_explorer_data_c : function(input,input_type){
		var self=this;
		var tmp={
			type : input_type,
			global_var : [],
			global_struct : [],
			global_function : [],
		
			struct_property : []
		}

		//console.log('');
		//console.log('result!!!!!!!!!');
		var results=input.split("\n");
		for(var i=0;i<results.length;i++){
			
			if(results[i].indexOf("!")==0){
				continue;
			}
			else{
				if(results[i].indexOf('\t')!=-1){
					
				
					switch( results[i].split("\t")[3] ){
						case 'v':
							tmp.global_var.push({
								name : results[i].split("\t")[0],
								//children : [],
								type : "variable"
								}
							);
							break;
						
						case 's':
							tmp.global_struct.push(
								{
									name :	results[i].split("\t")[0],
									children : [],
									type : "struct"
								}
							);
							break;
						case 'f':
							tmp.global_function.push(
								{
									name :results[i].split("\t")[0],
									//children : [],
									type : "function"
								}
							);
							
							break;
						case 'm':
							if(results[i].split("\t")[4].indexOf("struct")==0){
								//strcut property
								var struct_property_obj={};
								struct_property_obj.parent=results[i].split("\t")[4].split(":")[1];
								struct_property_obj.name=results[i].split("\t")[0];
								struct_property_obj.type="property";
								//struct_property_obj.children=[];

								tmp.struct_property.push(struct_property_obj);
							}else{
								//console.log("???????? parsing ??");
							}
							break;
						default:
							break;	
					}


				}
			}
		}

		self.object_explorer_data=tmp;
	//	console.log('');
	//	console.log(tmp);



		for(var i=0; i<tmp.global_struct.length;i++){
				
			//get property
			for(var k=0; k< tmp.struct_property.length ; k++){
				if(tmp.struct_property[k].parent==tmp.global_struct[i].name){
					tmp.global_struct[i].children.push(tmp.struct_property[k]);
				}
			}

		}			
		
		
		self.object_explorer_data={
			//name : "object_explorer",
			//type : "root",
			children :[]
		}



		for(var i=0;i<tmp.global_struct.length;i++){
			self.object_explorer_data.children.push({
				type : 'struct',
				name : tmp.global_struct[i].name,
				children : tmp.global_struct[i].children
			});
		}
		for(var i=0;i<tmp.global_function.length;i++){
			self.object_explorer_data.children.push({
				type : 'function',
				name :tmp.global_function[i].name//,
				// : tmp.global_function[i].children
			});
		}
		for(var i=0;i<tmp.global_var.length;i++){
			self.object_explorer_data.children.push({
				type : 'var',
				name : tmp.global_var[i].name//,
				//children : tmp.global_var[i].children
			});
		}


		//console.log('result');
		//console.log(self.object_explorer_data);
	},

	







	////for auto complete data
	get_dictionary : function(query,evt){
		var self=this;
		exec('ctags --c-types=+l --java-types=+l   ./workspace/'+query.selected_file_path,function(err,stdout,stderr){
			exec('cat tags',function(err,stdout,stderr){
				var ctags_result=stdout;
				
				var len=query.selected_file_path.split(".").length;
				var type=query.selected_file_path.split(".")[len-1];
				//console.log('type',type);

				if(type=='c'){
					self.parsing_c(ctags_result,type);
				}
				else if(type=='cpp'){
					self.parsing_cpp(ctags_result,type);
				}
				else if(type=='java'){
					self.parsing_java(ctags_result,type);
				}else{
					//console.log('--for auto-complete data--another language type parsing');
				}
				//parsing end

				exec('rm tags',function(err,stdout,stderr){ });
				evt.emit("edit_get_dictionary", self.parsed_data);

			});
		});
	},

	parsing_c : function(input,input_type){
		var self=this;
		self.parsed_data={
				type : input_type,
				v:[],
				l:[],
				f:[]
		}
		var results=input.split("\n");
		for(var i=0;i<results.length;i++){
			if(results[i].indexOf("!")==0){
				continue;
			}
			else{
				if(results[i].indexOf('\t')!=-1){
					var len=results[i].split("\t").length;
					if(results[i].split("\t")[len-1]=='v'){
						self.parsed_data.v.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-1]=='l'){
						self.parsed_data.l.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-1]=='f'){
						self.parsed_data.f.push(results[i].split("\t")[0]);
					}
					else{
						// console.log('what type? ',results[i].split("\t")[3]);
						// if(parse_result[results[i].split("\t")[3]]==undefined){
						//   parse_result[results[i].split("\t")[3]]=[];
						// }
						// parse_result[results[i].split("\t")[3]].push(results[i].split("\t")[0]);
					}

				}
			}
		}
	},
	parsing_cpp : function(input,input_type){
		var self=this;
		self.parsed_data={
				type : input_type,
				v:[],
				l:[],
				f:[],
				c:[]
		}
		var results=input.split("\n");
		for(var i=0;i<results.length;i++){
			if(results[i].indexOf("!")==0){
				continue;
			}
			else{
				if(results[i].indexOf('\t')!=-1){
					var len=results[i].split("\t").length;
					if(results[i].split("\t")[len-1]=='v'){	
						self.parsed_data.v.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-1]=='l'){
						self.parsed_data.l.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-1]=='f'){
						self.parsed_data.f.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-2]=='c'){
						self.parsed_data.c.push(results[i].split("\t")[0]);
					}
					else{
						// console.log('what type? ',results[i].split("\t")[3]);
						// if(parse_result[results[i].split("\t")[3]]==undefined){
						//   parse_result[results[i].split("\t")[3]]=[];
						// }
						// parse_result[results[i].split("\t")[3]].push(results[i].split("\t")[0]);
					}

				}
			}
		}

	},
	parsing_java : function(input,input_type){
		var self=this;
		self.parsed_data={
				type : input_type,
				v:[],
				m:[],
				l:[],
				c:[]
		}
		// v is property     f will be in v....
		// l is local 
		// m is method
		// c is class

		var results=input.split("\n");
		for(var i=0;i<results.length;i++){
			if(results[i].indexOf("!")==0){
				continue;
			}
			else{
				if(results[i].indexOf('\t')!=-1){
					var len=results[i].split("\t").length;
					if(results[i].split("\t")[len-2]=='f'){	//in java f means property that is variable
						self.parsed_data.v.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-1]=='l'){
						self.parsed_data.l.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-2]=='m'){
						self.parsed_data.m.push(results[i].split("\t")[0]);
					}
					else if(results[i].split("\t")[len-1]=='c'){
						self.parsed_data.c.push(results[i].split("\t")[0]);
					}
					else{
						// console.log('what type? ',results[i].split("\t")[3]);
						// if(parse_result[results[i].split("\t")[3]]==undefined){
						//   parse_result[results[i].split("\t")[3]]=[];
						// }
						// parse_result[results[i].split("\t")[3]].push(results[i].split("\t")[0]);
					}

				}
			}
		}

	}

	//...more language parsing



}

