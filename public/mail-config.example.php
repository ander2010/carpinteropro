<?php
/**
 * Plantilla de credenciales SMTP para public/contact.php.
 *
 * Copia este archivo como "mail-config.php" (misma carpeta) y completa los
 * valores reales. mail-config.php NO se sube a git (ver .gitignore): se
 * sube solo por FTP / hPanel junto al resto de public/, para no exponer la
 * contraseña en un repositorio público.
 *
 * mail() nativo de PHP no entrega de forma confiable en hosting compartido
 * (Hostinger y la mayoría de hostings modernos lo filtran por falta de
 * SPF/DKIM): por eso contact.php envía por SMTP autenticado usando un buzón
 * real de tu dominio.
 *
 * Pasos en hPanel (Hostinger):
 *   1. Emails → Administrar → Crear cuenta de correo
 *      (ej. info@carpinteropro.com, o un no-reply@carpinteropro.com si
 *      prefieres separar el buzón de envío del de recepción).
 *   2. SMTP_PASSWORD es la contraseña de ESE buzón — NO la contraseña de tu
 *      cuenta de Hostinger/hPanel.
 */

define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465); // 465 = SSL implícito (probar primero). 587 = STARTTLS.
define('SMTP_SECURE', 'ssl'); // 'ssl' para el puerto 465, 'tls' para el 587.
define('SMTP_USER', 'info@carpinteropro.com'); // Buzón real creado en hPanel.
define('SMTP_PASSWORD', 'CAMBIA-ESTO-por-la-contrasena-real-del-buzon');
