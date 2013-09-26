/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false */
/*jshint unused: false */



org.goorm.core.edit.font_manager = function (){
    this.max_font_size = 40;
    this.min_font_size = 11;
    this.font_size=11;
    this.break_font_size = 11;
    this.target;
    this.__target;
    this.editor;
    this.now_zoom = 1;
    this.now_margin_top = -2;
    this.now_margin_left = -3;
    this.gutters_width = null;
    
};

org.goorm.core.edit.font_manager.prototype = {

    init : function(parent){
        this.parent = parent;

        this.target = this.parent.target;
        this.__target = $(this.target);

        this.editor = this.parent.editor;
        this.gutters_width = parseFloat($('.CodeMirror-gutter', this.__target).css('width'));

        this.init_key_event();
    },

    init_key_event: function() {
        var self = this;

        // font size scaling
        this.__target.off('mousewheel');
        this.__target.on('mousewheel', function (e, delta) {
            if (e.shiftKey || e.ctrlkey || e.metaKey) {
                self.parent.font_size = self.refresh(self.parent.font_size + delta);
            }
        });
    },

    /* font size scaling */
    resize : function(delta){
        var self = this;
        var __target = $(self.target);

        var resize_target = function(target, whichcss, default_value){
            var target_cm = $(target, __target);
            if (!target_cm || !target_cm.css(whichcss))
                return null;


            var vv = default_value;
            vv = parseInt(vv, 10);
            vv += parseInt(delta, 10);

            target_cm.css(whichcss, vv + 'px');
        }

        var resize_width = function(target, default_value){
            var target_cm = $(target,__target);

            var vv = default_value;
            vv = parseInt(vv);
            vv += parseInt(delta, 10);

            target_cm.css('width', vv);
        }

        // image size scaling
        //
        var resize_background_image = function(target) {
            var container = $(self.target);
            var __target = container.find(target);
            if(__target.length != 0) {
                self.now_zoom=1+(0.05*delta);
                self.now_margin_top = -2+(0.1*delta);
                self.now_margin_left = -3+(0.1*delta);

                __target.css('zoom', self.now_zoom).css('margin-top', self.now_margin_top + 'px').css('margin-left', self.now_margin_left + 'px');
            }
        }

        resize_target('.CodeMirror', 'font-size', 11);  
        resize_target('.breakpoint', 'font-size', 11);  

        //resize_target('.CodeMirror-gutter-elt', 'height', 14);  
        //resize_target('.CodeMirror', 'line-height');  
        $('.CodeMirror').css('line-height', parseFloat(self.parent.line_spacing/10 + 1 ));


        resize_width('.CodeMirror-gutter.fold', 20);    
        resize_width('.CodeMirror-gutter.breakpoint', 18);  

        resize_background_image('div.folding_icon_minus');
        resize_background_image('div.folding_icon');

        window.setTimeout(function(){
            self.user_cursor_resize(delta)
            var percent = (self.font_size * 100 / 11).toFixed(1);
            __target.parent().parent().find('span.zoom_percent').text(percent+'%')
        }, 100)
    },

    user_cursor_resize : function(delta) {
        var container = $(self.target);
        var code_mirror = ('div.CodeMirror', container);
        var cursors = container.find('.user_cursor');
        if( cursors.length !=0 ) {
            for(var i = 0; i<cursors.length; i++) {
                var cursor = cursors[i];
                var target_id = $(cursor).attr('class').split(' ')[0].replace('user_cursor', 'user_name') // user_cursor_[ID]
                var user_name = $('.'+target_id);

                var line = $(cursor).attr('line');
                var ch = $(cursor).attr('ch');

                var coords = self.editor.charCoords({line:line, ch:ch});
                var scroll = self.editor.getScrollInfo();

                var top = parseInt(coords.top, 10) - parseInt(code_mirror.offset().top, 10) + scroll.top;
                var left = parseInt(coords.left, 10) - parseInt(code_mirror.offset().left, 10)  + scroll.left;

                var fs = 11+delta;
                //parseInt($(user_name).css('font-size').replace('px', ""), 10) + delta;
                var height = 14+delta;
                //parseInt($(user_name).css('height').replace('px', ""), 10) + delta;

                $(user_name).css('top', (top-8)+'px').css('left', (left+5)+'px').css('font-size', fs+'px').css('height', height+'px');
                $(cursor).css('top', (top)+'px').css('left', (left)+'px');
            }
        }
    },

    refresh : function(font_size){
        var self = this;

        //var __target = $(self.target);


        if(!font_size) font_size = self.font_size;
        if(font_size < this.min_font_size) font_size = this.min_font_size;
        if(font_size > this.max_font_size) font_size = this.max_font_size;

        var delta = font_size - 11;

        self.font_size = font_size;
        self.resize(delta);
        self.editor.refresh();

        return self.font_size;
    }
};
