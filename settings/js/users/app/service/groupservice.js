/*
 * ownCloud - Core
 *
 * @author Raghu Nayyar
 * @copyright 2013 Raghu Nayyar <raghu.nayyar.007@gmail.com>
 * @coauthor Bernhard Posselt
 * @copyright 2013 Bernhard Posselt <nukeawhale@gmail.com>
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
	}
}]);