/*
 * Copyright (c) 2014 Vincent Petry <pvince81@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3
 * or later.
 *
 * See the COPYING-README file.
 *
 */
/* global FileList, FileActions, FileSummary */
(function() {

	// for now until we have real inheritance...
	var oldCreateRow = FileList._createRow;

	var SharedFileList = _.extend(FileList, {
		appName: 'Shares',

		SHARE_TYPE_TEXT: [
			t('files_sharing', 'User'),
			t('files_sharing', 'Group'),
			t('files_sharing', 'Unknown'),
			t('files_sharing', 'Public')
		],

		initialize: function() {
			if (this.initialized) {
				return;
			}

			// remove the default actions from the files app...
			FileActions.clear();

			// TODO: FileList should not know about global elements
			this.$el = $('#filestable');
			this.$fileList = $('#fileList');
			this.files = [];
			// dummy for now as the parent class expects this
			this.breadcrumb = {
				setDirectory: function(){}
			};
			this._selectedFiles = {};
			this._selectionSummary = new FileSummary();

			this.fileSummary = this._createSummary();
		},

		_shareCompare: function(share1, share2) {
			var result = SharedFileList._fileInfoCompare(share1, share2);
			if (result === 0) {
				return share2.shareType - share1.shareType;
			}
			return result;
		},

		_createRow: function(fileData) {
			// TODO: hook earlier and render the whole row here
			var $tr = oldCreateRow.apply(this, arguments);
			$tr.find('.filesize').remove();
			var $sharedWith = $('<td class="sharedWith"></td>').text(fileData.shareWithDisplayName);
			var $shareType = $('<td class="shareType"></td>').text(this.SHARE_TYPE_TEXT[fileData.shareType] ||
				t('files_sharing', 'Unkown'));
			$tr.find('td.date').before($sharedWith).before($shareType);
			$tr.find('td.filename input:checkbox').remove();
			return $tr;
		},

		reload: function() {
			FileList.showMask();
			if (FileList._reloadCall) {
				FileList._reloadCall.abort();
			}
			FileList._reloadCall = $.ajax({
				url: OC.linkToOCS('apps/files_sharing/api/v1') + 'shares',
				data: {
					format: 'json'
				},
				type: 'GET',
				beforeSend: function(xhr) {
					xhr.setRequestHeader('OCS-APIREQUEST', 'true');
				},
				error: function(result) {
					FileList.reloadCallback(result);
				},
				success: function(result) {
					FileList.reloadCallback(result);
				}
			});
		},

		reloadCallback: function(result) {
			delete this._reloadCall;
			this.hideMask();

			if (result.ocs && result.ocs.data) {
				this.setFiles(this._makeFilesFromShares(result.ocs.data));
			}
			else {
				// TODO: error handling
			}
		},

		/**
		 * Converts the OCS API share response data to a file info
		 * list
		 * @param OCS API share array
		 * @return array of file info maps
		 */
		_makeFilesFromShares: function(data) {
			// OCS API uses non-camelcased names
			/* jshint camelcase: false */
			var files = _.map(data, function(share) {
				var file = {
					id: share.id,
					name: OC.basename(share.path),
					path: OC.dirname(share.path),
					mtime: share.stime * 1000,
					permissions: share.permissions
				};
				if (share.item_type === 'folder') {
					file.type = 'dir';
				}
				else {
					file.type = 'file';
					// force preview retrieval as we don't have mime types,
					// the preview endpoint will fall back to the mime type
					// icon if no preview exists
					file.isPreviewAvailable = true;
					file.icon = true;
				}
				file.shareType = share.share_type;
				file.shareWith = share.share_with;
				file.shareWithDisplayName = share.share_with_displayname;
				return file;
			});
			return files.sort(this._shareCompare);
		}
	});

	window.SharedFileList = SharedFileList;
})();

