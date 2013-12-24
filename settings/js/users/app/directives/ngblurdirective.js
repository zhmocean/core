usersmanagement.directive('ngBlur',
	['$parse', function($parse) {
    	return function (scope, element, attrs) {
			element.bind('blur', function () {
				scope.$apply(attrs.ngBlur);
			});
		}
	}
]);