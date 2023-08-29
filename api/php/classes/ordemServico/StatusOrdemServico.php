<?php
    class StatusOrdemServico implements Enum{
        const EM_ABERTO	 	= 0;
        const EM_ANDAMENTO	= 1;
        const CONCLUIDO	    = 2;
        const CANCELADO     = 3;

        public static function isValid($status) {
            if($status === null) {
                return false;
            }

            switch($status) {
                case self::EM_ABERTO:
                case self::EM_ANDAMENTO:
                case self::CONCLUIDO:
                case self::CANCELADO:
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
                self::EM_ABERTO => "Em Aberto",
                self::EM_ANDAMENTO => "Em Andamento",
                self::CONCLUIDO => "Concluido",
                self::CANCELADO => "Cancelado"
            );
        }

        public static function toString($enum) {
            $array = self::toArray();
            return $array[$enum];
        }
    }
