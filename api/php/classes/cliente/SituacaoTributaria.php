<?php
    class SituacaoTributaria implements Enum{
        const CONTRIBUINTE	 	= 1;
        const ISENTO		 	= 2;
        const NAO_CONTRIBUINTE	= 9;

        public static function isValid($status) {
            
            if($status === null) {
                return false;
            }
            
            switch($status) {
                case self::CONTRIBUINTE:
                case self::NAO_CONTRIBUINTE:
                case self::ISENTO:
                    return true;
                default:
                    return false;
            }
        }

        public static function numOptions() {
            return count(self::toArray());
        }

        public static function toArray() {
            return array(
                self::CONTRIBUINTE => "Contribuinte do ICMS",
                self::NAO_CONTRIBUINTE => "Não contribuinte do ICMS",
                self::ISENTO => "Isento de inscrição no Cadastro de Contribuintes"
            );
        }

        public static function toString($enum) {
            $array = self::toArray();
            return $array[$enum];
        }
    }
