<?php
/**
 * contact.php — recibe el envío del formulario de presupuesto (QuoteForm) y
 * manda un email con el resumen y las fotos adjuntas a TO_EMAIL, usando SMTP
 * autenticado (vía PHPMailer) en vez de mail() nativo.
 *
 * mail() nativo no es fiable en hosting compartido: el hosting lo "acepta"
 * (mail() devuelve true) pero el correo no llega, porque sale sin
 * autenticación SPF/DKIM y el servidor de destino lo descarta o lo manda a
 * spam (así ocurre en Hostinger, confirmado en su propia documentación).
 * Por eso este script se autentica con un buzón real de tu dominio por SMTP.
 *
 * Requisitos para activarlo:
 *   1. Crear un buzón real en tu hosting (en Hostinger: hPanel → Emails →
 *      Administrar → Crear cuenta de correo), ej. info@carpinteropro.com.
 *   2. Copiar public/mail-config.example.php a public/mail-config.php y
 *      completar host/usuario/contraseña reales de SMTP (ver ese archivo).
 *      mail-config.php NO se sube a git — solo por FTP/hPanel.
 *   3. PUBLIC_CONTACT_ENDPOINT=/contact.php en el .env usado para compilar
 *      el sitio.
 *
 * Usa PHPMailer (public/lib/phpmailer/, incluido en el repo tal cual desde
 * https://github.com/PHPMailer/PHPMailer — sin Composer).
 */

declare(strict_types=1);

require __DIR__ . '/lib/phpmailer/Exception.php';
require __DIR__ . '/lib/phpmailer/PHPMailer.php';
require __DIR__ . '/lib/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;

// -----------------------------------------------------------------------
// Configuración — ajusta estos valores si cambian los datos del negocio.
// -----------------------------------------------------------------------
const TO_EMAIL = 'info@carpinteropro.com';
const SITE_NAME = 'CarpinteroPro — Sitio web';
const SITE_ORIGIN = 'https://carpinteropro.com';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB por archivo
const MAX_TOTAL_BYTES = 15 * 1024 * 1024; // 15 MB en total (ajusta upload_max_filesize/post_max_size si hace falta más)
const ALLOWED_MIME_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];

header('Content-Type: application/json; charset=utf-8');

/**
 * Responde en JSON y termina la ejecución.
 */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'error' => 'method_not_allowed']);
}

$mailConfigPath = __DIR__ . '/mail-config.php';
if (!is_file($mailConfigPath)) {
    respond(500, ['success' => false, 'error' => 'mail_config_missing']);
}
require $mailConfigPath;

// Solo aceptamos envíos que vengan del propio sitio (evita que este script
// se use como relay de correo desde cualquier otra web).
$referer = $_SERVER['HTTP_REFERER'] ?? '';
if ($referer !== '' && stripos($referer, SITE_ORIGIN) !== 0) {
    respond(403, ['success' => false, 'error' => 'forbidden_origin']);
}

// Honeypot: si el campo oculto "company" trae contenido, es casi seguro un
// bot. Respondemos como si todo hubiese ido bien, sin enviar el email.
if (trim((string) ($_POST['company'] ?? '')) !== '') {
    respond(200, ['success' => true]);
}

/**
 * Quita saltos de línea (para evitar inyección de cabeceras) y recorta espacios.
 */
function cleanText(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

$name = cleanText((string) ($_POST['name'] ?? ''));
$phone = cleanText((string) ($_POST['phone'] ?? ''));
$description = trim((string) ($_POST['description'] ?? ''));
$consent = (string) ($_POST['consent'] ?? '');

if ($name === '' || $phone === '' || $description === '' || $consent === '') {
    respond(422, ['success' => false, 'error' => 'missing_required_fields']);
}

$email = cleanText((string) ($_POST['email'] ?? ''));
$replyToEmail = null;
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $replyToEmail = $email;
}

$context = cleanText((string) ($_POST['context'] ?? ''));
$projectType = cleanText((string) ($_POST['projectType'] ?? ''));
$location = cleanText((string) ($_POST['location'] ?? ''));
$preferredDate = cleanText((string) ($_POST['preferredDate'] ?? ''));
$budget = cleanText((string) ($_POST['budget'] ?? ''));

