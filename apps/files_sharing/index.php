<?php

/**
 * ownCloud - Sharing overview page
 *
 * @author Vincent Petry
 * @copyright 2014 Vincent Petry <pvince81@owncloud.com>
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

OCP\User::checkLoggedIn();

// Load the files we need
OCP\Util::addStyle('files', 'files');
OCP\Util::addStyle('files', 'upload');
OCP\Util::addStyle('files', 'mobile');
OCP\Util::addStyle('files_sharing', 'sharedfilelist');
OCP\Util::addscript('files', 'filesummary');
OCP\Util::addscript('files', 'fileactions');
OCP\Util::addscript('files', 'files');
OCP\Util::addscript('files', 'filelist');

OCP\App::setActiveNavigationEntry('files_sharing_index');

OCP\Util::addscript('files_sharing', 'sharedfilelist');
OCP\Util::addscript('files', 'keyboardshortcuts');
$tmpl = new OCP\Template('files_sharing', 'index', 'user');
$tmpl->assign('dir', $dir);
$tmpl->assign('permissions', $permissions);
$tmpl->assign('uploadMaxFilesize', $maxUploadFilesize); // minimium of freeSpace and uploadLimit
$tmpl->assign('uploadMaxHumanFilesize', OCP\Util::humanFileSize($maxUploadFilesize));

$tmpl->printPage();
