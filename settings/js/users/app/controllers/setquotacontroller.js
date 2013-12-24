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
				}
			}
			else {
				QuotaService.setDefaultQuota(defaultquota.quotaval);
			}
		}
	}
]);