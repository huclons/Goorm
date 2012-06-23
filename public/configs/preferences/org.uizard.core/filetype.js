var self = this;

var fileTypes = core.fileTypes;

for (var i = 0; i<core.fileTypes.length; i++) {
	
	var extName = fileTypes[i].fileExtention;
	var editor = fileTypes[i].editor;
	var description = fileTypes[i].description;
	var type = fileTypes[i].type;
	
	$(".fileTypeContents").find(".fileTypeList").append("<div class="+extName+">"+extName+"</div>");
	$(".fileTypeContents").find("."+extName).click(function () {
		
		$(".fileTypeContents").find(".fileTypeList").children().each(function () {
			$(this).css('background-color', '#fff');
		});
		$(this).css('background-color', '#eee');
		
		$(".fileTypeContents").find(".fileTypeDetail").children().each(function() { 
			$(this).remove(); 
		});	
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Extention Name</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='fileExtention' style='width:200px;' value='"+$(this).attr("id")+"'></input></div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Editor</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='editor' style='width:200px;' value='"+self.getFileTypeInfo($(this).attr("id"), "editor")+"'></input></div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Type</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='type' style='width:200px;' value='"+self.getFileTypeInfo($(this).attr("id"), "type")+"'></input></div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Description</div>");
		$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><textarea class='description' style='resize: none; width:200px; height:100px; overflow:hidden;'>"+self.getFileTypeInfo($(this).attr("id"), "description")+"</textarea></div>");
	});
}

$("#add").click(function () {
	$(".fileTypeContents").find(".fileTypeList").append("<div class='newExt'>New Extention</div>");
	$(".fileTypeContents").find(".fileTypeList").find(".newExt").click(function () {
		
		$(".fileTypeContents").find(".fileTypeList").children().each(function () {
			$(this).css('background-color', '#fff');
		});
		$(this).css('background-color', '#eee');
		
		$(".fileTypeContents").find(".fileTypeDetail").children().each(function() { 
			$(this).remove(); 
		});
		
		if ($(this).hasClass("newExt")) {	
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Extention Name</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='fileExtention' style='width:200px;' value=''></input></div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Editor</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='editor' style='width:200px;' value=''></input></div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Type</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='type' style='width:200px;' value=''></input></div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Description</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><textarea class='description' style='resize: none; width:200px; height:100px; overflow:hidden;'></textarea></div>");
		}
		else {
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Extention Name</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='fileExtention' style='width:200px;' value='"+$(this).attr("id")+"'></input></div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Editor</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='editor' style='width:200px;' value='"+self.getFileTypeInfo($(this).attr("id"), "editor")+"'></input></div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Type</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><input class='type' style='width:200px;' value='"+self.getFileTypeInfo($(this).attr("id"), "type")+"'></input></div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'>Description</div>");
			$(".fileTypeContents").find(".fileTypeDetail").append("<div style='width:100%;'><textarea class='description' style='resize: none; width:200px; height:100px; overflow:hidden;'>"+self.getFileTypeInfo($(this).attr("id"), "description")+"</textarea></div>");
		}
	});
})

$("#del").click(function () {
	$(".fileTypeContents").find(".fileTypeList").children().each(function() {
		if ($(this).attr("id") == $(".fileTypeContents").find(".fileExtention").val()){
			var temp = $.makeArray();
			for (var i = 0; i < core.fileTypes.length; i++) {
				if (core.fileTypes[i].fileExtention != $(this).attr("id")) {
					temp.push(core.fileTypes[i]);
				}
			}
			core.fileTypes = temp;
			$(this).remove();
		}
	});
	$(".fileTypeContents").find(".fileTypeDetail").children().each(function() {
		$(this).remove();
	});
})


$("#save").click(function () {
	
	var finded = false;
	
	if ($(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").length != 0){
		for (var i = 0; i < core.fileTypes.length; i++) {
			if (core.fileTypes[i].fileExtention == $(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val()) {
				finded = true;
				core.fileTypes[i].editor = $(".fileTypeContents").find(".fileTypeDetail").find(".editor").val();
				core.fileTypes[i].type = $(".fileTypeContents").find(".fileTypeDetail").find(".type").val();
				core.fileTypes[i].description = $(".fileTypeContents").find(".fileTypeDetail").find(".description").val();
			}
		}
		
		if (finded == false && $(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val() != "") {
			var temp = {
				"fileExtention":$(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val(),
				"editor":$(".fileTypeContents").find(".fileTypeDetail").find(".editor").val(),
				"description":$(".fileTypeContents").find(".fileTypeDetail").find(".description").val(),
				"type":$(".fileTypeContents").find(".fileTypeDetail").find(".type").val()
			}
			core.fileTypes.push(temp);
			$(".fileTypeContents").find(".fileTypeList").find(".newExt").html($(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val());
			var ext = $(".fileTypeContents").find(".fileTypeDetail").find(".fileExtention").val();
			$(".fileTypeContents").find(".fileTypeList").find(".newExt").attr("id", ext);
		}
	}
})

var getFileTypeInfo = function (ext, attr) {
	
	for (var i = 0; i < core.fileTypes.length; i++) {
		if (core.fileTypes[i].fileExtention == ext) {
			if (attr == "editor")
				return core.fileTypes[i].editor;
			else if (attr == "description")
				return core.fileTypes[i].description;
			else if (attr == "type")
				return core.fileTypes[i].type;
		}
	}
};
