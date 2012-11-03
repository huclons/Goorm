module.exports = {
	get_readme_markdown: function () {
		var input = require("fs").readFileSync(__path + '/README.md', 'utf8');
		var output = require("markdown").markdown.toHTML(input);
		
		return {html:output}; 
	}
};