$preferredContact = [];
if (isset($_POST['preferredContact'])) {
    $raw = is_array($_POST['preferredContact']) ? $_POST['preferredContact'] : [$_POST['preferredContact']];
    foreach ($raw as $item) {
        $item = cleanText((string) $item);
        if ($item !== '') {
            $preferredContact[] = $item;
        }
    }
}

// -----------------------------------------------------------------------
// Cuerpo del email
// -----------------------------------------------------------------------
$lines = [];
if ($context !== '') {
    $lines[] = "Proyecto: {$context}";
}
$lines[] = "Nombre: {$name}";
$lines[] = "Teléfono: {$phone}";
if ($email !== '') {
    $lines[] = "Email: {$email}";
}
if ($projectType !== '') {
    $lines[] = "Tipo de proyecto: {$projectType}";
}
if ($location !== '') {
    $lines[] = "Ubicación: {$location}";
}
if ($preferredDate !== '') {
    $lines[] = "Fecha aproximada: {$preferredDate}";
}
if ($budget !== '') {
    $lines[] = "Presupuesto: {$budget}";
}
$lines[] = "Descripción:\n{$description}";
if ($preferredContact !== []) {
    $lines[] = 'Método de contacto preferido: ' . implode(', ', $preferredContact);
}

$body = implode("\n\n", $lines);

// -----------------------------------------------------------------------
// Adjuntos (input file con name="photos[]") — se valida cada archivo y se
// deja la ruta temporal lista; PHPMailer se encarga de leerlos y adjuntarlos.
// -----------------------------------------------------------------------
$attachments = [];
$totalBytes = 0;

if (isset($_FILES['photos']) && is_array($_FILES['photos']['name'] ?? null)) {
    if (!function_exists('finfo_open')) {
        respond(500, ['success' => false, 'error' => 'fileinfo_not_available']);
    }

    $files = $_FILES['photos'];
    $count = count($files['name']);

    for ($i = 0; $i < $count; $i++) {
        if (count($attachments) >= MAX_FILES) {
            break;
        }

        $error = $files['error'][$i] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($error !== UPLOAD_ERR_OK) {
            respond(422, ['success' => false, 'error' => 'file_upload_error']);
        }

        $tmpPath = $files['tmp_name'][$i];
        $size = (int) $files['size'][$i];

        if (!is_uploaded_file($tmpPath)) {
            respond(422, ['success' => false, 'error' => 'invalid_upload']);
        }
        if ($size > MAX_FILE_BYTES) {
            respond(422, ['success' => false, 'error' => 'file_too_large']);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = $finfo !== false ? finfo_file($finfo, $tmpPath) : false;
        if ($finfo !== false) {
            finfo_close($finfo);
        }

        if ($mime === false || !isset(ALLOWED_MIME_TYPES[$mime])) {
            respond(422, ['success' => false, 'error' => 'invalid_file_type']);
        }

        $totalBytes += $size;
        if ($totalBytes > MAX_TOTAL_BYTES) {
            respond(422, ['success' => false, 'error' => 'attachments_too_large']);
        }

        $attachments[] = [
            'path' => $tmpPath,
            'filename' => 'foto-' . ($i + 1) . '.' . ALLOWED_MIME_TYPES[$mime],
            'mime' => $mime,
        ];
    }
}

// -----------------------------------------------------------------------
// Envío por SMTP autenticado (PHPMailer)
// -----------------------------------------------------------------------
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_SECURE === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = SMTP_PORT;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    // El "From" debe coincidir con el buzón autenticado: la mayoría de
    // servidores SMTP (incluido Hostinger) rechazan o marcan como spam un
    // From distinto de la cuenta que se autentica.
    $mail->setFrom(SMTP_USER, SITE_NAME);
    $mail->addAddress(TO_EMAIL);
    if ($replyToEmail !== null) {
        $mail->addReplyTo($replyToEmail, $name !== '' ? $name : $replyToEmail);
    }

    $mail->Subject =
        'Nueva solicitud de presupuesto' . ($context !== '' ? " — {$context}" : '') . " — {$name}";
    $mail->isHTML(false);
    $mail->Body = $body;

    foreach ($attachments as $attachment) {
        $mail->addAttachment(
            $attachment['path'],
            $attachment['filename'],
            PHPMailer::ENCODING_BASE64,
            $attachment['mime'],
        );
    }

    $mail->send();
} catch (PHPMailerException $e) {
    respond(500, ['success' => false, 'error' => 'send_failed']);
}

respond(200, ['success' => true]);
