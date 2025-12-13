<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email{

    public $correo;
    public $nombre;
    public $token;

    public function __construct($correo, $nombre, $token) {

        $this->correo = $correo;
        $this->nombre = $nombre; 
        $this->token = $token; 

    }


    public function enviarConfirmacion(){

        // Crear el objeto de email


        // Looking to send emails in production? Check out our Email API/SMTP product!
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com','appsalon.com');
        $mail->Subject = 'Confirma tu cuenta';


        // set HTML

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong> Hola ". $this->nombre ."</strong>. Has creado tu cuenta en AppSalon, Solo debes confirmarla presionando el siguiente enlace</p>";
        $contenido .= "<p> Presiona aquí: <a href=' ". $_ENV['APP_URL'] ."/confirmar-cuenta?token=". $this->token ."'>Confirmar Cuenta</a> </p>";
        $contenido .= "<p>Si tú no solicitaste esta cuenta, puedes ignorar el mensaje. </p>";
        $contenido .="</html>"; 

        $mail->Body = $contenido;


        // enviar el email

        $mail->send();


    }



    public function enviarInstrucciones() {

        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USER'];
        $mail->Password = $_ENV['EMAIL_PASS'];

        $mail->setFrom('cuentas@appsalon.com');
        $mail->addAddress('cuentas@appsalon.com', 'appsalon.com');
        $mail->Subject = 'Reestablece tu contraseña';

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong>Hola " . $this->nombre . "</strong>. Has solicitado reestablecer tu contraseña en AppSalon. Sigue el siguiente enlace para hacerlo.</p>";
        $contenido .= "<p> Presiona aquí: <a href=' ". $_ENV['APP_URL'] ."/reestablecer-cuenta?token={$this->token}'>Reestablecer Contraseña</a></p>";
        $contenido .= "<p>Si tú no solicitaste este cambio, puedes ignorar el mensaje.</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        $mail->send();  
    }
}


?>