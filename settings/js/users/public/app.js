
var usersmanagement = angular.module('usersmanagement', ['ngResource']).
config(['$httpProvider','$routeProvider', '$windowProvider', '$provide',
	function($httpProvider,$routeProvider, $windowProvider, $provide) {

		$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;

		$routeProvider
		.when('/group/:groupId', {
			templateUrl : 'user-table.html',
			controller : 'grouplistController'
		})
		.otherwise({
			redirectTo : '/group/'
		});
	}
]);
usersmanagement.controller('creategroupController',
	['$scope', '$http', 'GroupService',
	function($scope, $http, GroupService) {
		var newgroup = {};
		$scope.savegroup = function() {
			GroupService.creategroup().save({ groupname : $scope.newgroup });
			$scope.showgroupinput = false;
			$scope.showbutton = true;
			$scope.newgroup = '';
		};
	}
]);
usersmanagement.controller('addUserController',
	['$scope', '$http', 'UserService', 'GroupService',
	function($scope, $http, UserService, GroupService) {
		
		// Takes Out all groups for the Mutiselect dropdown
		$scope.allgroups = GroupService.getByGroupId().get();
		var newuser = $scope.newuser;
		var password = $scope.password;
        
        /* Selected Group is dependant on multiselect, needs polishing. */
		var selectedgroup = $scope.addGroup;
		$scope.saveuser = function(newuser,password,selectedgroup) {
			UserService.createuser(newuser,password,selectedgroup);
		};
	}
]);
usersmanagement.controller('grouplistController',
	['$scope', '$resource', '$routeParams', 'GroupService', 'UserService', 'GroupModel',
	function($scope, $resource, $routeParams, GroupService, UserService, GroupModel) {
		$scope.loading = true;
		$scope.groups = GroupModel.getAll();
		
		$scope.routeParams = $routeParams;
		GroupService.getAllGroups().then(function(response) {
			$scope.loading = false;
			
			// Deletes the group.
			$scope.deletegroup = function(group) {
				$scope.groups.splice($scope.groups.indexOf(group), 1);
				GroupService.removegroup(group);
			};
		});
	}
]);
usersmanagement.controller('prioritygroupController',
	['$scope', '$routeParams', 'GroupService', 'UserService',
	function($scope, $routeParams, GroupService, UserService){
		
        $scope.routeParams = $routeParams;
        
		/*Returns everyone. */
		$scope.getEveryone = function() {
			
		};
		
		/* Returns the list of Subadmins on the Userlist */
		$scope.getSubadmins = function() {
			
		};
	}
]);
usersmanagement.controller('setQuotaController',
	['$scope', 'QuotaService',
	function($scope, QuotaService) {
		$scope.quotavalues =[
								{show : '5 GB', quotaval : '5 GB'},
								{show : '10 GB', quotaval : '10 GB'},
								{show : '15 GB', quotaval : '15 GB'},
								{show : 'Unlimited', quotaval : 'none'},
								{show : 'Custom', quotaval : 'Custom'}
							];
		// Default Quota
		$scope.selectdefaultQuota = function(defaultquota) {
			if (defaultquota.quotaval === 'Custom') {
				$scope.customValInput = true;
				$scope.showQuotadropdown = false;
				$scope.sendCustomVal = function() {
					var customVal = $scope.customVal + ' GB';
					QuotaService.setDefaultQuota(customVal);
					$scope.customValInput = false;
				};
			}
			else {
				QuotaService.setDefaultQuota(defaultquota.quotaval);
			}
		};
	}
]);
usersmanagement.controller('userlistController',
	['$scope', 'UserService', 'GroupService', 'QuotaService','$routeParams',
	function($scope, UserService, GroupService, QuotaService, $routeParams) {
		$scope.loading = true;
		UserService.getAllUsers().then(function(response) {
			$scope.users = UserService.getUsersInGroup($routeParams.groupId);
			$scope.loading = false;
			$scope.userquotavalues = [
				{show : '5 GB', quotaval : '5 GB'},
				{show : '10 GB', quotaval : '10 GB'},
				{show : '15 GB', quotaval : '15 GB'},
				{show : 'Unlimited', quotaval : 'none'}
			];

			/* Takes Out all groups for the Multiselect dropdown */
			$scope.allgroups = GroupService.getByGroupId().get();
			
			/* Updates Display name */
			$scope.updateDisplayName = function(userid,displayname) {
				UserService.updateName(userid,displayname);
			};
			
			/* Updates Password */
			$scope.updatePassword = function(userid,password) {
				UserService.updatePass(userid,password);
			};
			
			/* Updates User Quota */
			$scope.updateUserQuota = function(userid,userquota) {
				QuotaService.setUserQuota(userid,userQuota.quotaval);
			};
			$scope.updateUserQuota = function(userid,userQuota) {
				QuotaService.setUserQuota(userid,userQuota.quotaval);
			};
			
			/* Deletes Users */
			$scope.deleteuser = function(user) {
				$scope.users.splice($scope.users.indexOf(user), 1);
				UserService.removeuser(user);
			};
		});
	}
]);
usersmanagement.directive('avatar',
	[ function() {
		return {
			template: "<div class='avatardiv'></div>",
			replace: true
			// Get the Avatar Plugin here once it gets into master.
		};
	}]
);
/* The Spinner Directive */

