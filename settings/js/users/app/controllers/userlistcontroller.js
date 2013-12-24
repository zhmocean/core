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
			}
			
			/* Updates Password */
			$scope.updatePassword = function(userid,password) {
				UserService.updatePass(userid,password);
			}
			
			/* Updates User Quota */
    		$scope.updateUserQuota = function(userid,userquota) {
    			QuotaService.setUserQuota(userid,userQuota.quotaval);
    		}
			$scope.updateUserQuota = function(userid,userQuota) {
				QuotaService.setUserQuota(userid,userQuota.quotaval);
			}
			
			/* Deletes Users */
			$scope.deleteuser = function(user) {
				$scope.users.splice($scope.users.indexOf(user), 1);
				UserService.removeuser(user);
			};
			
			/* Everything on Multiselect - Group Toggle */
            
            /* TODO : Make the translation work. */
            
			if (isadmin) {
				$scope.label = t('settings', 'Add Group');
			} else {
				$scope.label = null;
			}
            $scope.checked = [];
            $scope.user = element.attr('data-username');
            user = $scope.user;
    		if (element.attr('multiselect-users')) {
    			if (element.data('userGroups')) {
    				checked = element.data('userGroups');
    			}
                if (user) {
                    $scope.checkHandeler = function(group) {
                        if (user === OC.currentUser && group === 'admin') {
                            return false;
                        }
                        if (!isadmin && checked.length === 1 && checked[0] === group) {
                            return false;
                        }
                        GroupService.toggleGroup(user,group);
                    }
                } else {
                    $scope.checkHandeler = false;
                }
            }
            
            /* Everything on Subadmin toggle. */
            
            if (element.attr('multiselect-subadmins')) {
                if ( element.data('subadmin')) {
                    checked = element.data('subadmin');
                }
                var checkHandeler = function(group) {
                    if (group === 'admin') {
                        return false;
                    }
                    GroupService.toggleSubadmin(user,group);
                }
            }
		});
	}
]);