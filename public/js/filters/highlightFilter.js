qualTool.filter('highlight', function($sce) {
	return function(text, phrase) {
		var highlighted = phrase ? text.replace(new RegExp('('+phrase+')', 'gi'), '<span class="highlighted">$1</span>') : text;
		return $sce.trustAsHtml(highlighted);
	}
});
