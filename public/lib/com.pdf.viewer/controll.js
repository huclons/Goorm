org.goorm.core.pdf_viewer = {
	goNext: null,
	goPrevious: null,
	renderPage: null,
	make_viewer: null,
	change_viewer: null,
	upload_pdf: null,
	get_list: null,
	pdf_viewer_rate: null,
	pdfDoc: null,
	pageNum: 1,
	scale: 1.0,
	canvas: null,
	ctx: null,
	url: null,
	original_size: null,
	layout_right_height: null,
	layout_right_width: null,
	pdf_timer: null,
	socket: null,
	draw_mode: false,
	erase_size: 20,
	image_url: null,
	myctx: {
		strokeStyle : "#FF0000",
		lineWidth : 3
	},
	init: function(){
		var self = this;
		PDFJS.disableWorker = true;
		self.socket =   (org.goorm.core.collaboration.communication.socket == null) ? 
						(org.goorm.core.collaboration.communication.socket = io.connect()) :
		 				org.goorm.core.collaboration.communication.socket;
	},
	set_url : function(new_url, page){
		var self = this;

		if(self.url == new_url){
			if(page && self.pageNum != page){
				self.pageNum = page*1;
				self.renderPage(self.pageNum, self.scale, false);
			}else{
				self.returned = false;	
			}
			return;
		}
		if(page){
			self.pageNum = page*1;	
		}else{
			self.pageNum = 1;
		}
		self.url = new_url;
		var msg_data = {channel:'pdf_viewer', msg:'new_pdf', url: self.url, workspace: core.user.workspace};
		self.socket_mode(msg_data);
		self.image_qu = [];
		//self.socket.emit('message', JSON.stringify(msg_data));
		
		
		PDFJS.getDocument(self.url).then(function getPdfHelloWorld(_pdfDoc) {
			pdfDoc = _pdfDoc;
			self.renderPage(self.pageNum, self.scale, true);
			//var layout_right_width = $(".yui-layout-unit-right").find(".yui-layout-wrap").width() - 20;
			//$("#the-canvas").width(layout_right_width - 80);
			//$("#the-canvas").height((layout_right_width - 80)*3/4);
		});
		//check
		$("#replace_query_inputbox").hide()
		$("#search_query_inputbox").hide()
		$(".project_items").hide()
		$("#help_contents_middle").hide()
		$("#new_other_file").hide()
		$(".CodeMirror-vscrollbar").hide();
		$("#find_query_inputbox").hide();
	},
	get_list : function(){
		var self = this;
		$.post("/pdf/get_list",null,function(url){
			$(url.pdf_list).each(function(i,o){
				$("#pdf_list").append("<option value='"+o+"'>"+o+"</option>");
			})
		});
	},
	make_viewer : function(Id){
		var self = this;
		var contents = "";
		contents +=		'<div id="viewer_bt_container" style="z-index:4;position:absolute;">';
		contents +=			'<div id="pdf_control_bt_container" style="float:left">';
		contents +=				'<div class="pdf_sub_control_bt_container" style="float:left;width:65px;">'
		// contents +=					'<img id="pdf_prev" class="pdf_buttons" src="images/icons/context/prev.png" />';
		// contents +=					'<img id="pdf_next" class="pdf_buttons" src="images/icons/context/next.png"/>';
		contents +=					'<div tooltip="pdf_prev" id="pdf_prev" class="pdf_buttons pdf_toolbar-buttons">';
		contents +=						'<div class="pdf_viewer-toolbar-prev"></div>'
		contents +=					'</div>'
		contents +=					'<div tooltip="pdf_next" id="pdf_next" class="pdf_buttons pdf_toolbar-buttons">';
		contents +=						'<div class="pdf_viewer-toolbar-next"></div>'
		contents +=					'</div>'
		contents +=				'</div>'
		contents +=				'<div class="pdf_sub_control_bt_container" style="float:left"><div class="pdf_bt_divider"></div>'
		contents +=					'<input id="goto_page" type="text" style="margin-left: 10px;width:20px; padding:4px;"></input>';
		contents +=					' / ';
		contents +=					'<span class="pdf_buttons" id="page_count">0</span>';
		contents +=				'</div>'
		contents +=			'</div>';
		contents +=			'<div class="pdf_sub_control_bt_container" style="float:left; width:70px;"><div class="pdf_bt_divider"></div>'
		// contents +=				'<img id="magnify_pdf" class="pdf_buttons" src="/images/org.goorm.core.pdf/plus.png"></img>'
		// contents +=				'<img id="reduce_pdf" class="pdf_buttons" src="/images/org.goorm.core.pdf/minus.png"></img>'
		contents +=				'<div tooltip="magnify" id="magnify_pdf" class="pdf_buttons pdf_toolbar-buttons">'
		contents +=					'<div class="pdf_viewer-toolbar-plus"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="minify" id="reduce_pdf" class="pdf_buttons pdf_toolbar-buttons">'
		contents +=					'<div class="pdf_viewer-toolbar-minus"></div>'
		contents +=				'</div>'
		contents +=			'</div>';
		contents +=			'<div id="draw_control_bt_container" class="pdf_sub_control_bt_container" style="float:left; width:225px;"><div class="pdf_bt_divider"></div>'
		// contents +=				'<img id="pdf_draw_bt" class="pdf_buttons" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/palette.png"></img>'
		// contents +=				'<img id="pdf_pen_bt" class="pdf_buttons not_active" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/pencil.png"></img>'
		// contents +=				'<img id="pdf_erase_bt" class="pdf_buttons not_active" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/draw_eraser.png"></img>'
		// contents +=				'<img id="pdf_palette_bt" class="pdf_buttons not_active" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/color_wheel.png"></img>'
		// contents +=				'<img id="pdf_brush_size_bt" class="pdf_buttons not_active" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/hslider.png"></img>'
		// contents +=				'<img id="pdf_erase_all_bt" class="pdf_buttons not_active" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/broom.png"></img>'
		// contents +=				'<img id="pdf_connect_bt" class="pdf_buttons" src="/configs/toolbars/org.goorm.core.pdf_viewer/images/disconnect.png"></img>'
		contents +=				'<div tooltip="palette" id="pdf_draw_bt" class="pdf_buttons pdf_toolbar-buttons">'
		contents +=					'<div class="pdf_viewer-toolbar-palette"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="pencil" id="pdf_pen_bt" class="pdf_buttons pdf_toolbar-buttons not_active">'
		contents +=					'<div class="pdf_viewer-toolbar-pencil"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="erase" id="pdf_erase_bt" class="pdf_buttons pdf_toolbar-buttons not_active">'
		contents +=					'<div class="pdf_viewer-toolbar-draw_eraser"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="color_wheel" id="pdf_palette_bt" class="pdf_buttons pdf_toolbar-buttons not_active">'
		contents +=					'<div class="pdf_viewer-toolbar-color_wheel"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="size_slider" id="pdf_brush_size_bt" class="pdf_buttons pdf_toolbar-buttons not_active">'
		contents +=					'<div class="pdf_viewer-toolbar-hslider"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="erase_all" id="pdf_erase_all_bt" class="pdf_buttons pdf_toolbar-buttons not_active">'
		contents +=					'<div class="pdf_viewer-toolbar-broom"></div>'
		contents +=				'</div>'
		contents +=				'<div tooltip="disconnect" id="pdf_connect_bt" class="pdf_buttons pdf_toolbar-buttons">'
		contents +=					'<div class="pdf_viewer-toolbar-disconnect"></div>'
		contents +=				'</div>'
		contents +=			'</div>';
		contents +=			"<div id='pdf_brush_container' style='width:260px;position:absolute;display:none;border: 1px solid #ccc;vertical-align: middle;font-size: 11px;'>"
		contents +=				"<div id='pdf_brush_slider'>"
		contents +=					"<div id='pdf_sliderbg' style='margin-left: auto;margin-right: auto;'>"
		contents +=						"<div id='pdf_sliderthumb'>"
		contents +=							"<img src='images/org.goorm.core.collaboration/thumb-s.gif' style='cursor:pointer'>"
		contents +=						"</div>"
		contents +=					"</div>"
		contents +=				"</div>"
		contents +=				"<input type='text' id='pdf_brush_thickness'/>"
		contents +=			"</div>"
		contents +=			"<div id='pdf_palette_container' style='position:absolute; display:none;'>"
		contents +=				"<div id='pdf_palette' style='width: 335px; height: 250px; background-color: #fff; border: 1px solid #333; border-radius: 3px;'>"
		contents +=					"<button id='close_pdf_palette' style=' margin-top:232px; margin-left:300px;'>close</button>"
		contents +=				"</div>"
		contents +=			"</div>"
		contents +=		'</div>';
		contents +=		'<div id="pdf_canvas_container" style="background-color: #f8f8f8;text-align: center;vertical-align: middle;font-size: 11px;">';
		contents +=			'<canvas id="the-canvas" tabindex="1"></canvas>';
		contents +=			'<canvas id="the_draw_canvas" tabindex="1" style="z-index:1; position:absolute;"></canvas>';
		contents +=		'</div>';
		contents += 	"<div id='pdf_real_eraser' style='z-index:3;display: none; position: absolute; width: 20px; height: 20px; border: 1px solid #000;background-color: #fff;'></div>"
		$("#"+Id).append(contents);
		$("#goorm_inner_layout_right ul").css('position', 'absolute').css('z-index', 4);
		$("#get_list").css('margin-top','25px');
		$("#viewer_bt_container").css('margin-top', '53px');
		//$("#upload_pdf").hide();
		// 업로드 부분 서버 남아있음
		//$("#my_id").val(core.user.id);
		//get_list();
		/*var form_options = {
			target: "#upload_pdf",
			success: function(data) {
				core.module.loading_bar.stop();
				var contents;
				contents =	'<input type="file" name="pdfs" multiple=""></input>';
				contents +=	'<input type="submit" value="upload"></input>';
				$("#upload_pdf").append(contents);
				$("#upload_pdf").hide();

				$("#upload_mark_up").show();
			}
		}
		$('#upload_pdf').ajaxForm(form_options);

		$("#upload_pdf").submit(function(){
			core.module.loading_bar.start("Uploading processing...");
			return false;
		});*/
		$("#pdf_list").change(function(){
			var selected = $('#pdf_list option:selected').val();
			//if(selected!='Select_pdf'){
				//set_url(selected);
				if(selected == 'slide_share'){
					$("#viewer_body").hide();
					$("#slide_body").show();
				}else{
					$("#viewer_body").show();
					$("#slide_body").hide();
				}
			//}
		})
		self.canvas = document.getElementById('the-canvas');
		self.ctx = self.canvas.getContext('2d');
		var moving = false, before_pos = {}, current_pos = {}, top, left;
		
		$("#pdf_list").css('padding','2px');
		$("#pdf_palette_container").css("top", 40);
		$("#pdf_brush_container").css("top",40);
		$("#the-canvas").parent().css('position','absolute').css('top', 95).css('overflow', 'hidden');
		$("#the-canvas").css('position','absolute').css('z-index', 2).css('left', 0).css('outline', 'none').on("mousedown",function(e){
			moving = true;
			before_pos.left = e.clientX;
			before_pos.top = e.clientY;

	  		$(this).css("cursor", "grabbing");
	  		$(this).css("cursor", "-moz-grabbing");
	  		$(this).css("cursor", "-webkit-grabbing");
		}).on("mouseup", function(){
			moving = false;
			$(this).css("cursor", "default");
		}).on("mousemove", function(e){
			if(moving){
				current_pos = $(this).position();
				if((left = current_pos.left + (e.clientX-before_pos.left))>0){
					left = 0;
				}
				if((top = current_pos.top + (e.clientY-before_pos.top))>0){
					top = 0;
				}
				if(self.layout_right_width < $(this).width()){
					if(left < (self.layout_right_width - $(this).width())){
						left = (self.layout_right_width - $(this).width());
					}	
				}else{
					left = (self.layout_right_width + 20 - $(this).width())/2;
				}
				if(self.layout_right_height <  $(this).height() - 30){
					if(top < (self.layout_right_height - $(this).height())){
						top = (self.layout_right_height - $(this).height());
					}	
				}else{
					top = 30;
				}
				
				$(this).css('left', left);
				$(this).css('top', top);
				$(self.draw_canvas).css('left', left);
				$(self.draw_canvas).css('top', top);
				before_pos.left = e.clientX;
				before_pos.top = e.clientY;
				//console.log(current_pos.x + (e.clientX-before_pos.x));
			}else{
				$(this).css("cursor","pointer");
			}
		});
		$(window).on('mouseup', function(){moving = false;mouseState = 0;});
		$(core).bind("layout_resized", function () {
			self.layout_right_width = $(".yui-layout-unit-right").find(".yui-layout-wrap").width() - 20;
			self.layout_right_height = $("#goorm_inner_layout_right").parent().height() - 90;
			self.eraser_top = 90;
			if(self.layout_right_width<505){
				$("#pdf_canvas_container").css('top', 130);
				self.eraser_top = 125;
				$("#pdf_control_bt_container").css("margin-left", (self.layout_right_width-220)/2);
			}else{
				$("#pdf_canvas_container").css('top', 95);
				$("#pdf_control_bt_container").css("margin-left", (self.layout_right_width-450)/2);
			}
			//$("#pdf_control_bt_container").css("margin-left", (self.layout_right_width-450)/2);
			$("#pdf_brush_container").css("left", self.layout_right_width - 260);
			$("#pdf_palette_container").css("left", self.layout_right_width - 337);
			$("#goorm_inner_layout_right ul").width(self.layout_right_width+20);
			$("#get_list").width(self.layout_right_width+20);
			$("#viewer_bt_container").width(self.layout_right_width+20);
			$("#pdf_list").width(self.layout_right_width - 50);
			$("#the-canvas").parent().css('width', self.layout_right_width+20);
			$("#the-canvas").parent().css('height', self.layout_right_height);
			if(self.layout_right_width >= $(self.canvas).width()){
				left = (self.layout_right_width + 20 - $(self.canvas).width())/2;
				$(self.canvas).css('left', left);
				$(self.draw_canvas).css('left', left);
			}
			if(self.layout_right_height >=  $(self.canvas).height()){
				top = 30;
				$(self.canvas).css('top', top);
				$(self.draw_canvas).css('top', top);
			}
			
			
			
			//$("#goorm_inner_layout_right").height();
		/*	if(!pdfDoc){
				$("#the-canvas").width(layout_right_width - 80);
				$("#the-canvas").height((layout_right_width - 80)*3/4);
			}*/
			before_pos.left = 0;
			before_pos.top = 0;
			/*if(pdfDoc){
				scale = layout_right_width/original_size;
				renderPage(pageNum, scale);
			}*/
		});

		$('#goto_page').on("keydown",function(e){
			if(e.which == 13){
				self.goto_page(true);
			}
		});
		$('#the-canvas').on("keydown", function(e){
			if(e.which == 107){
				self.size_change(0.1);
			}else if(e.which == 109){
				self.size_change(-0.1);
			}
		});
		/*$('#the-canvas').on('mouseover',function(e){
			$(this).focus();
		})*/

		$('#pdf_prev').on('click', function(){
			if(self.pageNum<=1)
				return;
			var msg_data = {channel:'pdf_viewer', msg:'prev', pageNum: (self.pageNum-1), workspace: core.user.workspace};
			self.socket_mode(msg_data);
			//self.socket.emit('message', JSON.stringify(msg_ob));
			self.goPrevious();
		});
		$('#pdf_next').on('click', function(){
			if(self.pageNum>=pdfDoc.numPages)
				return;
			var msg_data = {channel:'pdf_viewer', msg:'next', pageNum: (self.pageNum+1), workspace: core.user.workspace};
			self.socket_mode(msg_data);
			//self.socket.emit('message', JSON.stringify(msg_data));
			self.goNext();
		});
		$("#magnify_pdf").on('click', function(){
			self.size_change(0.1);
		});
		
		$("#reduce_pdf").on('click', function(){
			self.size_change(-0.1);
		});
		self.make_draw();
		//$('#viewer_body').hide();
	},
	renderPage : function(num, size, is_new) {
		var self = this;
		// Using promise to fetch the page
		pdfDoc.getPage(num).then(function(page) {
			var viewport = page.getViewport(size);
			self.canvas.height= viewport.height;
			self.canvas.width= viewport.width;
			if(is_new){
				self.original_size = viewport.width;
				self.pdf_viewer_rate = viewport.width/viewport.height;
				$(self.canvas).css('margin-left', 10);
				$(self.draw_canvas).css('margin-left', 10);
				$(self.canvas).addClass("canvas_shadow");
				$(self.draw_canvas).css("canvas_shadow");
				var layout_right_width = $(".yui-layout-unit-right").find(".yui-layout-wrap").width();
				var layout_right_height = $("#goorm_inner_layout_right").parent().height() - 90;
				self.scale = (layout_right_width - 80)/self.original_size;
				$(self.canvas).width(layout_right_width - 80);
				$(self.canvas).height((layout_right_width - 80)/self.pdf_viewer_rate);
				$(self.draw_canvas).width(layout_right_width - 80);
				$(self.draw_canvas).height((layout_right_width - 80)/self.pdf_viewer_rate);

				if(self.draw_ctx){
					var dataURL =self.draw_canvas.toDataURL();
					var img = new Image;
					img.src = dataURL;
					img.onload = function (){
						var slide = $("#iframe_slideshare");
						var width = layout_right_width - 80;
						var height = (layout_right_width - 80)/self.pdf_viewer_rate;
						self.draw_ctx.canvas.width = width;
						self.draw_ctx.canvas.height = height;
						self.draw_ctx.strokeStyle = self.myctx.strokeStyle;
						self.draw_ctx.lineWidth = self.myctx.lineWidth;
						self.draw_ctx.drawImage(img, 0, 0, width, height);
					}
					//$(self.draw_ctx).width(layout_right_width - 80);
					//$(self.draw_canvas).height((layout_right_width - 80)/self.pdf_viewer_rate);
				}
			
				if(layout_right_width >= $(self.canvas).width()){
					$(self.canvas).css('left', (layout_right_width - $(self.canvas).width())/2);
					$(self.draw_canvas).css('left', (layout_right_width - $(self.canvas).width())/2);
				}
				if(layout_right_height >=  $(self.canvas).height()-30){
					$(self.canvas).css('top', 30);
					$(self.draw_canvas).css('top', 30);
				}
			}
			//console.log('sibong', self.pageNum, self.image_qu[self.pageNum])
			if(self.returned){
				self.erase_all();
				if(self.image_url){
					var width = self.original_size * self.scale;
					var height = self.original_size * self.scale / self.pdf_viewer_rate;
					var img = new Image;
					img.src = self.image_url;
					img.onload = function(){
						self.draw_ctx.drawImage(img, 0, 0, width, height);	
					}
					//self.draw_ctx.drawImage(self.image_qu[self.pageNum], 0, 0, width, height);	
				}
				self.returned = false;
			}
			// Render PDF page into canvas context
			var renderContext = {
				canvasContext: self.ctx,
				viewport: viewport
			};
			page.render(renderContext);
		});

		// Update page counters
		//document.getElementById('page_num').textContent = pageNum;
		$('#goto_page').val(self.pageNum);
		document.getElementById('page_count').textContent = pdfDoc.numPages;
	},
	goPrevious : function() {
		var self = this;
		if(pdfDoc){
			if (self.pageNum <= 1)
				return;
			
			var dataURL =self.draw_canvas.toDataURL();
			var img = new Image;
			img.src = dataURL;
			self.image_qu[self.pageNum] = img;
			self.pageNum--;
			self.erase_all();
			var width = self.original_size * self.scale;
			var height = self.original_size * self.scale / self.pdf_viewer_rate;
			//$(self.draw_canvas).width(width);
			//$(self.draw_canvas).height(height);
			if(self.image_qu[self.pageNum]){
				self.draw_ctx.drawImage(self.image_qu[self.pageNum], 0, 0, width, height);
			}
			$('#goto_page').val(self.pageNum);
			if(self.pdf_timer){
				clearTimeout(self.pdf_timer);
			}
			self.pdf_timer = setTimeout("org.goorm.core.pdf_viewer.renderPage("+self.pageNum+", "+self.scale+")", 200);
		}
		
	},
	goto_page : function(flag){
		var self = this;
		if(pdfDoc){
			var content = $('#goto_page').val();
			if(content && content != ''&& content != self.pageNum){
				if(content > pdfDoc.numPages){
					alert.show(core.module.localization.msg["alert_page_over_required"]);
				}else{
					var msg_data = {channel:'pdf_viewer', msg:'jump', pageNum: content, workspace: core.user.workspace};
					if(flag){
						self.socket_mode(msg_data);
						//self.socket.emit('message', JSON.stringify(msg_data));
					}
					var dataURL =self.draw_canvas.toDataURL();
					var img = new Image;
					img.src = dataURL;
					self.image_qu[self.pageNum] = img;
					self.pageNum = content*1;
					self.erase_all();
					var width = self.original_size * self.scale;
					var height = self.original_size * self.scale / self.pdf_viewer_rate;
					//$(self.draw_canvas).width(width);
					//$(self.draw_canvas).height(height);
					if(self.image_qu[self.pageNum]){
						self.draw_ctx.drawImage(self.image_qu[self.pageNum], 0, 0, width, height);
					}
					if(self.pdf_timer){
						clearTimeout(self.pdf_timer);
					}
					self.pdf_timer = setTimeout("org.goorm.core.pdf_viewer.renderPage("+self.pageNum+", "+self.scale+")", 200);
					//self.renderPage(content, self.scale);
				}
			}	
		}
	},
	goNext : function() {
		var self = this;
		if(pdfDoc){
			if (self.pageNum >= pdfDoc.numPages)
				return;
			var dataURL =self.draw_canvas.toDataURL();
			var img = new Image;
			img.src = dataURL;
			self.image_qu[self.pageNum] = img;
			self.pageNum++;
			self.erase_all();
			//var width = self.original_size * self.scale;
			//var height = self.original_size * self.scale / self.pdf_viewer_rate;
			//$(self.draw_canvas).width(width);
			//$(self.draw_canvas).height(height);
			if(self.image_qu[self.pageNum]){
				var width = self.original_size * self.scale;
				var height = self.original_size * self.scale / self.pdf_viewer_rate;
				self.draw_ctx.drawImage(self.image_qu[self.pageNum], 0, 0, width, height);
			}
			$('#goto_page').val(self.pageNum);
			if(self.pdf_timer){
				clearTimeout(self.pdf_timer);
			}
			self.pdf_timer = setTimeout("org.goorm.core.pdf_viewer.renderPage("+self.pageNum+", "+self.scale+")", 200);
			//renderPage(pageNum, scale);	
		}
	},
	size_change : function(val){
		var self = this;
		self.scale += val;
		var width = self.original_size * self.scale;
		var height = self.original_size * self.scale / self.pdf_viewer_rate;
		$("#the-canvas").width(width);
		$("#the-canvas").height(height);
		var dataURL =self.draw_canvas.toDataURL();
		var img = new Image;
		img.src = dataURL;
		$(self.draw_canvas).width(width);
		$(self.draw_canvas).height(height);
		img.onload = function (){
			self.draw_ctx.canvas.width = width;
			self.draw_ctx.canvas.height = height;
			self.draw_ctx.strokeStyle = self.myctx.strokeStyle;
			self.draw_ctx.lineWidth = self.myctx.lineWidth;
			self.draw_ctx.drawImage(img, 0, 0, width, height);
		}
		if(pdfDoc){
			if(self.pdf_timer){
				clearTimeout(self.pdf_timer);
			}
			self.pdf_timer = setTimeout("org.goorm.core.pdf_viewer.renderPage("+self.pageNum+", "+self.scale+")", 300);
			//renderPage(pageNum, scale);	
		}
		if(self.layout_right_width >= $(self.canvas).width()){
			$(self.canvas).css('left', (self.layout_right_width + 20 - $(self.canvas).width())/2);
			$(self.draw_canvas).css('left', (self.layout_right_width + 20 - $(self.canvas).width())/2);
		}else if( $(self.canvas).position().left < (self.layout_right_width - $(self.canvas).width()) ){
			$(self.canvas).css("left", self.layout_right_width - $(self.canvas).width());
			$(self.draw_canvas).css('left', self.layout_right_width - $(self.canvas).width());
		}
		if(self.layout_right_height >=  $(self.canvas).height()-30){
			$(self.canvas).css('top', 30);
			$(self.draw_canvas).css('top', 30);
		}else if($(self.canvas).position().top < (self.layout_right_height - $(self.canvas).height())){
			$(self.canvas).css('top',self.layout_right_height - $(self.canvas).height());
			$(self.draw_canvas).css('top', self.layout_right_width - $(self.canvas).width());
		}

	},
	socket_event: function(){
		var self = this;
		var data, msg_data;
		self.socket.on('pdf_message', function(msg){
			msg = JSON.parse(msg);
			data = msg.data;
			switch(msg.msg){
				case "new_pdf" :
					self.set_url(msg.url);
				break;
				case "prev" :
					if(self.pageNum != msg.pageNum){
						$('#goto_page').val(msg.pageNum);
						self.goto_page(false);
					}
				break;
				case "next" :
					if(self.pageNum != msg.pageNum){
						$('#goto_page').val(msg.pageNum);
						self.goto_page(false);
					}
				break;
				case "jump" :
					if(self.pageNum != msg.pageNum){
						$('#goto_page').val(msg.pageNum);
						self.goto_page(true);
					}
				break;
				case "paint":
					self.drawing(msg.data);
				break;
				case "erase":
					self.erase(msg.data);
				break;
				case "erase_all":
					self.erase_all();
				break;
				case "data_return" :
					self.returned = true;
					self.image_url = data.image;
					//self.image_qu[data.page_num] = data.image;
					self.set_url(data.url, data.page_num);
				break;
			}
		});
		var workspace = core.status.current_project_path
		self.author = workspace.split('_');
		self.author = self.author[0];
		if(core.user.id == self.author){
			self.socket.on('pdf_connect', function(msg){
				msg = JSON.parse(msg);
				if(self.url != null){
					var dataURL =self.draw_canvas.toDataURL();
					var data = {
						url: self.url,
						page_num: self.pageNum,
						image: dataURL
					};
					msg_data = {
						channel: "pdf_viewer",
						msg: "data_return",
						data: data,
						workspace: core.user.workspace,
						receiver: msg.socket_id
					};
					self.socket.emit('message',JSON.stringify(msg_data));	
				}
				
			});
		}
	},
	make_draw: function(){

		var self = this, current_mode = "moving", moving = false, before_pos = {}, position, top = 0, left = 0;
		var x, y, x_from, y_from, mouseState = 0;
		self.image_qu = [];
		self.erase_size = 20;
		self.draw_canvas = document.getElementById('the_draw_canvas');
		self.draw_ctx = self.draw_canvas.getContext('2d');
		self.myctx.strokeStyle = "#FF0000";
		self.myctx.lineWidth = 3;
		self.connected = false;

		var images = $("#draw_control_bt_container .not_active");
		
		var real_eraser = $("#pdf_real_eraser");
		real_eraser.attr('tabIndex', -1);
		$(self.draw_canvas).css('outline', 'none');
		$(self.draw_canvas).on("keydown", function(e){
			if(e.which == 107){
				self.size_change(0.1);
			}else if(e.which == 109){
				self.size_change(-0.1);
			}
		});
		$("#pdf_draw_bt").on('click', function(){
			if(!self.draw_mode){
				$(this).addClass("slide_button_pressed")
				$("#the_draw_canvas").css("z-index", 3);
				self.draw_mode = true;
				images.removeClass("not_active");
			}else{
				$(this).removeClass("slide_button_pressed");
				$("#pdf_pen_bt").removeClass("slide_button_pressed");
				$("#pdf_erase_bt").removeClass("slide_button_pressed");
				$("#pdf_brush_container").hide();
				$("#pdf_palette_container").hide();
				current_mode = "moving";
				$("#the_draw_canvas").css("z-index", 1);
				self.draw_mode = false;
				images.addClass("not_active");
			}
		});
		$("#pdf_pen_bt").on('mousedown', function(){
			if(!self.draw_mode){
				return;
			}
			
			if(current_mode == "paint"){
				$(this).removeClass("slide_button_pressed");
				current_mode = "moving";
			}else{
				$(self.draw_canvas).css("cursor", "default");
				$(this).addClass("slide_button_pressed");
				$("#pdf_erase_bt").removeClass("slide_button_pressed");
				current_mode = "paint";
			}
		});
		$("#pdf_erase_bt").on('mousedown', function(){
			if(!self.draw_mode){
				return;
			}

			if(current_mode == "erase"){
				$(this).removeClass("slide_button_pressed");
				current_mode = "moving";
			}else{
				$(self.draw_canvas).css("cursor", "default");
				$(this).addClass("slide_button_pressed");
				$("#pdf_pen_bt").removeClass("slide_button_pressed");
				current_mode = "erase";
			}
		});
		$("#pdf_connect_bt").on('click', function(){
			var __self = this;

			if(!$(this).hasClass("slide_button_pressed")){
				$(this).addClass("slide_button_pressed");
				self.connected = true;
				self.socket_event();
				
				var msg_data = {channel:'pdf_viewer', msg:'connect', workspace: core.user.workspace};
				if(core.user.id != self.author){
					self.socket.emit("message",JSON.stringify(msg_data));
				}

				var language = core.module.localization.language;
				var connect_title = core.module.localization.language_data[language].menu.pdf.children.connect.value;

				$(this).find('div').removeClass('pdf_viewer-toolbar-disconnect');
				$(this).attr('tooltip', 'connect').find('div').addClass('pdf_viewer-toolbar-connect');

				setTimeout(function(){
					$(__self).attr('title', connect_title);
				}, 500);
			}else{
				$(this).removeClass("slide_button_pressed");

				self.connected = false;
				self.socket.removeAllListeners('pdf_message');
				self.socket.removeAllListeners('pdf_connect');

				var language = core.module.localization.language;
				var disconnect_title = core.module.localization.language_data[language].menu.pdf.children.disconnect.value;

				$(this).find('div').removeClass('pdf_viewer-toolbar-connect');
				$(this).attr('tooltip', 'disconnect').find('div').addClass('pdf_viewer-toolbar-disconnect');

				setTimeout(function(){
					$(__self).attr('title', disconnect_title);
				}, 500);
			}
		});
		$(self.draw_canvas).on('mousedown', function (e) {
			$("#pdf_brush_container").hide();
			$("#pdf_palette_container").hide();
			$("#pdf_brush_size_bt").removeClass('slide_button_pressed');
			$("#pdf_palette_bt").removeClass('slide_button_pressed');
			if(current_mode == "moving"){
				moving = true;
				before_pos.left = e.clientX;
				before_pos.top = e.clientY;

		  		$(this).css("cursor", "grabbing");
		  		$(this).css("cursor", "-moz-grabbing");
		  		$(this).css("cursor", "-webkit-grabbing");
			}else if(current_mode=='erase'){
				moving = true;
				$(this).css('cursor', 'none');
				$('#pdf_real_eraser').show();
				//self.draw_canvas('erase');
			}else if(current_mode=='paint'){
				moving = true;
				$(this).css('cursor', 'crosshair');

				//self.draw_canvas('paint');
			}
		}).on('mouseup', function(e){
			moving = false;
			mouseState = 0;
			$(this).css("cursor", "default");
			real_eraser.hide();
		}).on('mouseleave', function(e){
			//mouseState = 0;
			//console.log('sibong');
			//$(self.draw_canvas).css('cursor', 'default');
			//$('#pdf_real_eraser').hide();
		}).on('mousemove', function(e){
			if(moving){
				switch(current_mode){
					case "moving":
						current_pos = $(this).position();
						if((left = current_pos.left + (e.clientX-before_pos.left))>0){
							left = 0;
						}
						if((top = current_pos.top + (e.clientY-before_pos.top))>0){
							top = 0;
						}
						//console.log(self.layout_right_width, $(this).width());
						if(self.layout_right_width < $(this).width()){
							if(left < (self.layout_right_width - $(this).width())){
								left = (self.layout_right_width - $(this).width());
							}	
						}else{

							left = (self.layout_right_width + 20 - $(this).width())/2;
						}
						if(self.layout_right_height <  $(this).height()-30){
							if(top < (self.layout_right_height - $(this).height())){
								top = (self.layout_right_height - $(this).height());
							}	
						}else{
							top = 30;
						}
						//console.log(top, left);
						$(this).css('left', left);
						$(this).css('top', top);
						$(self.canvas).css('left', left);
						$(self.canvas).css('top', top);
						before_pos.left = e.clientX;
						before_pos.top = e.clientY;
							//console.log(current_pos.x + (e.clientX-before_pos.x));
					break;
					case "paint":
						
						if (mouseState == 0) {
							mouseState = 1;
							x_from = e.offsetX //- position.left;
							y_from = e.offsetY// - position.top;
						}
						x = e.offsetX// - position.left;
						y = e.offsetY//- position.top;
						//console.log(x,y,e);
						data = {
							x : x/self.draw_canvas.width,
							y : y/self.draw_canvas.height,
							x_from : x_from/self.draw_canvas.width,
							y_from : y_from/self.draw_canvas.height,
							lineWidth : self.myctx.lineWidth/self.draw_canvas.width,
							color : self.myctx.strokeStyle
						};

						var msg_data = {channel:'pdf_viewer', msg:'paint', data: data, workspace: core.user.workspace};
						self.socket_mode(msg_data);
						//self.socket.emit('message', JSON.stringify(msg_data));
						self.drawing(data);
						x_from = x;
						y_from = y;
					break;
					case "erase":
						position = $(self.draw_canvas).position();
						real_eraser.css({ 'top' : (e.offsetY +15+ self.eraser_top + position.top), 'left' : (e.offsetX +20+ position.left)});
						//console.log(e.offsetX, e.offsetY, e.pageX, e.pageY, position)
						data = {
							//"channel" : "erase",
							//"workspace" : core.user.workspace,
							"x" : (e.offsetX+9)/self.draw_canvas.width,
							"y" : (e.offsetY+10)/self.draw_canvas.height,
							"erase_size" : self.erase_size,
							"relative_width" : self.draw_canvas.width,
							"relative_height" : self.draw_canvas.height
						};
						var msg_data = {channel:'pdf_viewer', msg:'erase', data: data, workspace: core.user.workspace};
						self.socket_mode(msg_data);
						//self.socket.emit('message', JSON.stringify(msg_data));
						self.erase(data);
						//self.socket_mode('slideshare',JSON.stringify(data));
					break;
					
				}
			}else if(current_mode == "moving"){
				$(this).css("cursor","pointer");
			}
		});

		var slider = new YAHOO.widget.Slider.getHorizSlider("pdf_sliderbg", "pdf_sliderthumb", 0, 200);
		slider.subscribe("slideEnd", function (){
			self.change_brush_thickness(slider.getValue());
		});

		slider.subscribe("change", function () {
		    $( "#pdf_brush_thickness" ).val(slider.getValue()/10 );
		});

		$('#close_pdf_palette').click(function(e){
			$("#pdf_palette_container").hide();
			$("#pdf_brush_size_bt").removeClass("slide_button_pressed");
			//$('a[action="slideshare_palette"]').find('div').removeClass('slide_button_pressed');
		});

		self.picker = new YAHOO.widget.ColorPicker("pdf_palette", {
			showhsvcontrols: false,
			showhexfcontrols: false,
			images: {
				PICKER_THUMB: "/images/org.goorm.core.collaboration/picker_thumb.png",
				HUE_THUMB: "/images/org.goorm.core.collaboration/hue_thumb.png"
			}
		});
		self.picker.setValue([255,0,0],false);
		self.picker.on("rgbChange", function(o) {
			self.change_color(o);
		});
		//pdf_palette_bt
		$("#pdf_brush_size_bt").click(function(){
			if(self.draw_mode){
				if($(this).hasClass('slide_button_pressed')){
					$(this).removeClass('slide_button_pressed');
				} else {
					$(this).addClass('slide_button_pressed');
				}
				$("#pdf_brush_container").toggle();
				$("#pdf_palette_bt").removeClass('slide_button_pressed');
				$("#pdf_palette_container").hide();
			}
		});
		$("#pdf_palette_bt").click(function(){
			if(self.draw_mode){
				if($(this).hasClass('slide_button_pressed')){
					$(this).removeClass('slide_button_pressed');
				} else {
					$(this).addClass('slide_button_pressed');
				}
				$("#pdf_palette_container").toggle();
				$("#pdf_brush_size_bt").removeClass('slide_button_pressed');
				$("#pdf_brush_container").hide();
			}
		})
		$("#pdf_erase_all_bt").off('click');
		$("#pdf_erase_all_bt").click( function(){
			if(self.draw_mode){
				self.erase_all();
				var msg_data = {channel:'pdf_viewer', msg:'erase_all', workspace: core.user.workspace};
				self.socket_mode(msg_data);				
			}
		});
	},
	change_brush_thickness: function (lineWidth) {
		var self = this;
		if (self.myctx != null){
			var line_width = lineWidth / 10;
			!(line_width) && (line_width = 0.1);

			self.myctx.lineWidth = line_width;
			$('#pdf_real_eraser').css({'width':lineWidth/3,'height':lineWidth/3});
			self.erase_size = lineWidth/3;
		}
	},
	drawing : function (data) {
		this.draw_ctx.lineCap = 'round';
		this.draw_ctx.lineJoin = "round";
		this.draw_ctx.beginPath();
		this.draw_ctx.lineWidth = data.lineWidth*this.draw_canvas.width;
		this.draw_ctx.strokeStyle = data.color;
		this.draw_ctx.moveTo(data.x_from * this.draw_canvas.width, data.y_from * this.draw_canvas.height);
		this.draw_ctx.lineTo(data.x * this.draw_canvas.width, data.y * this.draw_canvas.height);
		this.draw_ctx.closePath();
		this.draw_ctx.stroke();
		//console.log(data.x_from * this.draw_canvas.width, data.y_from * this.draw_canvas.height, data.x * this.draw_canvas.width, data.y * this.draw_canvas.height);
	},
	
	erase : function (data) {
		this.draw_ctx.beginPath();
		this.draw_ctx.clearRect( data.x * this.draw_canvas.width, data.y * this.draw_canvas.height, data.erase_size * this.draw_canvas.width / data.relative_width, data.erase_size * this.draw_canvas.height/data.relative_height);
		this.draw_ctx.closePath();
	},
	erase_all : function () {
		if(this.draw_ctx){
			this.draw_ctx.beginPath();
			this.draw_ctx.clearRect( 0, 0, this.draw_ctx.canvas.width, this.draw_ctx.canvas.height);
			this.draw_ctx.closePath();
		}
	},
	change_color: function(data){
		function colorToHex (color) {
			var red = color[0];
			var green = color[1];
			var blue = color[2];

			var rgb = blue | (green << 8) | (red << 16);
			return '#' + rgb.toString(16);
		}

		this.myctx.strokeStyle = colorToHex(data.newValue);
	},
	socket_mode: function(object){
		var self = this;
		if(core.user.id == self.author){
			self.socket.emit("message", JSON.stringify(object));
		}
	}
}