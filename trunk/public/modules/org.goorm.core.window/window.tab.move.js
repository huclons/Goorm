/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false */
/*jshint unused: false */



org.goorm.core.window.tab.move = function () {
	this.config = {};
	this.prarent = null;
	this.ul_container = null;
	this.li_container = null;
};

org.goorm.core.window.tab.move.prototype = {
	init: function (parent) {
		this.parent = parent; // tab object
		this.tab_id = parent.tab_id;

		//this.bind();

		// Ver. JQuery-UI
		//
		var window_manager = core.module.layout.workspace.window_manager;
		var tab_container = window_manager.window_list_container + '_container';
		
		$('#'+tab_container).sortable({
			containment: "parent",
			axis: "x",
			tolerance: "pointer",
			start: function(evt, ui){
				var width = parseInt($(ui.helper).css('width').split('px')[0], 10) + 2;
				$(ui.helper).css('width', width+'px');
			},
			stop: function() {
				core.module.layout.workspace.window_manager.tab_manager.sort('window');	
			}
		});
	},

	// Ver. YUI
	//
	bind: function () {
		var self = this;

		var y_dom = YAHOO.util.Dom;
		var y_event = YAHOO.util.Event;
		var y_ddm = YAHOO.util.DragDropMgr;

		var window_manager = core.module.layout.workspace.window_manager;
		var tab_container = window_manager.window_list_container + '_container';

		var ddlist = function (id, sGroup, config) {
			this.cont = config.cont;
			ddlist.superclass.constructor.apply(this, arguments);

			var el = this.getDragEl();
			y_dom.setStyle(el, "opacity", 0.67);

			this.goingUp = false;
			this.lastY = 0;
		};

		YAHOO.extend(ddlist, YAHOO.util.DDProxy, {
			cont: null,
			init: function () {
				ddlist.superclass.init.apply(this, arguments);
				this.init_constraints();
			},

			init_constraints: function () {
				var __region = y_dom.getRegion(this.cont);
				var el = this.getEl();
				var xy = y_dom.getXY(el);

				var width = parseInt(y_dom.getStyle(el, 'width'), 10);
				var height = parseInt(y_dom.getStyle(el, 'height'), 10);

				var left = xy[0] - __region.left;
				var right = __region.right - xy[0] - width;

				var top = xy[1] - __region.top;
				var bottom = __region.bottom - xy[1] - height;

				self.config = {
					'width' : width,
					'height' : height,
					'left' : left,
					'right' : right,
					'top' : top,
					'bottom' : bottom,
					'min_left' : left + (width/3),
					'max_left' : left + (width*2)/3
				}

				this.setXConstraint(left, right);
				this.setYConstraint(0, 0);
			},

			startDrag: function () {
				var drag_el = this.getDragEl();
				var click_el = this.getEl();

				y_dom.setStyle(click_el, "visibility", "hidden");
				drag_el.innerHTML = click_el.innerHTML;
			},

			endDrag: function (e) {
				var src_el = this.getEl();
				var proxy = this.getDragEl();

				y_dom.setStyle(proxy, "visibility", "");
				var motion = new YAHOO.util.Motion(
					proxy, {
						'points': {
							to: y_dom.getXY(src_el)
						}
					},
					0.2,
					YAHOO.util.Easing.easeOut
				);

				var proxy_id = proxy.id;
				var this_id = this.id;

				motion.onComplete.subscribe(function () {
					y_dom.setStyle(proxy_id, 'visibility', 'hidden');
					y_dom.setStyle(this_id, 'visibility', '');

					$('#' + proxy_id).empty();
				});

				motion.animate();
				core.module.layout.workspace.window_manager.tab_manager.sort('window');
			},

			onDragDrop: function (e, id) {
				if (y_ddm.interactionInfo.drop.length === 1) {
					var pt = y_ddm.interactionInfo.point;
					var region = y_ddm.interactionInfo.sourceRegion;

					if (!region.intersect(pt)) {
						var dest_el = y_dom.get(id);
						var dest_dd = y_ddm.getDDById(id);

						dest_el.appendChild(this.getEl());
						dest_dd.isEmpty = false;

						y_ddm.refreshCache();
					}
				}
			},

			onDrag: function (e) {
				var y = y_event.getPageY(e);

				if (y < this.lastY) {
					this.goingUp = true;
				} else if (y > this.lastY) {
					this.goingUp = false;
				}

				this.lastY = y;
			},

			onDragOver: function (e, id) {
				var src_el = this.getEl();
				var dest_el = Dom.get(id);
				// var proxy_el = this.getDragEl();
				// var dest_el = get_el($(src_el).attr('id'), proxy_el);

				if (dest_el.nodeName.toLowerCase() == "li") {
					var p = dest_el.parentNode;

					if (this.goingUp) {
						p.insertBefore(src_el, dest_el); 
					} else {
						p.insertBefore(src_el, dest_el.nextSibling); 
					}

					y_ddm.refreshCache();
				}
			}
		});

		this.ul_container = new YAHOO.util.DDTarget(tab_container);
		this.li_container = new ddlist(this.tab_id, '', {
			'cont': tab_container
		});
	},

	// Ver.YUI
	//
	reset: function () {
		this.ul_container = null;
		this.li_container = null;

		this.bind();
	}
};