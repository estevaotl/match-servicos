<?php
    require_once($_SERVER['DOCUMENT_ROOT'] . "/match-servicos/api/config.php");

    class ImagemFactory {

        public function __construct() {}

        public static function saveImage($uploadedFile, $idCliente) {
            try {
                $filename = $uploadedFile->getClientFilename(); // Nome original do arquivo
                $fileSize = $uploadedFile->getSize(); // Tamanho do arquivo
                $fileType = $uploadedFile->getClientMediaType(); // Tipo de mídia do arquivo (MIME type)
                $fileName = uniqid() . '_' . $filename;

                $targetDirectory = $_SERVER['DOCUMENT_ROOT'] . '/match-servicos/api/public/dinamica/';
                $targetPath = $targetDirectory . $fileName;

                $tempFilePath = $uploadedFile->getStream()->getMetadata('uri');

                $imagemLocal = self::carregarImagemDaMemoria($tempFilePath);
                $imagemLocal->setPasta($targetDirectory);
                $imagemLocal->setNomeArquivo($fileName);
                $imagemLocal->setIdObjeto($idCliente);

                $imagem = $imagemLocal->getImagem();

                $nome_novo_arquivo = self::salvarImagemDaMemoria($imagem, $targetPath, $fileType);
                if ($nome_novo_arquivo) {
                    (new ImagemLocalController())->salvar($imagemLocal);
                    return $targetPath;
                }

                return null;
            } catch (\Throwable $th) {
                Util::logException($th);
            }
        }

        public static function carregarImagemDaMemoria($caminhoTemporario){
            if(file_exists($caminhoTemporario)) {
                $size = getimagesize($caminhoTemporario);
                $campos = explode("/", $caminhoTemporario);

                $imagem = new ImagemLocal();
				$imagem->setNomeArquivo(array_pop($campos));
				$imagem->setPasta(implode("/", $campos));

                switch ($size['mime']) { 
                    case "image/gif": 
                        $imagem->setImagem(imagecreatefromgif($caminhoTemporario));
                        break; 
                    case "image/jpeg" : 
                        $imagem->setImagem(imagecreatefromjpeg($caminhoTemporario));
                        break; 
                    case "image/png" :
                        $imgPng = imagecreatefrompng($caminhoTemporario);
                        imageAlphaBlending($imgPng, true);
                        imageSaveAlpha($imgPng, true);
                        $imagem->setImagem($imgPng);
                        break; 
                    default:
                        throw new InvalidArgumentException("Fomato da imagem Invalido: " .  $size['mime']);
                } 

                return $imagem;
            } else {
                throw new Exception("O Arquivo nao existe: " . $caminhoTemporario);
            }
        }

        public static function salvarImagemDaMemoria(&$imagem, $novo_caminho, $mime_type, $qualidade = 100) {
            $dir = dirname($novo_caminho);
            if($dir != '' && !is_dir($dir)) {
                mkdir($dir, 0777, true);
            }
            //remove extensao
            $novo_caminho = preg_replace('/\\.[^.\\s]{3,5}$/', '', $novo_caminho);

            switch($mime_type) {
                case "image/gif": 
                    $novo_caminho .= '.gif';
                    $enviou = imagegif($imagem, $novo_caminho);
                    break;
                case "image/jpeg" : 
                case "image/png" : 
                    $novo_caminho .= '.jpg';
                    $enviou = imagejpeg($imagem, $novo_caminho,$qualidade);
                    break;
                default:
                    $novo_caminho .= '.jpg';
                    $enviou = imagejpeg($imagem, $novo_caminho, $qualidade);
            }

            if($enviou){
                $explodedPath = explode('/', $novo_caminho);
                return end($explodedPath);
            }

            return $enviou;
        }

        private function mimeToExt($mime) {
            switch($mime) {
                    case "image/gif": 
                        return "gif";
                    case "image/jpeg" : 
                        return "jpg";
                    case "image/png" :
                        return "png";
                    default:
                        return false;
                }
        }

        private static function salvarImagemDoArquivo($caminho, $novo_caminho,  $upload = false) {
            $dir = dirname($novo_caminho);
            if($dir != '' && !is_dir($dir)) {
                mkdir($dir, 0777, true);
            }

            if($upload ) {	
                $res = move_uploaded_file($caminho, $novo_caminho);
            } else {
                $res = copy($caminho, $novo_caminho);
            }

            if($res){
                return end(explode('/', $novo_caminho));
            }
            return $res;
        }

        public function getImagemExt($caminho) {
            $size = getimagesize($caminho);
            if($size === false) {
                return false;
            } else {
                return ImagemFactory::mimeToExt($size['mime']);
            }
        }
    }
?>
