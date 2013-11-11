/**
 * Copyright Sung-tae Ryu. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * project_name : goormIDE
 * version: 1.0.0
 **/

/*jshint newcap:false, debug:true, unused: true, evil: true, devel: true, plusplus: false, browser: true, jquery: true, undef:false */
/*clientside jslint comment for global */
/*global org: false, core: false, YAHOO: false, CodeMirror: false, localStorage: false */
/*jshint unused: false */



org.goorm.core.edit = function () {
    this.target = null;
    this.editor = null;
    this.find_and_replace = null;
    this.filepath = null;
    this.filename = null;
    this.filetype = null;
    this.string_props = null;
    this.array_props = null;
    this.func_props = null;
    this.keywords = null;
    this.collaboration = null;
    this.theme = "elegant"; //"default", "neat", "elegant", "night", "cobalt"
    this.theme_cursor_highlight_color = "#e8f2ff !important;";
    this.mode = "htmlmixed";
    this.font_size = 11;
    this.indent_unit = 2;
    this.indent_with_tabs = true;
    this.show_line_numbers = true;
    this.first_line_number = 1;
    this.undo_depth = 40;
    this.scroll_top = 0;
    this.highlight_current_cursor_line = true;
    this.current_cursor_line = null; // for cursor line
    this.auto_close_brackets = true;

    //pcs
    this.str_selection = "";
    this.char_left = ""; // for Backspace
    this.char_right = ""; // for Del
    this.str_line = ""; // for Ctrl+D
    this.pressed_key = null;
    //pcs

    this.highlighted_line = null; // for debuging
    this.preference = null;
    this.context_menu = null;
    this.timestamp = null;
    this.fromCh = null;
    this.toCh = null;
    this.breakpoints = [];
    this.vim_mode = false;
    this.fold_func = null;

    this.history = null;
    this.history_ch = null;
    this.history_line = null;

    //auto-complete
    this.dictionary = null;
    //object explorer

    this.nowfont = 15;
    this.now_zoom = 1;
    //this.font_size_control=null;

    // error manager
    this.error_marker = [];
    this.init_change = false;
};

