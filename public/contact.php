<?php
/**
 * contact.php — recibe el envío del formulario de presupuesto (QuoteForm),
 * registra el lead en Google Sheets y manda un email con el resumen y las
 * fotos adjuntas a TO_EMAIL, usando SMTP autenticado (vía PHPMailer) en vez
 * de mail() nativo.
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
 *      completar host/usuario/contraseña reales de SMTP, más la URL del
 *      Google Apps Script y el secreto compartido (ver ese archivo y
 *      DEPLOYMENT.md, sección "Formulario de contacto"). mail-config.php NO
 *      se sube a git — solo por FTP/hPanel.
 *   3. PUBLIC_CONTACT_ENDPOINT=/contact.php en el .env usado para compilar
 *      el sitio.
 *
 * El registro en Google Sheets y el envío del email se intentan por
 * separado: si uno de los dos falla, el otro igual se intenta, para no
 * perder el lead solo porque un canal falló. Se responde error al
 * visitante únicamente si AMBOS fallan.
 *
 * Usa PHPMailer (public/lib/phpmailer/, incluido en el repo tal cual desde
 * https://github.com/PHPMailer/PHPMailer — sin Composer).
 */

declare(strict_types=1);

date_default_timezone_set('America/New_York');

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

// ZIP codes de Miami-Dade y Broward (Florida), usados para rellenar la
// columna "Condado" del Google Sheet cuando el cliente escribe un código
// postal reconocible en "Ubicación". Fuente: listados públicos de USPS por
// condado. Si el ZIP no aparece en ninguna lista, la columna queda vacía.
const MIAMI_DADE_ZIPS = [
    '33002', '33010', '33011', '33012', '33013', '33014', '33015', '33016', '33017', '33018',
    '33030', '33031', '33032', '33033', '33034', '33035', '33039', '33054', '33055', '33056',
    '33090', '33092', '33101', '33102', '33106', '33109', '33111', '33112', '33114', '33116',
    '33119', '33122', '33124', '33125', '33126', '33127', '33128', '33129', '33130', '33131',
    '33132', '33133', '33134', '33135', '33136', '33137', '33138', '33139', '33140', '33141',
    '33142', '33143', '33144', '33145', '33146', '33147', '33149', '33150', '33151', '33152',
    '33153', '33154', '33155', '33156', '33157', '33158', '33160', '33161', '33162', '33163',
    '33164', '33165', '33166', '33167', '33168', '33169', '33170', '33172', '33173', '33174',
    '33175', '33176', '33177', '33178', '33179', '33180', '33181', '33182', '33183', '33184',
    '33185', '33186', '33187', '33188', '33189', '33190', '33191', '33192', '33193', '33194',
    '33195', '33196', '33197', '33198', '33199', '33206', '33222', '33231', '33233', '33234',
    '33238', '33239', '33242', '33243', '33245', '33247', '33255', '33256', '33257', '33261',
    '33265', '33266', '33269', '33280', '33283', '33296', '33299',
];
const BROWARD_ZIPS = [
    '33004', '33008', '33009', '33019', '33020', '33021', '33022', '33023', '33024', '33025',
    '33026', '33027', '33028', '33029', '33060', '33061', '33062', '33063', '33064', '33065',
    '33066', '33067', '33068', '33069', '33071', '33072', '33073', '33074', '33075', '33076',
    '33077', '33081', '33082', '33083', '33084', '33093', '33097', '33301', '33302', '33303',
    '33304', '33305', '33306', '33307', '33308', '33309', '33310', '33311', '33312', '33313',
    '33314', '33315', '33316', '33317', '33318', '33319', '33320', '33321', '33322', '33323',
    '33324', '33325', '33326', '33327', '33328', '33329', '33330', '33331', '33332', '33334',
    '33335', '33336', '33337', '33338', '33339', '33340', '33345', '33346', '33348', '33349',
    '33351', '33355', '33359', '33388', '33394', '33441', '33442', '33443',
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

// Se busca primero UN NIVEL ARRIBA de esta carpeta (fuera de lo que el
// deploy de Git reemplaza en cada push) y, si no está ahí, dentro de esta
// misma carpeta (útil para FTP manual, donde no hay ese problema).
$mailConfigCandidates = [__DIR__ . '/../mail-config.php', __DIR__ . '/mail-config.php'];
$mailConfigPath = null;
foreach ($mailConfigCandidates as $candidate) {
    if (is_file($candidate)) {
        $mailConfigPath = $candidate;
        break;
    }
}
if ($mailConfigPath === null) {
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
$pageUrl = cleanText((string) ($_POST['pageUrl'] ?? ''));
$utmSource = cleanText((string) ($_POST['utmSource'] ?? ''));
$utmMedium = cleanText((string) ($_POST['utmMedium'] ?? ''));
$utmCampaign = cleanText((string) ($_POST['utmCampaign'] ?? ''));

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

// ZIP y condado, a partir del campo de ubicación (texto libre).
$zip = '';
if (preg_match('/\b\d{5}\b/', $location, $zipMatch)) {
    $zip = $zipMatch[0];
}
$county = '';
if ($zip !== '') {
    if (in_array($zip, MIAMI_DADE_ZIPS, true)) {
        $county = 'Miami-Dade';
    } elseif (in_array($zip, BROWARD_ZIPS, true)) {
        $county = 'Broward';
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
// Registro del lead en Google Sheets (vía Google Apps Script Web App).
// Best-effort: si falla, no interrumpe el envío del email.
// -----------------------------------------------------------------------
function appendLeadToSheet(array $row): bool
{
    if (!defined('SHEETS_WEBHOOK_URL') || SHEETS_WEBHOOK_URL === '' || !function_exists('curl_init')) {
        return false;
    }

    $row['secret'] = defined('SHEETS_SHARED_SECRET') ? SHEETS_SHARED_SECRET : '';

    $ch = curl_init(SHEETS_WEBHOOK_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($row),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $httpCode !== 200) {
        return false;
    }

    $decoded = json_decode((string) $response, true);
    return is_array($decoded) && ($decoded['success'] ?? false) === true;
}

$leadId = 'CP-' . date('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
$now = new DateTime('now');
$photosSummary = count($attachments) > 0 ? count($attachments) . ' foto(s) (enviadas por email)' : '';

$sheetOk = appendLeadToSheet([
    'leadId' => $leadId,
    'fecha' => $now->format('Y-m-d'),
    'hora' => $now->format('H:i'),
    'nombre' => $name,
    'telefono' => $phone,
    'email' => $email,
    'zip' => $zip,
    'condado' => $county,
    'tipoProyecto' => $projectType,
    'descripcion' => $description,
    'presupuesto' => $budget,
    'cuandoComenzar' => $preferredDate,
    'contactoPreferido' => implode(', ', $preferredContact),
    'fotos' => $photosSummary,
    'fuente' => 'Website',
    'paginaOrigen' => $pageUrl,
    'utmSource' => $utmSource,
    'utmMedium' => $utmMedium,
    'utmCampaign' => $utmCampaign,
    'consentimiento' => 'Sí — ' . $now->format('Y-m-d H:i'),
]);

// -----------------------------------------------------------------------
// Envío por SMTP autenticado (PHPMailer). Best-effort: si falla, no borra
// el registro ya guardado en el Sheet.
// -----------------------------------------------------------------------
$mailOk = true;
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
        "[{$leadId}] Nueva solicitud de presupuesto" . ($context !== '' ? " — {$context}" : '') . " — {$name}";
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
    $mailOk = false;
}

if (!$sheetOk && !$mailOk) {
    respond(500, ['success' => false, 'error' => 'send_failed']);
}

respond(200, ['success' => true]);
