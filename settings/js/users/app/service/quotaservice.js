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
	}
});