usersmanagement.directive('loading',
	[ function() {
		return {
			restrict: 'E',
			replace: true,
			template:"<div class='loading'></div>",
			link: function($scope, element, attr) {
				$scope.$watch('loading', function(val) {
					if (val) {
						$(element).show();
					}
					else {
						$(element).hide();
					}
				});
			}
		};
	}]
);
usersmanagement.directive('multiselectUsers', [function() {
	return function(scope, element, attributes) {
		element = $(element[0]); // To use jQuery.
		element.multiSelect({
			title: 'Groups..',
			createText: scope.label,
			selectedFirst: true,
			sort: true,
			minWidth: 100,
			checked: scope.checked,
			oncheck: scope.checkHandeler,
			onuncheck: scope.checkHandeler
			//createCallback: addGroup,
		});
	};
}]);
usersmanagement.directive('ngBlur',
	['$parse', function($parse) {
		return function (scope, element, attrs) {
			element.bind('blur', function () {
				scope.$apply(attrs.ngBlur);
			});
		};
	}
]);
usersmanagement.directive('ngFocus', 
	['$parse', function($timeout) {
		return function( scope, element, attrs ) {
			scope.$watch(attrs.ngFocus, function (newVal, oldVal) {
				if (newVal) {
					element[0].focus();
				}
			});
		};
	}
]);
/* Group Service */

usersmanagement.factory('GroupService',
	['$q', '$resource', 'GroupModel',
	function($q, $resource, GroupModel) {
	var groupname = {};
	return {
		creategroup: function () {
			return $resource(OC.filePath('settings', 'ajax', 'creategroup.php'), {}, {
				method : 'POST'
			});
		},
		removegroup: function(group) {
			$resource(OC.filePath('settings', 'ajax', 'removegroup.php')).delete(
				{ groupname : group }
			);
		},
		getAllGroups: function() {
			var deferred = $q.defer();
			var Groups = $resource(OC.filePath('settings', 'ajax', 'grouplist.php'));
			Groups.get(function(response){
				GroupModel.addAll(response.result);
				deferred.resolve(response);
			});
			return deferred.promise;
		},
		getByGroupId: function(groupId) {
			return $resource(OC.filePath('settings', 'ajax', 'grouplist.php'), {}, {
				method: 'GET'
			});
		}
	};
}]);
usersmanagement.factory('QuotaService', function($resource) {
	return {
		setUserQuota: function(userid,userQuota) {
			return $resource(OC.filePath('settings','ajax', 'setquota.php')).save(
				{ username : userid, quota : userQuota }
			);
		},
		setDefaultQuota: function(defaultquota) {
			return $resource(OC.filePath('settings', 'ajax', 'setquota.php')).save(
				{ quota : defaultquota }
			);
		}
	};
});
usersmanagement.factory('UserService',
	['$resource', 'Config', '$q', 'UserModel', '_InArrayQuery',
	function($resource, Config, $q, UserModel, _InArrayQuery) {
	return {
		createuser: function(user, userpass, ingroup) {
			return $resource(OC.filePath('settings', 'ajax', 'createuser.php')).save(
				{ username : user, password: userpass, groups : ingroup }
			);
		},
		removeuser: function(user) {
			return $resource(OC.filePath('settings', 'ajax', 'removeuser.php')).delete(
				{ username : user }
			);
		},
		updateName: function(userid,displayname) {
			return $resource(OC.filePath('settings', 'ajax', 'changedisplayname.php')).save(
				{ username : userid, displayName : displayname }
			);
		},
		updatePass: function(userid,password) {
			return $resource(OC.filePath('settings', 'ajax', 'changepassword.php')).save(
				{ userid : userid, password : password }
			);
		},
		updateField: function(userId, fields) {
			return $resource(Config.baseUrl + '/users/' + userId, fields, {
				method: 'POST'
			});
		},
		getAllUsers: function() {
			var deferred = $q.defer();
			var User = $resource(OC.filePath('settings', 'ajax', 'userlist.php'));
			User.get(function(response){
				UserModel.addAll(response.userdetails);
				deferred.resolve(response);
			});
			return deferred.promise;
		},
		getUsersInGroup: function (groupId) {
			var usersInGroupQuery = new _InArrayQuery('groups', groupId);
			return UserModel.get(usersInGroupQuery);
		},
		toggleGroup: function(userid,group) {
			return $resource(OC.filePath('settings', 'ajax', 'togglegroup.php')).save(
				{ username : userid, groupname : group }
			);
		},
		toggleSubadmin: function(userid,subadmins) {
			return $resource(OC.filePath('settings', 'ajax', 'togglegroup.php')).save(
				{ username : userid, group : subadmins }
			);
		}
	};
}]);

