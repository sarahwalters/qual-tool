qualTool.controller('SearchController', function SearchController($http, $scope) {
	$scope.speaker = '';
	$scope.keyword = '';
	$scope.executedKeyword = '';
	$scope.filename = '';
	$scope.searchValidationMsg = '';
	$scope.getFileValidationMsg = '';

	function resetMetadata() {
		$scope.getFileValidationMsg = '';
		$scope.searchValidationMsg = '';
		$scope.executedKeyword = '';
	}

	$scope.search = function() {
		if (!$scope.speaker && !$scope.keyword) {
			resetMetadata();
			$scope.lines = [];
			$scope.searchValidationMsg = 'Inputs cannot both be empty.';
			return;
		}
		resetMetadata();

		var url = '/api/search';
		var query = {};
		if ($scope.speaker) query.speaker = $scope.speaker;
		if ($scope.keyword) query.keyword = $scope.keyword;

		$http.get(url, {params: query})
			.then(function(res) {
				$scope.executedKeyword = query.keyword;
				$scope.lines = res.data.lines;
			}, function(err) {
				$scope.searchValidationMsg = err.data.error;
			});
	};

	$scope.getFile = function() {
		if (!$scope.filename) {
			resetMetadata();
			$scope.lines = [];
			$scope.getFileValidationMsg = 'Filename cannot be empty.';
			return;
		}
		resetMetadata();

		var url = '/api/read/' + $scope.filename;
		$http.get(url)
			.then(function(res) {
				$scope.lines = res.data.lines;
			}, function(err) {
				$scope.getFileValidationMsg = err.data.error;
			});
	};
});
