<?php

require_once($_SERVER['DOCUMENT_ROOT']."/config.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailSender
{
    private $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);

        // Configurações do servidor SMTP (exemplo usando o Gmail)
        $this->mailer->CharSet = 'utf-8';
        $this->mailer->isSMTP();
        $this->mailer->Host = 'smtp-relay.sendinblue.com'; // Altere para o servidor SMTP desejado
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = 'estevaotlnf@gmail.com'; // Seu endereço de e-mail
        $this->mailer->Password = 'vE4FS89nGwgOUAPV'; // Sua senha de e-mail
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = 587; // Porta SMTP

        // Configurações gerais

		$siteName = '=?UTF-8?B?'.base64_encode("Match Serviços").'?=';

        $this->mailer->setFrom('estevaotlnf@gmail.com', $siteName);
        $this->mailer->isHTML(true);
    }

    public function enviarEmail($destinatario, $assunto, $mensagem)
    {
        try {
            // Destinatário
            $this->mailer->addAddress($destinatario);

            // Assunto
            $this->mailer->Subject = $assunto;

            // Corpo da mensagem
            $this->mailer->Body = $mensagem;

            // Enviar o e-mail
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            Util::logException($e);
            return false;
        }
    }
}

?>