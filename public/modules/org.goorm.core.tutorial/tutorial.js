/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

org.goorm.core.tutorial = new function () {
	var self = this;
	this.square = function($el){
		var el = $el;
		var width = el.outerWidth(),
			height = el.outerHeight(),
			border = 4;
		var top = $("<div>").width(width+border).height(border).addClass("tutorial-square")
				.position({of: el, my: "left bottom", at: "left top", collision: "none"}),
			bottom = $("<div>").width(width+border).height(border).addClass("tutorial-square")
				.position({of: el, my: "right top", at: "right bottom"}),
			left = $("<div>").width(border).height(height+border).addClass("tutorial-square")
				.position({of: el, my: "right bottom", at: "left bottom"}),
			right = $("<div>").width(border).height(height+border).addClass("tutorial-square")
				.position({of: el, my: "left top", at: "right top"});
		$("body").append(top).append(bottom).append(left).append(right);
	};

	this.init = function(){
		var seq = 0,
			dialogs = [],
			offset = null;
		var setButtonAction = function(target, square){
			if(!!square){
				self.square(target);
			}
			var dialog = this;
      		target.one("click", function(){
      			offset = $(dialog.element).offset();
      			dialogs[seq].panel.hide();
      			setTimeout(function(){
      				dialogs[++seq].panel.show();
      			}, 100);
      			$(".tutorial-square").remove();
      		});
		};
		var closeDialog = function(){
			this.hide();
			$(".tutorial-square").remove();
		};
		var defaultOptions = {
			title: "",
			path: "",
			width: 400, 
			height: 200, 
			modal: false, 
			opacity: true,
			fixedcenter: false
		};
		var clone = function(options){
			return $.extend({}, defaultOptions);
		};
		var get_highest_zindex = function(){
			var zindex = 10010;
			$(".mask").each(function(){
				if($(this).css("display") == "block") {
					zindex = $(this).css("z-index");
					return ;
				}
			});
			return zindex+2;
		};

		dialogs.push(new org.goorm.core.dialog().init($.extend(clone(defaultOptions), {
			title: "튜토리얼",
			path: "modules/org.goorm.core.tutorial/tutorial_intro.html",
			modal: true, height: 300, fixedcenter: true,
			buttons: [{
				text: "튜토리얼 시작",
				handler: function() {
					offset = $(this.element).offset();
			     	dialogs[++seq].panel.show();
			     	this.hide();
			    }, isDefault: true
			}, { text: "생략하기",	handler: closeDialog }],
			success: function () {
				this.panel.show();
			}
		})));

		dialogs.push(new org.goorm.core.dialog().init($.extend(clone(defaultOptions), {
			title: "새 프로젝트 만들기",
			path: "modules/org.goorm.core.tutorial/tutorial_step1.html",
			buttons: [{ text: "튜토리얼 종료",	handler: closeDialog }],
			success: function () {
				this.panel.subscribe("beforeShow", function(){
					this.cfg.setProperty("x", offset.left, false);
					this.cfg.setProperty("y", offset.top, false);
				});
				this.panel.subscribe("show", function(){
					var dialog = this;
					var target = $(".toolbar_button.new_project");
					setTimeout(function(){
						$(dialog.element).css('z-index', get_highest_zindex());
		      			setButtonAction.call(dialog, target, true);
		      		}, 100);
				});
			}
		})));

		dialogs.push(new org.goorm.core.dialog().init($.extend(clone(defaultOptions), {
			title: "프로젝트 예제 선택",
			path: "modules/org.goorm.core.tutorial/tutorial_step2.html",
			buttons: [{ text: "튜토리얼 종료",	handler: closeDialog }],
			success: function () {
				this.panel.subscribe("beforeShow", function(){
					this.cfg.setProperty("x", offset.left, false);
					this.cfg.setProperty("y", offset.top, false);
				});
				this.panel.subscribe("show", function(){
					var dialog = this;
					var target = $("#panelContainer_New_Project .yui-button:eq(1)");
		      		setTimeout(function(){
		      			$(dialog.element).css('z-index', get_highest_zindex());
		      			setButtonAction.call(dialog, target, true);
		      		}, 100);
				});
			}
		})));

		dialogs.push(new org.goorm.core.dialog().init($.extend(clone(defaultOptions), {
			title: "프로젝트 생성",
			path: "modules/org.goorm.core.tutorial/tutorial_step3.html",
			buttons: [{ text: "튜토리얼 종료",	handler: closeDialog }],
			success: function () {
				this.panel.subscribe("beforeShow", function(){
					this.cfg.setProperty("x", offset.left, false);
					this.cfg.setProperty("y", offset.top, false);
				});
				this.panel.subscribe("show", function(){
					var dialog = this;
					var target = $("#panelContainer_New_Project .yui-button:eq(2)");
		      		setTimeout(function(){
		      			$(dialog.element).css('z-index', get_highest_zindex());
		      			target.one("click", function(){
		      				offset = $(dialog.element).offset();
			      			$(core).one("on_project_open", function(){
			      				dialogs[seq].panel.hide();
				      			dialogs[++seq].panel.show();
				      		});
			      		});
		      		}, 100);
				});
			}
		})));

		dialogs.push(new org.goorm.core.dialog().init($.extend(clone(defaultOptions), {
			title: "프로젝트 생성 완료",
			path: "modules/org.goorm.core.tutorial/tutorial_step4.html",
			buttons: [{ text: "튜토리얼 종료",	handler: closeDialog }],
			success: function () {
				this.panel.subscribe("beforeShow", function(){
					this.cfg.setProperty("x", offset.left, false);
					this.cfg.setProperty("y", offset.top, false);
				});
				this.panel.subscribe("show", function(){
					var dialog = this;
					var target = $(".toolbar_button.run");
		      		setTimeout(function(){
		      			$(dialog.element).css('z-index', get_highest_zindex());
		      			setButtonAction.call(dialog, target, true);
		      		}, 100);
				});
			}
		})));

		dialogs.push(new org.goorm.core.dialog().init($.extend(clone(defaultOptions), {
			title: "프로젝트 실행 완료",
			path: "modules/org.goorm.core.tutorial/tutorial_step5.html",
			height: 250,
			buttons: [{ text: "튜토리얼 종료",	handler: closeDialog }],
			success: function () {
				this.panel.subscribe("beforeShow", function(){
					this.cfg.setProperty("x", offset.left, false);
					this.cfg.setProperty("y", offset.top, false);
				});
				this.panel.subscribe("show", function(){
					$(this.element).css('z-index', get_highest_zindex());
				});
			}
		})));
	};
};

$(function(){
	if (!core.class_mode) {
		$(core).one("goorm_login_complete", function(){
			core.module.layout.inner_layout.getUnitByPosition("right").collapse();
			core.module.layout.inner_layout.getUnitByPosition("bottom").collapse();

			org.goorm.core.tutorial.init();
		});
	}
});