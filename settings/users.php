<?php
/**
 * Copyright (c) 2011, Robin Appelman <icewind1991@gmail.com>
 * Copyright (c) 2013, Raghu Nayyar <raghu.nayyar.007@gmail.com>
 * This file is licensed under the Affero General Public License version 3 or later.
 * See the COPYING-README file.
 */

OC_Util::checkSubAdminUser();
OC_App::loadApps();


OC_Util::addScript( 'settings', 'users/public/app');
OC_Util::addStyle('settings', 'users/users');
OC_App::setActiveNavigationEntry('core_users');

$tmpl = new OC_Template( "settings", "users/main", "user" );
$tmpl->printPage();
