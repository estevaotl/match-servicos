<?php
    abstract class UtilValidacoes{
        public static function validarEmail($email) {
            $email = html_entity_decode($email);
            $conta = "^[a-zA-Z0-9\._-]+@";
            $domino = "[a-zA-Z0-9\._-]+\.";
            $extensao = "[a-zA-Z]{2,4}$^";
            $pattern = $conta.$domino.$extensao;
            if(preg_match($pattern, $email))
                return true;
            return false;
        }

        public static function validarCPF($cpf){
            $cpf = html_entity_decode($cpf);
            $j = 0;
            for($i = 0; $i < (strlen($cpf)); $i++){
                if(is_numeric($cpf[$i])){
                    $num[$j] = $cpf[$i];
                    $j++;
                }
            }
            if(count($num) != 11){
                $isCpfValid = false;
            }else{
                for($i = 0; $i < 10; $i++){
                    if($num[0] == $i && $num[1] == $i && $num[2] == $i && $num[3] == $i && $num[4] == $i && $num[5] == $i && $num[6] == $i && $num[7] == $i && $num[8] == $i){
                        $isCpfValid = false;
                        break;
                    }
                }
            }
            if(!isset($isCpfValid)){
                $j =10;
                for($i = 0; $i < 9; $i++){
                    $multiplica[$i] = $num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $resto = $soma%11;
                if($resto < 2){
                    $dg=0;
                }else{
                    $dg = 11-$resto;
                }
                if($dg != $num[9]){
                    $isCpfValid = false;
                }
            }
            if(!isset($isCpfValid)){
                $j=11;
                for($i = 0; $i < 10; $i++){
                    $multiplica[$i] = $num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $resto = $soma%11;
                if($resto < 2){
                    $dg = 0;
                }else{
                    $dg = 11-$resto;
                }
                if($dg != $num[10]){
                    $isCpfValid = false;
                }else{
                    $isCpfValid = true;
                }
            }
            return $isCpfValid;
        }

        public static function validarCNPJ($cnpj){
            $cnpj = html_entity_decode($cnpj);
            $j = 0;
            for($i = 0; $i < (strlen($cnpj)); $i++){
                if(is_numeric($cnpj[$i])){
                    $num[$j] = $cnpj[$i];
                    $j++;
                }
            }
            if(count($num) != 14){
                $isCnpjValid = false;
            }
            if($num[0] == 0 && $num[1] == 0 && $num[2] == 0 && $num[3] == 0 && $num[4] == 0 && $num[5] == 0 && $num[6] == 0 && $num[7] == 0 && $num[8] == 0 && $num[9] == 0 && $num[10] == 0 && $num[11] == 0){
                $isCnpjValid = false;
            }else{
                $j = 5;
                for($i = 0; $i < 4; $i++){
                    $multiplica[$i] = $num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $j = 9;
                for($i = 4; $i < 12; $i++){
                    $multiplica[$i] = $num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);	
                $resto = $soma%11;			
                if($resto < 2){
                    $dg = 0;
                }else{
                    $dg = 11-$resto;
                }
                if($dg != $num[12]){
                    $isCnpjValid = false;
                } 
            }
            if(!isset($isCnpjValid)){
                $j = 6;
                for($i = 0; $i < 5; $i++){
                    $multiplica[$i] = $num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);
                $j = 9;
                for($i = 5; $i < 13; $i++){
                    $multiplica[$i] = $num[$i]*$j;
                    $j--;
                }
                $soma = array_sum($multiplica);	
                $resto = $soma%11;			
                if($resto < 2){
                    $dg = 0;
                }else{
                    $dg = 11-$resto;
                }
                if($dg != $num[13]){
                    $isCnpjValid = false;
                }else{
                    $isCnpjValid  =true;
                }
            }
            return $isCnpjValid;
        }

        public static function gerarMensagemDeErro($erro, Exception $e = null, $separador = ' / '){
            if(empty($erro)){
                $erro = $e->getMessage();
                if($erro == "")
                    $erro = "Houve um erro interno. Tente novamente";
            }else{
                if(is_array($erro)){
                    $erros = [];
                    foreach($erro as $mensagem){
                        if($mensagem != '1')
                            $erros[] = $mensagem;
                    }
                    $erro = implode($separador, $erros);
                }
            }

            return $erro;
        }
    }
