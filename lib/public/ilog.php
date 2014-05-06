<?php
/**
 * Copyright (c) 2014 Bernhard Posselt <dev@bernhard-posselt.com>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

namespace OCP;

interface ILog {
    function emergency($message, array $context);
    function alert($message, array $context);
    function critical($message, array $context);
    function error($message, array $context);
    function warning($message, array $context);
    function notice($message, array $context);
    function info($message, array $context);
    function debug($message, array $context);
    function log($level, $message, array $context);
}
