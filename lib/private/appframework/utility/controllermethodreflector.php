<?php

/**
 * ownCloud - App Framework
 *
 * @author Bernhard Posselt
 * @copyright 2014 Bernhard Posselt <dev@bernhard-posselt.com>
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


namespace OC\AppFramework\Utility;


/**
 * Reads and parses annotations from doc comments
 */
class ControllerMethodReflector {

	private $annotations;
	private $types;
	private $parameters;

	public function __construct() {
		$this->types = array();
		$this->parameters = array();
		$this->annotations = array();
	}


	/**
	 * @param object $object an object or classname
	 * @param string $method the method which we want to inspect
	 */
	public function reflect($object, $method){
		$reflection = new \ReflectionMethod($object, $method);
		$docs = $reflection->getDocComment();

		// extract everything prefixed by @ and first letter uppercase
		preg_match_all('/@([A-Z]\w+)/', $docs, $matches);
		$this->annotations = $matches[1];

		// extract type parameter information
		preg_match_all('/@param (?<type>\w+) \$(?<var>\w+)/', $docs, $matches);
		$this->types = array_combine($matches['var'], $matches['type']);

		// get method parameters
		foreach ($reflection->getParameters() as $param) {
			$this->parameters[] = $param->name;
		}
	}


	/**
	 * Inspects the PHPDoc parameters for types
	 * @param strint $parameter the parameter whose type comments should be 
	 * parsed
	 * @return string|null type in the type parameters (@param int $something) 
	 * would return int or null if not existing
	 */
	public function getType($parameter) {
		if(array_key_exists($parameter, $this->types)) {
			return $this->types[$parameter];
		} else {
			return null;
		}
	}


	/**
	 * @return array the arguments of the method
	 */
	public function getParameters() {
		return $this->parameters;
	}


	/**
	 * Check if a method contains an annotation
	 * @param string $name the name of the annotation
	 * @return bool true if the annotation is found
	 */
	public function hasAnnotation($name){
		return in_array($name, $this->annotations);
	}


}
