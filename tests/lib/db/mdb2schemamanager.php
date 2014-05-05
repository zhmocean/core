<?php

/**
 * Copyright (c) 2014 Thomas Müller <deepdiver@owncloud.com>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

namespace Test\DB;

class MDB2SchemaManager extends \PHPUnit_Framework_TestCase {

	public function testAutoIncrement() {

		$connection = \OC_DB::getConnection();
		$manager = new \OC\DB\MDB2SchemaManager($connection);

		$manager->removeDBStructure(__DIR__ . '/ts-autoincrement-before.xml');

		$manager->createDbFromStructure(__DIR__ . '/ts-autoincrement-before.xml');
		$connection->executeUpdate('insert into `*PREFIX*table` values (?)', array('abc'));
		$connection->executeUpdate('insert into `*PREFIX*table` values (?)', array('abc'));
		$connection->executeUpdate('insert into `*PREFIX*table` values (?)', array('123'));
		$connection->executeUpdate('insert into `*PREFIX*table` values (?)', array('123'));
		$manager->updateDbFromStructure(__DIR__ . '/ts-autoincrement-after.xml');
	}

}
