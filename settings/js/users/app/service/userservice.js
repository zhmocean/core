/*
 * ownCloud - Core
 *
 * @author Raghu Nayyar
 * @copyright 2013 Raghu Nayyar <raghu.nayyar.007@gmail.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

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
