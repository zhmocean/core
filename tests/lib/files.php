<?php
/**
 * Copyright (c) 2014 Vincent Petry <PVince81@owncloud.com>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file. */

namespace Test;

class Files extends \PHPUnit_Framework_TestCase {

	private $stateFilesEncryption;
	private static $userId;

	public function setUp() {
		// remember files_encryption state
		$this->stateFilesEncryption = \OC_App::isEnabled('files_encryption');
		// we want to tests with the encryption app disabled
		\OC_App::disable('files_encryption');

		self::$userId = 'test' . uniqid();
		\OC_User::clearBackends();
		\OC_User::useBackend(new \OC_User_Dummy());

		//login
		\OC_User::createUser(self::$userId, self::$userId);
		$this->user = \OC_User::getUser();
		\OC_User::setUserId(self::$userId);

		\OC\Files\Filesystem::clearMounts();
		\OC_Util::setupFS(self::$userId);
	}

	public function tearDown() {
		\OC\Files\Filesystem::clearMounts();

		// clean up
		\OC_User::setUserId('');
		\OC_User::deleteUser(self::$userId);
		\OC_Preferences::deleteUser(self::$userId);
		\OC_Util::tearDownFS();
		if ($this->stateFilesEncryption) {
			\OC_App::enable('files_encryption');
		}
	}

	public function testGetWithXSendFileAndLocalStorage() {
		$storage = new \OC\Files\Storage\Temporary(array());
		\OC\Files\Filesystem::mount($storage, array(), '/');

		\OC\Files\Filesystem::file_put_contents('foo.txt', 'abcdef');

		$_SERVER['HTTP_USER_AGENT'] = 'Mozilla'; // dummy
		$_SERVER['MOD_X_SENDFILE_ENABLED'] = true;
		ob_start();
		\OC_Files::get('/', 'foo.txt', false);
		ob_clean();
	}
}
