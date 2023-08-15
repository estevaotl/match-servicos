<?php
    require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

    abstract class Util {
        public function __construct() {}

        /**
        * Monta um texto a partir de um array
        *
        *
        * @name arrayParaTexto
        * @example arrayParaTexto($meuArray);
        * @param array vector
        * @return String
        */
        public static function arrayParaTexto(array $vector) { 
            $texto = "Array( ";
            foreach($vector as $key => $v){
                if(is_array($v))
                    $texto .= " [".$key."] => ".self::arrayParaTexto($v)." ";
                else $texto .= " [".$key."] => ".$v." ";
            }
            $texto .= ")";
            return $texto;
        }

        public static function logException($e) {
            $exception = array(
                "mensagem" => $e->getMessage(),
                "trace" => $e->getTraceAsString(),
                "arquivo" => $e->getFile() 
            );

            $opsController = new OpsController();
            $ops = $opsController->criarOps($exception);
            $opsController->salvar($ops);
        }

        public static function logErro($mensagem){
            ob_start();
            debug_print_backtrace();
            $trace = ob_get_contents();
            ob_end_clean();

            $exception = array(
                "mensagem" => $mensagem,
                "trace" => $trace,
                "arquivo" => $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']
            );

            $opsController = new OpsController();
            $ops = $opsController->criarOps($exception);
            $opsController->salvar($ops);
        }

        /**
        * Remove as pontuações de um texto
        * 
        *1 º passo - VEJA QUE PRIMEIRO EU VOU GERAR UM SALT JÁ ENCRIPTADO EM MD5
        *2 º passo -PRIMEIRA ENCRIPTAÇÃO ENCRIPTANDO COM crypt
        *3 º passo - SEGUNDA ENCRIPTAÇÃO COM sha512 (128 bits)
        *4 º passo - AGORA RETORNO O VALOR FINAL ENCRIPTADO
        * @example encripta(senhaDoUsuario);
        * @param string senha
        * @return string senha encriptada
        */
        public static function encripta($senha){
            $senha = sha1($senha);
            $salt = md5("CD@aPAdEi31L59*iLsI#n");
            $codifica = crypt($senha, $salt);
            $codifica = hash('sha512', $codifica);
            return $codifica;
        }
    }

    function dd(...$var){
        echo '<pre>';
        return die(var_dump(...$var));
    }