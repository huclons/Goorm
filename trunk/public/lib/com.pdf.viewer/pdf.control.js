(function controller_wrapper(){

	var layout_manager = (function layout_manager_closure() {
		var layout_manager = function(parent, args) {
			this.parent = parent;

			this.container = args.container;
			this.source = args.source;

			this.__CANVAS_ID = 'the-canvas';
			this.__DRAW_CANVAS_ID = 'the_draw_canvas';

			this.__CANVAS_CONTAINER = 'pdf_canvas_container';
			this.__PALETTE_CONTAINER = 'pdf_palette_container';
			this.__BRUSH_CONTAINER = 'pdf_brush_container';
			this.__REAL_ERASER = 'pdf_real_eraser';

			this.__CONTROL_CONTAINER = 'pdf_control_bt_container';
			this.__DRAW_CONTAINER = 'draw_control_bt_container';

			this.layout = {
				'width': 0,
				'height': 0,
				'top': 0,
				'left': 0
			};

			this.scale = 1;
			this.rate = 1;
			this.pdf_viewer_size = null;
		}

		layout_manager.prototype = {
			'set_option': function(type, value) {
				this.args[type] = value;
			},

			'create': function() {
				var container = this.container;
				var source = this.source;

				if( source ) {
					$(container).append(source);
				}

				$('#'+this.__REAL_ERASER).attr('tabIndex', -1);
				$('#'+this.__DRAW_CANVAS_ID).css('outline', 'none');
			},

			'resize': function(width, height) {
				this.layout.width = width;
				this.layout.height = height;

				var docs = this.parent.manager.docs;

				var canvas = $("#"+this.__CANVAS_ID);
				var draw_canvas = $("#"+this.__DRAW_CANVAS_ID);
				var canvas_container = $("#"+this.__CANVAS_CONTAINER);
				var control_container = $("#"+this.__CONTROL_CONTAINER);
				var brush_container = $('#'+this.__BRUSH_CONTAINER);
				var palette_container = $('#'+this.__PALETTE_CONTAINER);


				// CONTAINER
				//
				if(width < 505){
					canvas_container.css('top', 130);
					control_container.css("margin-left", (width-220)/2);
				}
				else{
					canvas_container.css('top', 95);
					control_container.css("margin-left", (width-450)/2);
				}

				brush_container.css("left", width - 290);
				palette_container.css("left", width - 337);

				// CANVAS
				//
				canvas.parent().css('width', width + 20).css('height', height);

				if( width >= canvas.width() ){
					this.layout.left = (this.layout.width + 20 - canvas.width()) / 2;

					canvas.css('left', this.layout.left);
					draw_canvas.css('left', this.layout.left);
				}
				if( height >=  canvas.height() ){
					this.layout.top = 30;

					canvas.css('top', this.layout.top);
					draw_canvas.css('top', this.layout.top);
				}

				// DOCS
				//
				docs.toolbar.erase.top = 90;
				
				if(width < 505){
					docs.toolbar.erase.top = 125;
				}
				
				docs.status.before_pos.left = 0;
				docs.status.before_pos.top = 0;
			}
		};

		return layout_manager;
	})();

	var socket_manager = (function socket_manager_closure() {

		var socket_manager = function(parent, socket) {
			this.parent = parent;
			this.socket = socket;
		};

		socket_manager.prototype = {
			connect: function() {
				this.socket = (this.socket) ? this.socket : io.connect();
			},

			disconnect: function() {
				if(this.socket) {
					this.socket.socket.disconnect();
				}
			},

			init: function() {
				var self = this;

				this.socket.on('pdf_message', function(msg){
					var message = JSON.parse(msg);
					var data = message.data;

					self.receive(message, data);
				});

				this.socket.on('pdf_connect', function(msg){
					var workspace = core.status.current_project_path
					var author = workspace.split('_')[0];

					if( core.user.id == author ) {
						msg = JSON.parse(msg);

						var url = self.parent.url;
						var page = self.parent.manager.docs.toolbar.page.current;

						if(url != null){
							var dataURL = self.parent.manager.docs.draw_canvas.toDataURL();

							var data = {
								url: url,
								page_num: page,
								image: dataURL
							};

							msg_data = {
								channel: "pdf_viewer",
								msg: "data_return",
								data: data,
								workspace: core.status.current_project_path,
								receiver: msg.socket_id
							};

							self.socket.emit('message', JSON.stringify(msg_data));	
						}
					}
				});
			},

			send: function(options) {
				var workspace = core.status.current_project_path
				var author = workspace.split('_')[0];

				if( core.user.id == author) {
					this.socket.emit('message', JSON.stringify(options));
				}
			},

			receive: function(message, data) {
				var mode = message.msg;
				var docs = this.parent.manager.docs;

				var toolbar = this.parent.manager.docs.toolbar;
				var current_page = toolbar.page.current;

				switch( mode ) {
					case "new_pdf" :
						this.parent.set_url(message.url);
						break;

					case "prev" :
						if(current_page != message.pageNum){
							toolbar.page.go({
								'page' : message.pageNum,
								'share' : false
							});
						}
						break;

					case "next" :
						if(current_page != message.pageNum){
							toolbar.page.go({
								'page' : message.pageNum,
								'share' : false
							});
						}
						break;

					case "jump" :
						if(current_page != message.pageNum){
							toolbar.page.go({
								'page' : message.pageNum,
								'share' : true
							});
						}
						break;

					case "paint":
						docs.__drawing(data);
						break;

					case "erase":
						toolbar.erase.point(data);
						break;

					case "erase_all":
						toolbar.erase.all();
						break;

					case "data_return":
						this.parent.manager.docs.status.returned = true;
						this.parent.manager.docs.toolbar.page.image.url = data.image;

						this.parent.set_url(data.url, data.page_num);
						break;

					default:
						break;
				}
			}
		};

		return socket_manager;
	})();

	var module_manager = {};
	module_manager.page = function(docs) {
		this.docs = docs;  // document_manager
		this.parent = docs.parent; // pdf_viewer

		this.canvas = this.docs.canvas;
		this.draw_canvas = this.docs.draw_canvas;

		this.ctx = this.docs.ctx;
		this.draw_ctx = this.docs.draw_ctx;

		this.current = 1;
		this.image = {
			'url': null,
			'queue': []
		}
	};

	module_manager.page.prototype = {
		'go' : function(options) {
			var self = this;

			var __page = options.page;
			var __share = options.share || false;

			var socket = this.parent.manager.socket;
			var layout = this.parent.manager.layout;

			var pdf_doc = this.docs.pdf_doc;

			if(pdf_doc){
				if(__page && __page !== "" && __page !== this.current){

					if(__page <= pdf_doc.numPages){
						// socket
						//
						if( __share ) {
							socket.send({
								'channel': 'pdf_viewer',
								'msg': 'jump',
								'pageNum': __page,
								'workspace': core.status.current_project_path
							});
						}

						// old image save
						//
						var url = this.draw_canvas.toDataURL();
						this.save(this.current, url);

						// page update
						//
						this.current = __page;

						// erase_all
						//
						this.docs.toolbar.erase.all();

						// canvas update
						//
						var width = layout.pdf_viewer_size * layout.scale;
						var height = layout.pdf_viewer_size * layout.scale / layout.rate;

						if(this.image.queue[__page]){
							this.draw_ctx.drawImage(this.image.queue[__page], 0, 0, width, height);
						}

						// render page
						//
						setTimeout(function(){
							self.render(__page, layout.scale);
						}, 200);
					}
				}	
			}
		},

		// img save
		//
		'save': function(page, url) {
			var img = new Image;
			img.src = url;

			this.image.queue[page] = img;
		},

		// img load
		//
		'load': function(canvas, ctx, width, height) {
			var self = this;
			var url = canvas.toDataURL();

			var img = new Image;
			img.src = url;

			img.onload = function (){
				ctx.canvas.width = width;
				ctx.canvas.height = height;

				ctx.strokeStyle = self.docs.ctx_options.strokeStyle;
				ctx.lineWidth = self.docs.ctx_options.lineWidth;

				ctx.drawImage(img, 0, 0, width, height);
			}
		},

		'render' : function(__page, size, is_new) {
			var self = this;

			var layout = this.parent.manager.layout;
			var pdf_doc = this.docs.pdf_doc;

			// Using promise to fetch the page
			//
			pdf_doc.getPage(__page).then(function(pdf_viewer_page) {
				var viewport = pdf_viewer_page.getViewport(size);

				self.canvas.height = viewport.height;
				self.canvas.width = viewport.width;

				if(is_new){
					var width = $(".yui-layout-unit-right").find(".yui-layout-wrap").width();
					var height = $("#goorm_inner_layout_right").parent().height() - 90;

					// new layout size, rate, scale
					//
					layout.pdf_viewer_size = viewport.width;
					layout.rate = viewport.width / viewport.height;
					layout.scale = (width - 80) / layout.pdf_viewer_size;

					// canvas resize
					//
					var canvas_width = width - 80;
					var canvas_height = (width - 80) / layout.rate;

					$(self.canvas).css('margin-left', 10).addClass("canvas_shadow").width(canvas_width).height(canvas_height);
					$(self.draw_canvas).css('margin-left', 10).addClass("canvas_shadow").width(canvas_width).height(canvas_height);

					// new image load
					//
					if(self.draw_ctx){
						self.load(self.draw_canvas, self.draw_ctx, canvas_width, canvas_height);
					}
				
					// canvas resize
					//
					if(width >= $(self.canvas).width() ){
						$(self.canvas).css('left', (width - $(self.canvas).width())/2);
						$(self.draw_canvas).css('left', (width - $(self.canvas).width())/2);
					}

					if(height >=  $(self.canvas).height()-30){
						$(self.canvas).css('top', 30);
						$(self.draw_canvas).css('top', 30);
					}

					self.parent.manager.layout = layout;
				}

				if(self.docs.returned){
					self.docs.toolbar.erase.all();

					if(self.image.url){
						var width = layout.pdf_viewer_size * layout.scale;
						var height = layout.pdf_viewer_size * layout.scale / layout.rate;

						var img = new Image;
						img.src = self.image.url;

						img.onload = function(){
							self.draw_ctx.drawImage(img, 0, 0, width, height);	
						}
					}
					self.docs.returned = false;
				}

				// Render PDF page into canvas context
				//
				var renderContext = {
					canvasContext: self.docs.ctx,
					viewport: viewport
				};
				pdf_viewer_page.render(renderContext);
			});

			// Update page counters
			//
			$('#goto_page').val(__page);
			document.getElementById('page_count').textContent = pdf_doc.numPages;
		},

		'size_change': function(val) {
			var self = this;

			var layout = this.parent.manager.layout;
			var __layout = layout.layout;
			layout.scale += val;

			var width = layout.pdf_viewer_size * layout.scale;
			var height = layout.pdf_viewer_size * layout.scale / layout.rate;

			$(this.canvas).width(width).height(height);
			$(this.draw_canvas).width(width).height(height);

			if(this.draw_ctx) {
				this.load(this.draw_canvas, this.draw_ctx, width, height);
			}

			if(this.docs.pdf_doc){
				setTimeout(function(){
					self.render(self.current, layout.scale);
				}, 300);
			}

			// resize
			//
			if( __layout.width >= $(self.canvas).width() ){
				$(self.canvas).css('left', (__layout.width + 20 - $(self.canvas).width()) / 2);
				$(self.draw_canvas).css('left', (__layout.width + 20 - $(self.canvas).width()) / 2);
			}
			else if( $(self.canvas).position().left < (__layout.width - $(self.canvas).width()) ){
				$(self.canvas).css("left", __layout.width - $(self.canvas).width());
				$(self.draw_canvas).css('left', __layout.width - $(self.canvas).width());
			}

			if( __layout.height >=  $(self.canvas).height()-30){
				$(self.canvas).css('top', 30);
				$(self.draw_canvas).css('top', 30);
			}
			else if($(self.canvas).position().top < (__layout.height - $(self.canvas).height())){
				$(self.canvas).css('top', __layout.height - $(self.canvas).height());
				$(self.draw_canvas).css('top', __layout.width - $(self.canvas).width());
			}

			this.parent.manager.layout = layout;			
		},

		'init': function() {
			var self = this;

			$('#goto_page').on("keydown",function(e){
				if(e.which == 13){ // ENTER
					var __page = $('#goto_page').val();

					self.go({
						'page' : __page,
						'share' : true
					});
				}
			});

			$('#pdf_prev').on('click', function(){
				var __page = self.current;
				if(__page <= 1) return;

				self.parent.manager.socket.send({
					'channel': 'pdf_viewer',
					'msg': 'prev',
					'pageNum': __page - 1,
					'workspace': core.status.current_project_path
				});

				self.go({
					'page' : __page - 1
				});
			});

			$('#pdf_next').on('click', function(){
				var __page = self.current;
				if(__page >= self.docs.pdf_doc.numPages) return;

				self.parent.manager.socket.send({
					'channel': 'pdf_viewer',
					'msg': 'next',
					'pageNum': __page + 1,
					'workspace': core.status.current_project_path
				})

				self.go({
					'page' : __page + 1
				});
			});

			$("#magnify_pdf").on('click', function(){
				self.size_change(0.1);
			});
			
			$("#reduce_pdf").on('click', function(){
				self.size_change(-0.1);
			});
		}
	};

	module_manager.erase = function(docs) {
		this.docs = docs;  // document_manager
		this.parent = docs.parent; // pdf_viewer

		this.canvas = this.docs.canvas;
		this.draw_canvas = this.docs.draw_canvas;

		this.top = 90;
		this.size = 20;
		this.position = {};
	}

	module_manager.erase.prototype = {
		'init': function() {
			var self = this;

			$("#pdf_erase_bt").on('mousedown', function(){
				var status = self.docs.status;

				var draw_mode = status.draw_mode;
				if(!draw_mode) return;

				if(status.current_mode == "erase"){
					status.current_mode = "moving";

					$(this).removeClass("slide_button_pressed");
				}
				else{
					status.current_mode = "erase";

					$(this).addClass("slide_button_pressed");
					$("#pdf_pen_bt").removeClass("slide_button_pressed");

					$(self.draw_canvas).css("cursor", "default");
				}
			});

			$("#pdf_erase_all_bt").off('click');
			$("#pdf_erase_all_bt").click( function(){
				var status = self.docs.status;
				var draw_mode = status.draw_mode;

				if(draw_mode){
					self.all();

					if( status.connected ) {
						self.parent.manager.socket.send({
							'channel': 'pdf_viewer',
							'msg': 'erase_all',
							'workspace': core.status.current_project_path
						});
					}
				}
			});
		},
 
		'all': function() {
			var ctx = this.docs.draw_ctx;

			if (ctx){
				ctx.beginPath();
				ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.closePath();
			}
		},

		'point': function(data) {
			var ctx = this.docs.draw_ctx;
			var canvas = this.docs.draw_canvas;

			if (ctx){
				var x = data.x * canvas.width;
				var y = data.y * canvas.height;
				var width = data.erase_size * canvas.width / data.relative_width;
				var height = data.erase_size * canvas.height / data.relative_height;

				ctx.beginPath();
				ctx.clearRect( x, y, width, height);
				ctx.closePath();
			}
		},

		'move': function(e) {
			this.position = $(this.draw_canvas).position();

			var top = e.offsetY + 15 + this.top + this.position.top;
			var left = e.offsetX + 20 + this.position.left;

			$("#pdf_real_eraser").css('top', top).css('left', left);

			var data = {
				"x" : (e.offsetX+9) / this.draw_canvas.width,
				"y" : (e.offsetY+10) / this.draw_canvas.height,
				"erase_size" : this.size,
				"relative_width" : this.draw_canvas.width,
				"relative_height" : this.draw_canvas.height
			};

			if (this.docs.status.connected ) {
				this.parent.manager.socket.send({
					'channel': 'pdf_viewer',
					'msg': 'erase',
					'data': data,
					'workspace': core.status.current_project_path
				});
			}

			this.point(data);
		}
	}

	module_manager.slider = function(docs) {
		this.docs = docs;  // document_manager
		this.parent = docs.parent; // pdf_viewer

		this.canvas = this.docs.canvas;
		this.draw_canvas = this.docs.draw_canvas;

		this.__SLIDER_BG = 'pdf_sliderbg';
		this.__SLIDER_THUMB = 'pdf_sliderthumb';

		this.__PALETTE = 'pdf_palette';

		this.module = {
			'slider' : new YAHOO.widget.Slider.getHorizSlider(this.__SLIDER_BG, this.__SLIDER_THUMB, 0, 200),
			'picker' : new YAHOO.widget.ColorPicker("pdf_palette", {
				showhsvcontrols: false,
				showhexfcontrols: false,
				images: {
					PICKER_THUMB: "/images/org.goorm.core.collaboration/picker_thumb.png",
					HUE_THUMB: "/images/org.goorm.core.collaboration/hue_thumb.png"
				}
			})
		}
	}

	module_manager.slider.prototype = {
		'init' : function() {
			var self = this;

			var slider = this.module.slider;
			var picker = this.module.picker;

			slider.subscribe("slideEnd", function (){
				self.change_brush_thickness(slider.getValue());
			});

			slider.subscribe("change", function () {
			    $( "#pdf_brush_thickness" ).val(slider.getValue()/10 );
			});

			picker.setValue([255,0,0],false);
			picker.on("rgbChange", function(o) {
				self.change_color(o);
			});

			$("#pdf_brush_size_bt").click(function(){
				if(self.docs.status.draw_mode){
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
				if(self.docs.status.draw_mode){
					if($(this).hasClass('slide_button_pressed')){
						$(this).removeClass('slide_button_pressed');
					} else {
						$(this).addClass('slide_button_pressed');
					}
					$("#pdf_palette_container").toggle();
					$("#pdf_brush_size_bt").removeClass('slide_button_pressed');
					$("#pdf_brush_container").hide();
				}
			});

			$('#close_pdf_palette').click(function(e){
				$("#pdf_palette_container").hide();
				$("#pdf_palette_bt").removeClass("slide_button_pressed");
			});
		},

		'change_brush_thickness' : function(lineWidth) {
			var self = this;

			if (this.docs.ctx_options != null){
				var line_width = lineWidth / 10;
				!(line_width) && (line_width = 0.1);

				this.docs.ctx_options.lineWidth = line_width;				
				$('#pdf_real_eraser').css({'width':lineWidth/3,'height':lineWidth/3});

				this.docs.toolbar.erase.size = lineWidth/3;
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

			this.docs.ctx_options.strokeStyle = colorToHex(data.newValue);
		},
	}

	module_manager.mouse = function(docs) {
		this.docs = docs;  // document_manager
		this.parent = docs.parent; // pdf_viewer

		this.canvas = this.docs.canvas;
		this.draw_canvas = this.docs.draw_canvas;

		this.moving = false;
		this.state = 0;
		this.x = 0;
		this.y = 0;
		this.x_from = 0;
		this.y_from = 0;
	}

	module_manager.mouse.prototype = {
		'init': function() {
			var self = this;

			var __start_move = function(evt, e) {
				var layout = self.parent.manager.layout.layout;

				self.moving = true;

				self.docs.status.before_pos.left = e.clientX;
				self.docs.status.before_pos.top = e.clientY;

				$(evt).css("cursor", "grabbing");
				$(evt).css("cursor", "-moz-grabbing");
				$(evt).css("cursor", "-webkit-grabbing");
			}

			var __stop_move = function(evt, e) {
				self.moving = false;

				$(evt).css("cursor", "default");
			}

			var __move = function(evt, e) {
				if(self.moving) {
					var layout = self.parent.manager.layout.layout;
					var status = self.docs.status;

					status.current_pos = $(evt).position();

					layout.left = status.current_pos.left + (e.clientX - status.before_pos.left);
					layout.top = status.current_pos.top + (e.clientY - status.before_pos.top);

					if( layout.left > 0){
						layout.left = 0;
					}

					if( layout.top > 0){
						layout.top = 0;
					}

					if(layout.width < $(evt).width()) {
						var left = layout.width - $(evt).width();

						if(layout.left < left){
							layout.left = left;
						}
					}
					else{
						layout.left = (layout.width + 20 - $(evt).width()) / 2;
					}

					if(layout.height <  $(evt).height() - 30){
						var top = layout.height - $(evt).height();

						if(layout.top < top){
							layout.top = top;
						}	
					}
					else{
						layout.top = 30;
					}
					
					$(evt).css('left', layout.left);
					$(evt).css('top', layout.top);
					
					$(self.draw_canvas).css('left', layout.left);
					$(self.draw_canvas).css('top', layout.top);

					status.before_pos.left = e.clientX;
					status.before_pos.top = e.clientY;

					self.parent.manager.layout.layout = layout;
					self.docs.status = status;					
				}
				else{
					$(evt).css("cursor","pointer");
				}
			}

			$(window).on('mouseup', function(){
				self.moving = false;
				self.state = 0;
			});

			$(this.canvas).on('mousedown', function(e){
				__start_move(this, e);
			})
			.on('mouseup', function(e) {
				__stop_move(this, e);
			})
			.on('mousemove', function(e){
				__move(this, e);
			});

			$(this.draw_canvas).on('mousedown', function (e) {
				var layout = self.parent.manager.layout.layout;
				var status = self.docs.status;

				$("#pdf_brush_container").hide();
				$("#pdf_palette_container").hide();
				$("#pdf_brush_size_bt").removeClass('slide_button_pressed');
				$("#pdf_palette_bt").removeClass('slide_button_pressed');

				switch(status.current_mode) {
					case 'moving':
						__start_move(this, e);
						break;

					case 'erase':
						self.moving = true;
						$(this).css('cursor', 'none');
						$('#pdf_real_eraser').show();
						break;

					case 'paint':
						self.moving = true;
						$(this).css('cursor', 'crosshair');
						break;

					default:
						break;
				}
			})
			.on('mouseup', function(e){
				self.moving = false;
				self.state = 0;
				$(this).css("cursor", "default");
				$("#pdf_real_eraser").hide();
			})
			.on('mousemove', function(e){
				var layout = self.parent.manager.layout.layout;
				var status = self.docs.status;

				if(self.moving){
					switch(status.current_mode){
						case "moving":
							//__move(this, e);
							break;

						case "paint":
							if (self.state == 0) {
								self.state = 1;

								self.x_from = e.offsetX //- position.left;
								self.y_from = e.offsetY// - position.top;
							}

							self.x = e.offsetX// - position.left;
							self.y = e.offsetY//- position.top;

							var data = {
								'x' : self.x / self.draw_canvas.width,
								'y' : self.y / self.draw_canvas.height,
								'x_from' : self.x_from / self.draw_canvas.width,
								'y_from' : self.y_from / self.draw_canvas.height,
								'lineWidth' : self.docs.ctx_options.lineWidth / self.draw_canvas.width,
								'color' : self.docs.ctx_options.strokeStyle
							};

							if ( self.docs.status.connected ) {
								self.parent.manager.socket.send({
									'channel': 'pdf_viewer',
									'msg': 'paint',
									'data': data,
									'workspace': core.status.current_project_path
								})
							}

							self.docs.__drawing(data);

							self.x_from = self.x;
							self.y_from = self.y;
							break;

						case "erase":
							self.docs.toolbar.erase.move(e);
							break;
						
					}
				}
				else if(status.current_mode == "moving"){
					$(this).css("cursor","pointer");
				}
			});
		}
	}

	var document_manager = (function document_manager_closure() {
		var document_manager = function(parent) {
			this.parent = parent;

			this.pdf_doc = null;
			this.returned = false;
			this.status = {
				'before_pos': {},
				'current_pos': {},
				'current_mode': 'moving',
				'draw_mode': false,
				'connected': false
			};
			this.mouse = null;
			this.toolbar = {
				'page' : null,
				'erase' : null,
				'slider' : null
			};
			this.ctx_options = {
				strokeStyle : "#FF0000",
				lineWidth : 3
			}
		};

		document_manager.prototype = {
			'init': function() {
				var layout = this.parent.manager.layout;

				this.canvas = document.getElementById(layout.__CANVAS_ID);
				this.draw_canvas = document.getElementById(layout.__DRAW_CANVAS_ID);

				this.ctx = this.canvas.getContext('2d');
				this.draw_ctx = this.draw_canvas.getContext('2d');

				this.mouse = new module_manager.mouse(this);
				this.toolbar.page = new module_manager.page(this);
				this.toolbar.erase = new module_manager.erase(this);
				this.toolbar.slider = new module_manager.slider(this);

				this.init_event();

				this.mouse.init();
				this.toolbar.page.init();
				this.toolbar.erase.init();
				this.toolbar.slider.init();
			},

			'__drawing': function(data) {
				this.draw_ctx.lineCap = 'round';
				this.draw_ctx.lineJoin = "round";
				this.draw_ctx.beginPath();
				this.draw_ctx.lineWidth = data.lineWidth*this.draw_canvas.width;
				this.draw_ctx.strokeStyle = data.color;
				this.draw_ctx.moveTo(data.x_from * this.draw_canvas.width, data.y_from * this.draw_canvas.height);
				this.draw_ctx.lineTo(data.x * this.draw_canvas.width, data.y * this.draw_canvas.height);
				this.draw_ctx.closePath();
				this.draw_ctx.stroke();
			},

			'init_event': function() {
				var self = this;

				var images = $("#"+self.parent.manager.layout.__DRAW_CONTAINER+" .not_active");

				$(this.canvas).on("keydown", function(e){
					if(e.which == 107){ // +
						self.toolbar.page.size_change(0.1);
					}
					else if(e.which == 109){ // -
						self.toolbar.page.size_change(-0.1);
					}
				});

				$(self.draw_canvas).on('keydown', function(e){
					if(e.which == 107){ // +
						self.toolbar.page.size_change(0.1);
					}
					else if(e.which == 109){ // -
						self.toolbar.page.size_change(-0.1);
					}
				});

				$("#pdf_draw_bt").on('click', function(){
					var draw_mode = self.status.draw_mode;

					if(!draw_mode){
						$(this).addClass("slide_button_pressed");
						$(self.draw_canvas).css("z-index", 3);

						self.status.draw_mode = true;
						images.removeClass("not_active");
					}
					else{
						$(this).removeClass("slide_button_pressed");

						$("#pdf_pen_bt").removeClass("slide_button_pressed");
						$("#pdf_erase_bt").removeClass("slide_button_pressed");
						$("#pdf_brush_container").hide();
						$("#pdf_palette_container").hide();

						self.status.current_mode = "moving";
						$("#the_draw_canvas").css("z-index", 1);
						self.status.draw_mode = false;
						images.addClass("not_active");
					}
				});

				$("#pdf_pen_bt").on('mousedown', function(){
					var draw_mode = self.status.draw_mode;
					if(!draw_mode) return;
					
					if(self.status.current_mode == "paint"){
						$(this).removeClass("slide_button_pressed");
						self.status.current_mode = "moving";
					}
					else{
						$(self.draw_canvas).css("cursor", "default");
						$(this).addClass("slide_button_pressed");

						$("#pdf_erase_bt").removeClass("slide_button_pressed");
						self.status.current_mode = "paint";
					}
				});

				$("#pdf_connect_bt").on('click', function(){
					var __self = this;

					if(!$(this).hasClass("slide_button_pressed")){
						$(this).addClass("slide_button_pressed");

						self.status.connected = true;
						self.parent.manager.socket.init();
						
						var workspace = core.status.current_project_path
						var author = workspace.split('_')[0];

						if ( core.user.id != author ) {
							self.parent.manager.socket.socket.emit('message', JSON.stringify({
								'channel': 'pdf_viewer',
								'msg': 'connect',
								'workspace': core.status.current_project_path
							}));
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

						self.status.connected = false;
						self.parent.manager.socket.socket.removeAllListeners('pdf_message');
						self.parent.manager.socket.socket.removeAllListeners('pdf_connect');

						var language = core.module.localization.language;
						var disconnect_title = core.module.localization.language_data[language].menu.pdf.children.disconnect.value;

						$(this).find('div').removeClass('pdf_viewer-toolbar-connect');
						$(this).attr('tooltip', 'disconnect').find('div').addClass('pdf_viewer-toolbar-disconnect');

						setTimeout(function(){
							$(__self).attr('title', disconnect_title);
						}, 500);
					}
				});
			}
		};

		return document_manager;
	})();

	var pdf_viewer = (function pdf_viewer_closure() {

		// container : viewer_body
		//
		var pdf_viewer = function(options) {
			this.manager = {};
			this.url = null;
		};

		pdf_viewer.prototype = {
			'init': function(options, callback) {
				var socket = options.socket || null;
				var layout = options.layout;

				PDFJS.disableWorker = true;

				this.manager.socket = new socket_manager(this, socket);
				this.manager.socket.connect();

				this.manager.layout = new layout_manager(this, layout);
				this.manager.layout.create();

				this.manager.docs = new document_manager(this);
				this.manager.docs.init();
			},

			resize: function(width, height) {
				this.manager.layout.resize(width, height);
			},

			set_url : function(new_url, page){
				var self = this;

				var layout = this.manager.layout;
				var docs = this.manager.docs;

				var current_page = docs.toolbar.page.current;

				if(this.url == new_url){
					if(page && current_page != page){
						docs.toolbar.page.current = page;
						docs.toolbar.page.render(page, layout.scale, false);
					}
					else{
						docs.returned = false;	
					}

					return;
				}

				if(page){
					docs.toolbar.page.current = page;
				}
				else{
					docs.toolbar.page.current = 1;
				}

				this.url = new_url;

				this.manager.socket.send({
					'channel': 'pdf_viewer',
					'msg': 'new_pdf',
					'url': self.url,
					'workspace': core.status.current_project_path
				});

				docs.toolbar.page.image.queue = [];
				docs.toolbar.erase.all();

				PDFJS.getDocument(self.url).then(function getPdfHelloWorld(_pdfDoc) {
					docs.pdf_doc = _pdfDoc;
					docs.toolbar.page.render(docs.toolbar.page.current, layout.scale, true);
				});

				//check
				$("#replace_query_inputbox").hide();
				$("#search_query_inputbox").hide();
				$(".project_items").hide();
				$("#help_contents_middle").hide();
				$("#new_other_file").hide();
				$(".CodeMirror-vscrollbar").hide();
				$("#find_query_inputbox").hide();
			}
		};

		return pdf_viewer;
	})();

	PDFJS.controller = pdf_viewer;

}).call((typeof window === 'undefined') ? this : window);