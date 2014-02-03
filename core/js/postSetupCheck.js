/* global OC, t */
var SetupChecks = {

	checks: [],
	doneCount: 0,
	resultsEl: null,

	add: function(label, func) {
		this.checks.push({
			label: label,
			func: func,
			done: false
		});
	},

	runCheck: function(check) {
		var self = this;
		if (check.done || check.running) {
			return false;
		}

		var el = $('<li class="running update"><div class="label"></div>' +
				'<div class="result"><div style="height: 50px" class="loading"></div></div></li>');
		el.find('.label').text(check.label);
		check.el = el;
		this.resultsEl.append(el);

		var callback = function(success, message) {
			var text;
			var el = check.el;
			el.removeClass('running');
			if (success) {
				check.success = true;
				el.find('.result').addClass('success');
				text = message || t('core', 'Success');
			}
			else {
				check.success = false;
				el.addClass('failure');
				el.find('.result').addClass('error');
				text = message || t('core', 'Failure');
			}
			check.running = false;
			check.done = true;
			el.find('.result').html(text);
			// all tests finished
			self.doneCount++;
			if (self.doneCount >= self.checks.length) {
				self.onFinished(self.checks);
			}
		};

		// run checks in parallel
		setTimeout(function() {
			check.running = true;
			check.func(callback);
		}, 0);
	},

	run: function(resultsEl, callback) {
		this.resultsEl = resultsEl;
		this.onFinished = callback;
		for ( var i = 0; i < this.checks.length; i++ ) {
			this.runCheck(this.checks[i]);
		}
	},

	checkWebDAV: function(callback) {
		var afterCall = function(doc, statusText, result) {
			if (result.status === 200 || result.status === 207) {
				callback(true);
			}
			else {
				var message = t('core', 'Your web server is not yet properly setup to allow files synchronization because the WebDAV interface seems to be broken.');
				// TODO: link to docs
				// message += '<br/>' + t('core', 'Please double check the <a href=\'{link}\'>installation guides</a>.', link: OC.
				callback(false, message);
			}
		};

		$.ajax({
			type: 'PROPFIND',
			url: OC.linkToRemoteBase('webdav'),
			data: '<?xml version="1.0"?>' +
					'<d:propfind xmlns:d="DAV:">' +
					'<d:prop><d:resourcetype/></d:prop>' +
					'</d:propfind>',
			error: afterCall,
			success: afterCall
		});
	}
};

$(document).ready(function() {
	SetupChecks.add(t('core', 'Checking WebDAV connection'), SetupChecks.checkWebDAV);
	SetupChecks.run($('ul.checks'), function(checks) {
		var success = true;
		for (var i = 0; i < checks.length; i++) {
			if (!checks[i].success) {
				success = false;
				break;
			}
		}
		if (success) {
			window.setTimeout(function() {
				location.href = OC.webroot;
			}, 3000);
		}
		else {
			// TODO: error message
		}
	});
});
