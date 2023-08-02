<?php

    Class Util {
        public function __construct() {}

        public function instanciarClasse($class_name) {
            $class_file = __DIR__ . '/classes/' . $class_name . '.php';
            if (file_exists($class_file)) {
                require_once $class_file;
            }
        }        
    }