org.goorm.core.edit.prototype = {
    init: function (target, title, filepath, options) {
        var self = this;

        this.target = target;
        this.title = title;

        self.highlighted_qu = [];
        var enter_key = false; // onChange can't get enter_key

        

        this.preference = core.preference;

        this.dictionary = new org.goorm.core.edit.dictionary();
        this.jump_to_definition = new org.goorm.core.edit.jump_to_definition();
        this.font_manager = new org.goorm.core.edit.font_manager();
        this.timestamp = new Date().getTime();

       this.get_editor_style = function (type) {
            var preference_type = "preference.editor." + type;
            var style = options[type];

            if (style == "true") style = true;
            else if(style == "false") style = false;

            if (self.preference[preference_type] == "true") self.preference[preference_type] = true;
            else if (self.preference[preference_type] == "false") self.preference[preference_type] = false;

            return (style) ? style : ((self.preference[preference_type] !== undefined) ? self.preference[preference_type] : true);
        }

        this.highlight_current_cursor_line = this.get_editor_style('highlight_current_cursor_line');
        this.auto_close_brackets = this.get_editor_style('auto_close_brackets');

        var __target = $(target);

        __target.append("<textarea class='code_editor'>Loading Data...</textarea>");

        this.fold_func = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
        this.object_tree = new YAHOO.widget.TreeView("object_tree");

        this.editor = CodeMirror.fromTextArea($(target).find(".code_editor")[0], {
            /* CODEMIRROR 3.x IMPLEMENT */
            gutters: ["exception_error", "breakpoint", "CodeMirror-linenumbers", "fold"],
            highlightSelectionMatches: true,
            styleActiveLine: self.highlight_current_cursor_line,
            autoCloseBrackets: self.auto_close_brackets,
            autoCloseTags: true,
            /* CODEMIRROR 3.x IMPLEMENTEND */
            lineNumbers: true,
            lineWrapping: true,
            wordWrap: true,
            matchBrackets: true,
            extraKeys: {
                "Ctrl-Q": function (cm) {
                    self.fold(cm, cm.getCursor().line);
                    self.reset_breakpoints();
                },
                "Ctrl-Space": function (cm) {
                    switch (self.mode) {
                    case "text/javascript":
                        CodeMirror.showHint(cm, CodeMirror.javascriptHint);
                        break;
                    case "text/html":
                        CodeMirror.showHint(cm, CodeMirror.htmlHint);
                        break;
                    case "text/x-python":
                        // CodeMirror.showHint(cm, CodeMirror.pythonHint);
                        var cursor = cm.getCursor();
                        var token = cm.getTokenAt(cursor);
                        self.dictionary.search(token.string, "python", "");
                        self.dictionary.show(cm);
                        break;
                    case "application/xml":
                        CodeMirror.showHint(cm, CodeMirror.xmlHint);
                        break;
                    case "text/x-csrc":
                    case "text/x-c++src":
                        var cursor = cm.getCursor();
                        var token = cm.getTokenAt(cursor);
                        self.dictionary.search(token.string, "c", "");
                        self.dictionary.show(cm);
                        break;
                    case "text/x-java":
                        var cursor = cm.getCursor();
                        var token = cm.getTokenAt(cursor);

                        
                        if(token.string=="sysout"){
                            var from={};
                            var to={};
                            from.line=to.line=cursor.line;
                            from.ch=token.start;
                            to.ch=token.end;
                            cm.replaceRange("System.out.println();",from,to);
                            cm.setCursor({'line':cursor.line, 'ch':from.ch+19});
                            break;
                        }

                        var query = cm.getLine(cursor.line).substring(0, cursor.ch);

                        self.dictionary.search(token.string, "java", query);
                        self.dictionary.show(cm);
                        break;
                    }
                },
                "Shift-Ctrl-O": function (cm) {
                    switch (self.mode) {
                    case "text/x-java":
                        var cursor = cm.getCursor();

                        var postdata = {};
                        postdata.err_java_file = core.status.err_java_file;
                        postdata.missing_symbol = core.status.missing_symbol;
                        postdata.selected_file_path = core.module.layout.workspace.window_manager.active_filename;

                        if (!postdata.missing_symbol || postdata.missing_symbol.length === 0) break;
                        $.get('/edit/get_auto_import_java', postdata, function (data) {
                            if (data.last_package_def_sentence != -1) {

                                var start = data.last_package_def_sentence - 1;
                                var end = data.first_class_def_sentence - 1;

                                var add_statement_line = start;
                                for (var i = start; i <= end; i++) {
                                    if (cm.getLine(i) === "") {
                                        add_statement_line = i;
                                        break;
                                    }
                                }

                                if (add_statement_line == -1) add_statement_line = 0;
                                if (add_statement_line == end) {
                                    cm.setLine(end, "\n" + cm.getLine(end));
                                }
                                for (var i = 0; i < data.import_statement.length; i++) {
                                    cm.setLine(add_statement_line, cm.getLine(add_statement_line) + "\n" + (data.import_statement[i].content));

                                }
                                self.save(true, true);
                            }

                        });
                        break;
                    default:
                    }
                },
                "Shift-Ctrl-C": function (cm) {
                    var state = self.editor.options.autoCloseTags ? false : true;
                    self.editor.setOption("autoCloseTags", state);
                },
                "Shift-Tab": function (cm) {
                    cm.indentSelection("subtract");
                }
            },
            onKeyEvent: function (i, e) {
                var __target = $(self.target);

                if (e.type == "keydown") {
                    var only = !self.editor.somethingSelected();

                    if (e.keyCode == 8 && only) self.pressed_key = "backspace";
                    else if (e.keyCode == 46 && only) self.pressed_key = "del";
                    else if (e.keyCode == 68 && (e.ctrlKey || e.metaKey)) self.pressed_key = "ctrl+d";
                    else {
                        self.pressed_key = "other";
                        if (only) self.str_selection = self.char_right;
                        if (e.keyCode == 219) self.pressed_key = "{";
                    }

                    // 'ctrl + =' key bind
                    if ((e.keyCode == 187 || e.keyCode == 107) && (e.ctrlKey || e.metaKey)) {
                        self.font_size = self.font_manager.refresh(self.font_size+1);
                    } else if ((e.keyCode == 189 || e.keyCode == 109) && (e.ctrlKey || e.metaKey)) {
                        self.font_size = self.font_manager.refresh(self.font_size-1);
                    }
                }

                var dictionary_box = $('div.dictionary_box', __target);
                if (dictionary_box.css("display") == "block" && e.type == "keyup" && e.keyCode != 8 && e.keyCode != 32) {

                    var cursor = self.editor.getCursor();
                    var token = self.editor.getTokenAt(cursor);

                    self.dictionary.search(token.string);
                    self.dictionary.show(self.editor);
                }

                if (dictionary_box.css("display") == "block" && e.type == "keydown" && e.keyCode == 8) {
                    var cursor = self.editor.getCursor();
                    var token = self.editor.getTokenAt(cursor);

                    if (token && token.string.trim() !== "") {
                        token.string = token.string.slice(0, -1);

                        if (token.string == "") {
                            self.dictionary.hide();   
                        }
                        else {
                            self.dictionary.search(token.string);
                            self.dictionary.show(self.editor);
                        }
                    }
                    else {
                        self.dictionary.hide();   
                    }
                }

                if (e.type == "keydown" && e.keyIdentifier == "Enter") {
                    enter_key = true;
                    self.toCh = self.editor.getCursor(false);
                    self.fromCh = self.editor.getCursor(true);
                    return false;
                }

                if (e.ctrlKey || e.metaKey || e.altKey) {
                    if (e.keyCode != 67 && e.keyCode != 86 && e.keyCode != 88) {

                        var evt = $.Event('keydown');
                        evt.which = e.which;
                        evt.keyCode = e.keyCode;
                        evt.ctrlKey = e.ctrlKey;
                        evt.metaKey = e.metaKey;
                        evt.altKey = e.altKey;
                        evt.shiftKey = e.shiftKey;

                        $(document).trigger(evt);

                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                }
            }
        });

        self.font_manager.init(this);

        //for assistant authentic, also filepath
        self.window_manager = core.module.layout.workspace.window_manager;
        $(self.window_manager).trigger('window_open', {
            "filepath": filepath
        });

        $(target).mousedown(function (e) {
            self.dictionary.hide();
            var window_manager = core.module.layout.workspace.window_manager;
            window_manager.window[window_manager.active_window].activate();

            self.context_menu.menu.hide();

            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        this.set_dictionary();
        this.set_selected_variable();

        
        this.codemirror_events();
        

        

        this.error_manager.init(this);
        if (core.module.layout.history)
            this.history = core.module.layout.history;

        this.set_option();


        this.toggle_fullscreen_editing();

        $(target).keypress(function (e) {
            if (!(e.which == 115 && e.ctrlKey)) return true;
            self.save();
            e.preventDefault();
            return false;
        });

        $(core).on("on_preference_confirmed", function () {
            self.set_option();
        });


        this.context_menu = new org.goorm.core.menu.context();
        this.context_menu.init("configs/menu/org.goorm.core.edit/edit.context.html", "edit.context", this.target, this.timestamp, null, function () {
            core.module.action.init();
            if (!core.is_mobile) {
                core.module.localization.local_apply('[id="edit.context_' + self.timestamp + '"]', 'menu');
            }
        });

    },
     get_editor_idx : function(total_path){
        var window_manager = core.module.layout.workspace.window_manager;
        for(var i=0;i<window_manager.window.length;i++){
            if(window_manager.window[i].filepath+window_manager.window[i].filename == total_path)return i;
        }
        return -1;
    },
    codemirror_events: function () {
        var self = this;
        var cm_editor = this.editor;

        var __target = $(self.target);
        var dictionary_box = $('div.dictionary_box', self.target);
        var function_box = $('div.function_box', self.target);

        

        cm_editor.on("scroll", function (i, e) {
            if (dictionary_box.css("display") == "block") {
                self.dictionary.hide();
                self.editor.focus();
            }

            if (function_box.css("display") == "block") {
                self.jump_to_definition.hide();
                self.editor.focus();
            }

            var last_scroll_top = self.scroll_top;
            var scroll_top = $('.CodeMirror-scroll', __target).scrollTop();

            var changed_scroll_top_val = last_scroll_top - scroll_top;
            var cursors = $('span.user_cursor');

            for (var i = 0; i < cursors.length; i++) {
                var user_cursor = $(cursors[i]);

                var target_id = $(user_cursor).attr('class').split(' ')[0].replace('user_cursor', 'user_name'); // user_cursor_[ID]
                var user_name = $('.' + target_id);

                var user_cursor_top = parseInt(user_cursor.css('top').split('px')[0], 10);
                var user_name_top = parseInt(user_name.css('top').split('px')[0], 10);

                user_cursor.css('top', (user_cursor_top + changed_scroll_top_val) + 'px');
                user_name.css('top', (user_name_top + changed_scroll_top_val) + 'px');
            }

            self.font_manager.refresh();
            self.scroll_top = scroll_top;
        });
        cm_editor.on("change", function (i, e, a) {
            // i = CodeMirror object, e = change informations;
            if (self.editor.history_mode == "history") return;
            if (self.pressed_key == "backspace" || self.pressed_key == "{") {
                self.set_foldable(self.editor.getCursor().line);
            }

            

            var window_manager = core.module.layout.workspace.window_manager;
            var my_idx=self.get_editor_idx(self.filepath+self.filename);
            if(self.init_change && my_idx!=-1){
                window_manager.window[my_idx].set_modified();
                window_manager.tab[my_idx].set_modified();    
            }
            else {
                self.init_change = true;
            }
        });
        cm_editor.on("cursorActivity", function () {
            if (self.editor.history_mode == "history") return;

            //by sim
            if (!(self.editor.getCursor().line == self.history_line && self.editor.getCursor().ch == self.history_ch + 1)) {
                dictionary_box.hide();
            }
            //by sim

            self.history_ch = self.editor.getCursor().ch;
            self.history_line = self.editor.getCursor().line;

            __target.parent().parent().find(".ft .editor_message").html("Line: " + (parseInt(self.editor.getCursor().line, 10) + 1) + " | Col: " + self.editor.getCursor().ch);

            

            var cur = self.editor.getCursor();
            if (self.editor.somethingSelected()) self.str_selection = self.editor.getSelection();
            self.str_line = self.editor.getLine(cur.line);
            self.char_left = self.editor.getRange({
                line: cur.line,
                ch: cur.ch - 1
            }, cur);
            self.char_right = self.editor.getRange(cur, {
                line: cur.line,
                ch: cur.ch + 1
            });

            //pcs
            var window_manager = core.module.layout.workspace.window_manager;
            var wnd = window_manager.window[window_manager.active_window];
            if (wnd !== undefined) wnd.activate();
        });

        cm_editor.on("focus", function () {
            core.status.focus_on_editor = true;
            var window_manager = core.module.layout.workspace.window_manager;
            window_manager.window[window_manager.active_window].activate();
        });

        cm_editor.on("blur", function () {
            core.status.focus_on_editor = false;
        });

        cm_editor.on("gutterClick", function (codemirror, linenumber, gutter, clickevent) {
            var markerHtml;
            var info = codemirror.lineInfo(linenumber);
            self.editor.refresh();
            switch (self.mode) {
            case "text/x-csrc":
            case "text/x-c++src":
            case "text/x-java":
            case "text/x-python":
            case "text/javascript":
                //if breakpoint is needed, then add here

                if (gutter == "breakpoint" || gutter == "CodeMirror-linenumbers") {
                    markerHtml = "●";
                    cm_editor.setGutterMarker(linenumber, "breakpoint", (info.gutterMarkers && info.gutterMarkers.breakpoint) ? removeMarker(linenumber, "breakpoint") : makeMarker(linenumber, "breakpoint", markerHtml));
                } else if (gutter == "fold") {
                    self.fold(cm_editor, linenumber);
                }
                self.font_manager.refresh();
                // window.setTimeout(function(){},);
                break;
            default:
                break;
            }
            var window_manager = core.module.layout.workspace.window_manager;
            window_manager.window[window_manager.active_window].activate();
        });

        function makeMarker(linenumber, gutter, markerHtml) {
            var marker = document.createElement("div");
            marker.innerHTML = markerHtml;
            marker.className = gutter;
            marker.id = gutter + linenumber;
            $(marker).css("font-size", (self.nowfont) / 2);
            if (gutter == "breakpoint") {
                self.breakpoints = self.breakpoints.unique();
                self.breakpoints.push(linenumber);
            }
            return marker;
        }

        function removeMarker(linenumber, gutter) {
            if (gutter == "breakpoint") {
                var index = self.breakpoints.inArray(linenumber);
                self.breakpoints = self.breakpoints.unique();
                self.breakpoints.remove(index, index);
            }
        }

        cm_editor.on('update', function () {
            $('.CodeMirror-activeline-background').attr('style', self.theme_cursor_highlight_color);
            $(self).trigger('editor_update');
        });
    },

    fold: function (cm, linenumber) {
        var self = this;

        var line_handler = cm.getLineHandle(linenumber);
        var fold_marker = line_handler.gutterMarkers.fold;

        if (fold_marker) {
            var marker = document.createElement("div");
            var marker_class = ($(fold_marker).hasClass('folding_icon')) ? "folding_icon_minus" : "folding_icon";

            var width = $(fold_marker).css('width');
            var height = $(fold_marker).css('height');
            var margin_top = $(fold_marker).css('margin-top');
            var margin_left = $(fold_marker).css('margin-left');

            marker.className = marker_class;
            marker.style.width = width;
            marker.style.height = height;
            marker.style.zoom = self.now_zoom;
            marker.style.marginTop = margin_top;
            marker.style.marginLeft = margin_left;

            cm.setGutterMarker(linenumber, "fold", marker);
            this.fold_func(cm, linenumber);

            var get_marker = function () {
                return marker;
            };

            $('span.CodeMirror-foldmarker').mousedown(function () {
                var __target = $(get_marker());
                var marker = document.createElement("div");
                var marker_class = "folding_icon_minus";

                var width = __target.css('width');
                var height = __target.css('height');
                var margin_top = __target.css('margin-top');
                var margin_left = __target.css('margin-left');

                marker.className = marker_class;
                marker.style.width = width;
                marker.style.height = height;
                marker.style.zoom = self.now_zoom;
                marker.style.marginTop = margin_top;
                marker.style.marginLeft = margin_left;

                cm.setGutterMarker(linenumber, "fold", marker);
            });
        }
    },

    highlight_line: function (line) {
        if (typeof (line) == "string") line = parent(line);

        this.clear_highlight();
        this.highlighted_line = line;

        this.editor.addLineClass(line, "wrap", "highlight_line");
    },

    clear_highlight: function () {
        if (this.highlighted_line) {
            this.editor.removeLineClass(this.highlighted_line, "wrap", "highlight_line");
        }

        $(this.target).find(".CodeMirror-lines .highlight_line").removeClass("highlight_line");

        this.highlighted_line = null;
    },

    //MIAE
    set_foldable: function () {
        var self = this;
        var gutter = "fold";
        if (this.editor === null) return;

        if (arguments[0] !== undefined) {
            this.editor.setGutterMarker(arguments[0], gutter, (this.editor.getLine(arguments[0]).indexOf("{") > -1) ? makeMarker_fold() : null);
            return;
        }

        for (var linenumber = this.editor.getCursor().line; linenumber < this.editor.lineCount(); linenumber++) {
            var info = this.editor.lineInfo(linenumber);
            if (!info.gutterMarkers && this.editor.getLine(linenumber).indexOf("{") > -1 && !(this.editor.getLine(linenumber).indexOf("}") > -1)) {
                this.editor.setGutterMarker(linenumber, gutter, makeMarker_fold());
            } else if (info.gutterMarkers) {
                this.editor.setGutterMarker(linenumber, gutter, null);
            }
        }

        function makeMarker_fold() {
            var fold_marker = document.createElement("div");
            fold_marker.className = "folding_icon_minus";
            fold_marker.style.zoom = self.font_manager.now_zoom;
            // fold_marker.style.marginTop = self.font_manager.now_margin_top;
            // fold_marker.style.marginLeft = self.font_manager.now_margin_left;
            return fold_marker;
        }
    },

    //DEAD FUNC
    analyze: function () {
        var self = this;

        delete self.object_tree;
        self.object_tree = new YAHOO.widget.TreeView("object_tree");

        var root = self.object_tree.getRoot();

        var index = 1;
        var inspecting = true;
        var total_line = self.editor.lineCount();

        var position = self.editor.posFromIndex(index);
        var token = self.editor.getTokenAt(position);

        var inspecting_depth = 0;

        var current_parent = root;
        var past_parent = root;

        var nodes = [];

        while (inspecting) {

            if (token.string.replace(/ /g, "").replace(/\t/g, "").replace(/\n/g, "") !== "" && token.className != "comment") {
                if (token.className === null && (token.string == "=" || token.string == ":")) {
                    token.className = "assignment";
                }

                if (token.string.indexOf("{") > -1) {
                    token.className = "block_start";

                    past_parent = current_parent;
                    current_parent = nodes[nodes.length - 1];

                    inspecting_depth++;
                } else if (token.string.indexOf("}") > -1) {
                    token.className = "block_end";

                    current_parent = past_parent;

                    inspecting_depth--;
                }

                if (token.string.indexOf("(") > -1) {
                    token.className = "bracket_start";
                } else if (token.string.indexOf(")") > -1) {
                    token.className = "bracket_end";
                }

                if (token.className === null && token.string == "[") {
                    token.className = "square_bracket_start";
                } else if (token.className === null && token.string == "]") {
                    token.className = "square_bracket_end";
                }

                if (token.className === null && token.string == ",") {
                    token.className = "comma";
                }

                if (token.className === null && (token.string == "+" || token.string == "-" || token.string == "/" || token.string == "*" || token.string == "%" || token.string == "." || token.string == "++" || token.string == "--")) {
                    token.className = "operator";
                }

                if (token.className === null && (token.string == "==" || token.string == "!=" || token.string == "!" || token.string == "===" || token.string == "&&" || token.string == "||")) {
                    token.className = "logical_operator";
                }

                if (token.className === null && token.string == ";") {
                    token.className = "semicolon";
                }

                if (token.className == "variable" || token.className == "variable-2" || token.className == "block_start") {
                    var string = token.string;
                    if (token.className == "block_start") {
                        string = "<span class='block_start'></span>";
                    }

                    nodes.push(new YAHOO.widget.HTMLNode(string, current_parent, true));
                    nodes[nodes.length - 1].type = token.className;
                }

                if (token.className == "property") {
                    nodes[nodes.length - 1].html += "." + token.string;
                }

                if (token.className == "assignment") {
                    nodes[nodes.length - 1].html += " : ";
                }

                if (token.className == "bracket_start") {
                    nodes[nodes.length - 1].html += "<span style='color:red;'> <- </span>";
                }

                if (token.className == "keyword") {
                    nodes[nodes.length - 1].html += "<span style='color:purple;'>" + token.string + "</span>";
                }

                if (token.className == "string") {
                    nodes[nodes.length - 1].html += "<span style='color:gray;'>" + token.string + "</span>";
                }

                if (token.className == "atom") {
                    nodes[nodes.length - 1].html += "<span style='color:blue;'>" + token.string + "</span>";
                }

                if (token.className == "def") {
                    nodes[nodes.length - 1].html += " <span style='color:darkgray;'>" + token.string + "</span>";
                }
            }

            index += (token.end - token.start);

            if (token.end - token.start === 0) {
                index++;
            }

            position = self.editor.posFromIndex(index);
            token = self.editor.getTokenAt(position);

            if (position.line == total_line - 1 && position.ch == token.end) {
                inspecting = false;
            }
        }

        self.object_tree.render();
    },

    set_option: function (options) {
        var self = this;
        options || (options = {});
        this.font_size = (options.font_size) ? options.font_size : parseInt(this.preference["preference.editor.font_size"], 10);
        this.line_spacing = (options.line_spacing) ? options.line_spacing :this.preference["preference.editor.line_spacing"] ;
        this.indent_unit = (options.indent_unit) ? options.indent_unit : parseInt(this.preference["preference.editor.indent_unit"], 10);
        this.indent_with_tabs = (options.indent_with_tabs) ? options.indent_with_tabs : this.preference["preference.editor.indent_with_tabs"];
        this.show_line_numbers = (options.show_line_numbers) ? options.show_line_numbers : this.preference["preference.editor.show_line_numbers"];
        this.first_line_number = (options.first_line_number) ? options.first_line_number : parseInt(this.preference["preference.editor.first_line_number"], 10);
        this.undo_depth = (options.undo_depth) ? options.undo_depth : parseInt(this.preference["preference.editor.undo_depth"], 10);
        this.highlight_current_cursor_line = (options.highlight_current_cursor_line) ? options.highlight_current_cursor_line : this.preference["preference.editor.highlight_current_cursor_line"];
        this.theme = (options.theme) ? options.theme : this.preference["preference.editor.theme"];
        this.vim_mode = (options.vim_mode) ? options.vim_mode : false;


        this.auto_close_brackets = self.get_editor_style('auto_close_brackets');
        this.highlight_current_cursor_line = self.get_editor_style('highlight_current_cursor_line');
        this.editor.setOption("styleActiveLine", this.highlight_current_cursor_line);
        this.editor.setOption('autoCloseBrackets', this.auto_close_brackets);

        if (this.vim_mode) {
            this.editor.setOption("keyMap", "vim");
        }
        if (this.indent_unit !== undefined) {
            this.editor.setOption("indentUnit", this.indent_unit);
        }
        if (this.indent_with_tabs !== undefined) {
            this.editor.setOption("indentWithTabs", this.indent_with_tabs);
        }

        if (this.show_line_numbers !== undefined) {
            this.editor.setOption("lineNumbers", this.show_line_numbers);
        }
        if (this.first_line_number !== undefined || isNaN(this.first_line_number)) {
            this.editor.setOption("firstLineNumber", this.first_line_number);
        }
        if (this.undo_depth !== undefined || isNaN(this.undo_depth)) {
            this.editor.setOption("undoDepth", this.undo_depth);
        }
        if (this.theme !== undefined && this.theme != "default") {
            $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "/lib/net.codemirror.code/theme/" + this.theme + ".css").appendTo("head");

            var dark_themes = ['ambiance', 'blackboard', 'cobalt', 'erlang-dark', 'monokai', 'rubyblue', 'vibrant-ink', 'xq-dart', 'night'];
            if (dark_themes.indexOf(this.theme) > - 1) {
                this.theme_cursor_highlight_color = 'background-color:#eee8aa !important; opacity:0.3';
                $('.CodeMirror-activeline-background').attr('style', this.theme_cursor_highlight_color);
            }
            else {
                this.theme_cursor_highlight_color = 'background-color:#e8f2ff !important;';
                $('.CodeMirror-activeline-background').attr('style', this.theme_cursor_highlight_color);
            }

            this.editor.setOption("theme", this.theme);
        }
        if (this.theme == "default") {
            $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "/lib/net.codemirror.code/lib/codemirror.css").appendTo("head");

            this.theme_cursor_highlight_color = 'background-color:#e8f2ff !important;';
            $('.CodeMirror-activeline-background').attr('style', this.theme_cursor_highlight_color);

            this.editor.setOption("theme", this.theme);
        }

        setTimeout(function(){
            self.font_manager.refresh(self.font_size);

        }, 500);

        setTimeout(function(){
            self.font_manager.refresh(self.font_size);

        }, 1000);

    },

    set_selected_variable: function () {
        var self = this;

        var get_token_data = function (token, callback) {
            var workspace = core.status.current_project_path;
            var project_type = core.status.current_project_type;

            var postdata = {
                'token': token,
                'workspace': workspace
            };

            $.get('/edit/jump_to_definition', postdata, function (response) {
                if (response.result) {
                    callback(response.data);
                } else {
                    callback(null);
                }
            });
        };

        var editor_body = $('div.CodeMirror-sizer', self.editor.getWrapperElement());

        $(editor_body).find('span.cm-variable').off('hover');
        $(editor_body).on('hover', 'span.cm-variable', function (e) {
            var target = this;
            var variable = $('span.cm-variable', editor_body);

            if (e.ctrlKey || e.metaKey) {
                variable.removeClass('selected_variable');

                var token = $(target).html();
                get_token_data(token, function (data) {
                    if (data) {
                        $(target).addClass('selected_variable');
                    }
                });
            } else {
                variable.removeClass('selected_variable');
            }
        });

        $(editor_body).find('span.cm-variable').off('mousedown');
        $(editor_body).on('mousedown', 'span.cm-variable', function (e) {
            if ($(this).hasClass('selected_variable')) {
                var token = $(this).html();
                self.jump_to_definition.load(token);
            }
        });
    },

    load: function (filepath, filename, filetype, options) {
        var self = this;
        var options = options || {};
        var url = "file/get_contents";

        if (filetype == "url") {
            filename = "";
            url = "file/get_url_contents";
        }

        this.filepath = filepath;
        this.filename = filename;
        this.filetype = filetype;

        var i = 0;

        var temp_path = "";

        if (filetype == "url") {
            temp_path = filepath;
        } else {
            temp_path = filepath + "/" + filename;
        }

        var postdata = {
            path: temp_path,
            type: 'get_workspace_file'
        };

        var callback_wrapper= function(is_restore, restore_data){
            return function(data){
                if (data) self.editor.setValue(data);
                else{
                    if(data===false){
                        alert.show(core.module.localization.msg.alert_open_file_fail);
                    }
                    else{
                        self.editor.setValue("");  
                    }
                } 

                
                
                

                self.editor.clearHistory();

                self.set_foldable();

                if (filetype != "url") {
                    self.dictionary.init(self.target, self.editor, self.filetype);
                    self.jump_to_definition.init(self.target, self.editor);
                }
                if(!is_restore){
                    var window_manager = core.module.layout.workspace.window_manager;

                    window_manager.window[window_manager.active_window].set_saved();

                    window_manager.tab[window_manager.active_window].set_saved();
                }else{
                    try{
                        setTimeout(function(){
                            self.editor.setValue(restore_data);
                        }, 1000);
                    }catch(e){}
                }
                self.on_activated();

                $(core).trigger(filepath + '/' + filename + 'window_loaded');
            }
        }
       
        if(!options.restore)
            $.get(url, postdata, callback_wrapper(false,null) );
        else{
            var unsaved_data='';
            for(var i=0;i<org.goorm.core.edit.prototype.unsaved_data.length;i++){
                if(  org.goorm.core.edit.prototype.unsaved_data[i].filename==self.filename && org.goorm.core.edit.prototype.unsaved_data[i].filepath==self.filepath){
                    unsaved_data=org.goorm.core.edit.prototype.unsaved_data[i].data;
                    break;
                }
            }
            $.get(url, postdata, callback_wrapper(true, unsaved_data) );

        }
    },

    save: function (option, isBuilt) {
        var self = this;
        var url = "file/put_contents";
        var path = this.filepath + "/" + this.filename;
        var data = this.editor.getValue();
        var send_data = {
            path: path,
            data: data,
            filepath : this.filepath,
            filename : this.filename,
            project_path : path.split('/')[0]
        };

        var target_project_name = path.split("/")[0];
        var target_project_type;
        var tmpdata = core.workspace;

        if (core.status.current_project_path !== "") //project should be chosen in select box
        {
            if ($('[name="building_after_save_option"]:checked').length !== 0) {
                core.property.building_after_save_option = true;
                send_data.build = true;

                for (var name in tmpdata) {
                    if (target_project_name == name) {
                        target_project_type = tmpdata[name].type;
                        break;
                    }
                }
            } else {
                core.property.building_after_save_option = false;
                send_data.build = false;
            }
        }
        $.post('file/check_valid_edit',send_data,function(res){
            if(!res || !res.result){
                console.log('not vaild')
                alert.show(core.module.localization.msg.alert_save_file_fail);
                return false;
            }

            $.post(url, send_data, function (data) {

                

                if(data.err_code!==0){
                    //fail
                    console.log('fail');
                    alert.show(core.module.localization.msg.alert_save_file_fail);
                    return false;
                }

                var date = new Date();
                var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();



                //m.s("Save Complete! (" + time + ")", "editor");

                var window_manager = core.module.layout.workspace.window_manager;

                window_manager.window[window_manager.active_window].set_saved();
                window_manager.tab[window_manager.active_window].set_saved();

                if (option == "close") {
                    window_manager.window[window_manager.active_window].close();
                }
                //this is auto build after save
                if (core.status.current_project_path !== "") //project should be chosen in select box
                {
                    if (isBuilt && (core.property.building_after_save_option === true && core.status.current_project_path == target_project_name || (core.property.type == 'java' || core.property.type == 'java_examples'))) {
                        core.module.layout.terminal.status="build";

                        if (core.property.type == 'java') {
                            core.module.plugin_manager.plugins["org.goorm.plugin.java"].build(target_project_name, null, true, self.filename, self.target);

                            // output
                            core.module.layout.inner_bottom_tabview.selectTab(3);
                        } else if (core.property.type == 'java_examples') {
                            core.module.plugin_manager.plugins["org.goorm.plugin.java_examples"].build(target_project_name, null, true, self.filename, self.target);

                            // output
                            core.module.layout.inner_bottom_tabview.selectTab(3);
                        } else if (core.property.type == 'phonegap') {
                            core.module.plugin_manager.plugins["org.goorm.plugin.phonegap"].run(core.status.current_project_path);
                        } else
                            core.module.plugin_manager.plugins["org.goorm.plugin." + target_project_type].build(target_project_name);

                    }
                }
            });
        });

        //object explorer tab refresh when save file
        var current_file_type = core.module.layout.workspace.window_manager.active_filename.split('.').pop();

        //workspace project_path
        //project_type project_type
        var postdata={};
        postdata.workspace = self.filepath.split('/')[0];
        switch(current_file_type){
            case 'c':
            case 'cpp':
            case 'java':
            case 'py':
                $.post('/edit/save_tags', postdata, function (){
                    var active_file = core.module.layout.workspace.window_manager.active_filename;
                    var workspace = active_file.split('/')[0];
                    var path = active_file.split('/')
                    path.shift();
                    path = path.join('/');

                    $.get("edit/get_object_explorer", {
                        'path' : path,
                        'workspace' : workspace
                    }, function (data) {
                        console.log(data);

                        if(!data)return false;
                        if (data.err_code) {
                            switch (data.err_code) {
                                case 0:
                                    console.log('Object explorer parsing error');
                                    break;
                            }
                            return false;
                        }

                        core.module.layout.object_explorer.refresh('object_tree', data);
                    });
                });
                break;
            case 'html':
            case 'css':
                $.get("edit/get_object_explorer", {
                    'selected_file_path' : core.module.layout.workspace.window_manager.active_filename,
                    'filepath' : self.filepath
                }, function (data) {
                    if(!data)return false;
                    if (data.err_code) {
                        switch (data.err_code) {
                            case 0:
                                console.log('Object explorer parsing error');
                                break;
                        }
                        return false;
                    }

                    core.module.layout.object_explorer.refresh('object_tree', data);
                });
                break;
            default:
                break;
        }

    },

    get_contents: function () {
        var self = this;

        return self.editor.getValue();
    },

    set_dictionary: function () {
        this.string_props = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
            "toUpperCase toLowerCase split concat match replace search").split(" ");
        this.array_props = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
            "lastIndexOf every some filter for_each map reduce reduceRight ").split(" ");
        this.func_props = "prototype apply call bind".split(" ");
        this.keywords = ("break case catch continue debugger default delete do else false finally for function " +
            "if in instanceof new null return switch throw true try typeof var void while with").split(" ");
    },

    stop_event: function () {
        if (this.preventDefault) {
            this.preventDefault();
            this.stopPropagation();
        } else {
            this.return_value = false;
            this.cancel_bubble = true;
        }
    },

    add_stop: function (event) {
        if (!event.stop) event.stop = this.stop_event;
        return event;
    },

    for_each: function (arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    },

    set_mode: function (mode) {
        this.mode = mode;
        this.editor.setOption("mode", mode);
    },

    // DEAD FUNC
    toggle_fullscreen_editing: function () {
        var editor_div = $(this.target).find('.CodeMirror');

        if (!editor_div.hasClass('fullscreen')) {
            this.toggle_fullscreen_editing.beforeFullscreen = {
                height: editor_div.height(),
                width: editor_div.width()
            };

            editor_div.addClass('fullscreen');
            editor_div.height('100%');
            editor_div.width('100%');
            this.editor.refresh();
        } else {
            editor_div.removeClass('fullscreen');
            editor_div.height(this.toggle_fullscreen_editing.beforeFullscreen.height);
            editor_div.width(this.toggle_fullscreen_editing.beforeFullscreen.width);
            this.editor.refresh();
        }
    },

    undo: function () {
        this.editor.undo();
    },

    redo: function () {
        this.editor.redo();
    },

    cut: function () {
        this.copy();
        this.editor.replaceSelection("");
    },

    copy: function () {
        var selection = this.editor.getSelection();
        localStorage.clipboard = selection;
    },

    paste: function () {
        this.editor.replaceSelection(localStorage.clipboard);
    },

    do_delete: function () {
        this.editor.replaceSelection("");
    },

    select_all: function () {
        this.editor.setSelection({
            "line": 0,
            "ch": 0
        }, {
            "line": this.editor.lineCount(),
            "ch": 0
        });
    },

    get_selected_range: function () {
        return {
            from: this.editor.getCursor(true),
            to: this.editor.getCursor(false)
        };
    },

    auto_formatting: function () {
        var range = this.get_selected_range();
        this.editor.autoFormatRange(range.from, range.to);
    },

    comment_selection: function () {
        CodeMirror.commands.toggleComment(this.editor);
    },

    uncomment_selection: function () {
        var range = this.get_selected_range();
        this.editor.uncomment(range.from, range.to);
    },

    monitoring_lines: function (e) {
        var self = this;

        var is_line_deleted = false;
        var is_line_added = false;

        if (e.text.length == 1 && e.text[0] === "") is_line_deleted = true;
        if (e.text.length == 2 && e.text[1] === "") is_line_added = true;

        if (is_line_deleted) {
            var delete_line;

            if ((e.to.line - e.from.line) === 0) { // 0 line deleted
                return;
            } else if ((e.to.line - e.from.line) == 1) { // 1 line deleted
                if (parseInt(self.highlighted_line, 10) - 1 == e.to.line) {
                    self.clear_highlight();
                }

                // breakpoints
                var target_line_position = self.breakpoints.indexOf(e.to.line);
                delete_line = 1;

                if (target_line_position != -1) {
                    self.breakpoints.splice(target_line_position, 1);
                }
            } else { // multi line deleted
                var start_line = e.to.line - 1;
                var end_line = e.from.line;
                delete_line = end_line - start_line;

                for (var target_line = start_line; target_line > end_line; target_line--) {
                    //highlights
                    if (parseInt(self.highlighted_line, 10) - 1 == target_line) {
                        self.clear_highlight();
                    }

                    // breakpoints
                    var position = self.breakpoints.indexOf(target_line);
                    if (position != -1)
                        self.breakpoints.splice(position, 1);
                }
            }

            //highlight
            if (self.highlighted_line && parseInt(self.highlighted_line, 10) - 1 > e.to.line) {
                var temp_line = self.highlighted_line;
                self.highlight_line((parseInt(temp_line, 10) - delete_line));
            }

            for (var target_line = 0; target_line < self.breakpoints.length; target_line++) {
                if (self.breakpoints[target_line] >= e.to.line) self.breakpoints.splice(target_line, 1, (parseInt(self.breakpoints[target_line], 10) - delete_line));
            }
        } else if (is_line_added) {
            var start_line;

            if (e.from.ch > 0) start_line = e.to.line + 1;
            else start_line = e.to.line;

            //highlight
            if (self.highlighted_line && parseInt(self.highlighted_line, 10) - 1 >= start_line) {
                var temp_line = self.highlighted_line;
                self.highlight_line((parseInt(temp_line, 10) + 1));
            }

            // breakpoints
            for (var i = 0; i < self.breakpoints.length; i++) {
                var line = self.breakpoints[i];

                if (line >= start_line) self.breakpoints.splice(i, 1, (parseInt(line, 10) + 1));
            }
        }
    },

    reset_breakpoints: function () {

    },

    line_refresh: function () {
        var self = this;

        this.editor.refresh();
        this.reset_breakpoints();
        if (self.highlighted_line)
            this.highlight_line(self.highlighted_line);
    },

    on_activated: function () {
        var self = this;

        if (self.history) {
            //check duplication of activation, invalid activation, etc.
            if (self.history.wait_for_loading === true) return;
            if ((self.filepath + self.filename) == self.history.last_init_load) self.history.activated = true;
            if (self.history.activated === false) return;
            if (self.history.filename == "/" + self.filepath + self.filename) return;

            // valid activation! manipulation start!
            self.history.deactivated();
            self.history.init_history(self);
        }

        self.editor.setOption("readOnly", false);
        $(self.window_manager).trigger('window_open', {
            "filepath": self.filepath,
            "filename": self.filename
        });
        //start object explorer tab refresh when open file

        switch(self.filename.split('.').pop()){
            case 'c':
            case 'cpp':
            case 'java':
            case 'py':
                var active_file = self.filepath + self.filename;
                var workspace = active_file.split('/')[0];
                var path = active_file.split('/')
                path.shift();
                path = path.join('/');

                $.get("edit/get_object_explorer", {
                    'path' : path,
                    'workspace' : workspace
                }, function (data) {
                    if(!data)return false;
                    if (data.err_code) {
                        switch (data.err_code) {
                            case 0:
                                console.log('Object explorer parsing error');
                                break;
                        }
                        return false;
                    }

                    core.module.layout.object_explorer.refresh('object_tree', data);
                });
                break;

            case 'html':
            case 'css':
                $.get("edit/get_object_explorer", {
                    'selected_file_path' : self.filepath + self.filename,
                    'filepath' : self.filepath
                }, function (data) {
                    core.module.layout.object_explorer.refresh('object_tree', data);
                });
                break;
            default:
                core.module.layout.object_explorer.clear();
                break;
        }

        var window_manager = core.module.layout.workspace.window_manager;

        $(window_manager).trigger('window_open', {
            "filepath": self.filepath,
            "filename": self.filename
        });
        $(window_manager).trigger('editor_is_on_activated', self);

        
    },

    find_unsaved_file : function(){
        var docu=core.module.layout.workspace.window_manager.window;
        for(var i=0;i<docu.length;i++){
            if(!docu[i].is_saved){
                return docu[i].filepath+docu[i].filename;
            }
        }
        return "";

    },


     save_unsaved_file_in_local : function(){
        var docu=core.module.layout.workspace.window_manager.window;
        var unsaved_data=[];
        for(var i=0;i<docu.length;i++){
            if(!docu[i].is_saved){
                var path=docu[i].filepath+docu[i].filename;

                unsaved_data.push({
                    'path' : path,
                    'filepath': docu[i].filepath,
                    'filename': docu[i].filename,
                    'filetype': docu[i].filetype,
                    'data' :  docu[i].editor.get_contents()
                });

            }
        }
        if(unsaved_data.length>0)
            localStorage.unsaved_data=JSON.stringify(unsaved_data)

        
    },

    restore_unsaved_file_from_local : function(){

        if(!localStorage.unsaved_data)return false;
        var unsaved_data=JSON.parse(localStorage.unsaved_data);
        if(!unsaved_data || unsaved_data.length==0)return false;

        //1. already opened in workspace
        var docu=core.module.layout.workspace.window_manager.window;
        var delete_index=[];
        for(var k=0;k<unsaved_data.length;k++){
            for(var i=0;i<docu.length;i++){
                if(unsaved_data[k].path==docu[i].filepath+docu[i].filename){
                    docu[i].editor.editor.setValue(unsaved_data[k].data);
                    delete_index.push(k);

                }
            }
        }
        delete_index.sort();
        for(var i=delete_index.length-1;i>=0;i--){
            unsaved_data.remove(delete_index[i]);
        }


        //2. should open new window
        org.goorm.core.edit.prototype.unsaved_data=unsaved_data;

        for(var i=0;i<unsaved_data.length;i++){
            var filepath=unsaved_data[i].filepath;
            var filename=unsaved_data[i].filename;
            var filetype=unsaved_data[i].filetype;
            core.module.layout.workspace.window_manager.open(filepath, filename, filetype, undefined, {restore:true});
        }
        localStorage.unsaved_data='';
    },


    error_manager: {
        'parent': null,
        'storage': [],
        'marker': [],
        'count': 0,

        'init': function (parent) {
            this.parent = parent;
        },

        'get': function (index) {
            var data = this.storage[index] || null;
            return data;
        },

        'add_line': function (error_data) {
            var parent = this.parent;
            var editor = parent.editor;
            var count = this.count;

            var line_number = error_data.line_number;
            var error_syntax = error_data.error_syntax;

            var make_marker = function (marker_html, option) {
                var marker = document.createElement("div");
                marker.innerHTML = marker_html;
                marker.className = "exception_error";
                marker.id = "exception_error" + option.count;
                marker.setAttribute('line_number', line_number);
                return marker;
            }

            editor.setGutterMarker(line_number, "exception_error", make_marker("X", {
                'count': count,
                'line_number': line_number
            }));

            var ch_start = editor.getDoc().getLine(line_number).indexOf(error_syntax);
            var ch_end = ch_start + error_syntax.length;
            var marker = editor.getDoc().markText({
                'line': line_number,
                'ch': ch_start
            }, {
                'line': line_number,
                'ch': ch_end
            }, {
                'className': "cm-syntax-error cm-syntax-error" + count
            });

            this.marker.push(marker);
            this.storage.push(error_data);
            this.count++;
        },

        'init_event': function () {
            var self = this;

            $("span.cm-syntax-error").off('hover');
            $("span.cm-syntax-error").hover(function (e) {
                var __class = $(this).attr('class').split(" ");
                var index = __class[__class.lastIndexOf("cm-syntax-error") + 1].split("cm-syntax-error")[1];
                var data = self.get(index);

                if (data) {
                    self.error_message_box.empty();
                    self.error_message_box.bind(data.error_message);
                    self.error_message_box.show(e);
                }
            }, function () {
                self.error_message_box.hide();
            });

            $('div.exception_error').off('hover');
            $('div.exception_error').hover(function (e) {
                var line_number = $(this).attr('line_number');
                var message = "";

                for (var i = 0; i < self.storage.length; i++) {
                    var data = self.storage[i];

                    if (data && data.line_number == line_number && message.indexOf(data.error_message) == -1) {
                        message += data.error_message + "<br>";
                    }
                }

                if (message !== "") {
                    self.error_message_box.empty();
                    self.error_message_box.bind(message);
                    self.error_message_box.show(e);
                }

            }, function () {
                self.error_message_box.hide();
            });
        },

        'clear': function () {
            var parent = this.parent;
            var editor = parent.editor;

            editor.clearGutter("exception_error");
            if (!editor.getDoc().isClean()) editor.getDoc().markClean();

            for (var i = 0; i < this.marker.length; i++) {
                this.marker[i].clear();
            }

            this.error_message_box.clear();
            this.storage = [];
            this.marker = [];
            this.count = 0;
        },

        'error_message_box': {
            'add': function (container) {
                this.container = container;

                var html = "<span style='display:none;' id='error_message_box'></span>";
                $(container).append(html);
            },

            bind: function (message) {
                var container = this.container;
                var box = $(container).find("span#error_message_box");

                box.append(message);
            },

            'show': function (e) {
                var container = this.container;
                var box = $(container).find("span#error_message_box");

                box.css('left', e.pageX + 5);
                box.css('top', e.pageY + 5);

                box.show();
            },

            'hide': function () {
                var container = this.container;
                var box = $(container).find("span#error_message_box");

                box.hide();
            },

            'empty': function () {
                var container = this.container;
                var box = $(container).find("span#error_message_box");

                box.empty();
            },

            'clear': function () {
                if ($('span#error_message_box')) {
                    $('span#error_message_box').remove();
                }
            }
        }
    }
};
