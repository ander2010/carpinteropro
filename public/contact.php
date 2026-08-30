<?php
/**
 * contact.php — recibe el envío del formulario de presupuesto (QuoteForm) y
 * manda un email con el resumen y las fotos adjuntas a TO_EMAIL.
 *
 * No requiere Composer ni librerías externas: usa mail() (disponible en
 * prácticamente cualquier hosting cPanel/compartido) y construye a mano el
 * mensaje MIME multipart/mixed para poder adjuntar archivos.
 *
 * Para activarlo:
 *   1. Sube este archivo junto al resto del sitio (ya viaja dentro de dist/
 *      porque vive en public/, así que "npm run build" + subir dist/ es
 *      suficiente).
 *   2. En el .env usado para compilar el sitio, define:
 *        PUBLIC_CONTACT_ENDPOINT=/contact.php
 *   3. Verifica que el hosting tenga mail() habilitado (la mayoría de
 *      hostings cPanel lo traen activo por defecto).
 *
 * Si los correos llegan a spam, lo más probable es que falte configurar
 * SPF/DKIM para el dominio en el panel de DNS del hosting.
 */

declare(strict_types=1);

// -----------------------------------------------------------------------
// Configuración — ajusta estos valores si cambian los datos del negocio.
// -----------------------------------------------------------------------
const TO_EMAIL = 'info@carpinteropro.com';
const FROM_EMAIL = 'no-reply@carpinteropro.com'; // Debe ser un email del mismo dominio del sitio.
const FROM_NAME = 'CarpinteroPro — Sitio web';
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
// Adjuntos (input file con name="photos[]")
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

        $content = file_get_contents($tmpPath);
        if ($content === false) {
            respond(500, ['success' => false, 'error' => 'read_failed']);
        }

        $attachments[] = [
            'filename' => 'foto-' . ($i + 1) . '.' . ALLOWED_MIME_TYPES[$mime],
            'mime' => $mime,
            'content' => $content,
        ];
    }
}

// -----------------------------------------------------------------------
// Construcción y envío del email (MIME multipart/mixed hecho a mano)
// -----------------------------------------------------------------------
function encodeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

if (!function_exists('mail')) {
    respond(500, ['success' => false, 'error' => 'mail_not_available']);
}

$subjectRaw = 'Nueva solicitud de presupuesto' . ($context !== '' ? " — {$context}" : '') . " — {$name}";
$subject = encodeHeader($subjectRaw);

$boundary = 'CPRO-' . bin2hex(random_bytes(16));

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'From: ' . encodeHeader(FROM_NAME) . ' <' . FROM_EMAIL . '>';
if ($replyToEmail !== null) {
    $replyDisplay = $name !== '' ? encodeHeader($name) . ' <' . $replyToEmail . '>' : $replyToEmail;
    $headers[] = 'Reply-To: ' . $replyDisplay;
}
$headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

$message = "--{$boundary}\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n\r\n";
$message .= chunk_split(base64_encode($body));

foreach ($attachments as $attachment) {
    $message .= "--{$boundary}\r\n";
    $message .= "Content-Type: {$attachment['mime']}; name=\"{$attachment['filename']}\"\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n";
    $message .= "Content-Disposition: attachment; filename=\"{$attachment['filename']}\"\r\n\r\n";
    $message .= chunk_split(base64_encode($attachment['content']));
}

$message .= "--{$boundary}--";

$sent = mail(TO_EMAIL, $subject, $message, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['success' => false, 'error' => 'send_failed']);
}

respond(200, ['success' => true]);
