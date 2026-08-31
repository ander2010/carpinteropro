<?php
/**
 * Plantilla de credenciales SMTP + Google Sheets para public/contact.php.
 *
 * Copia este archivo como "mail-config.php" y completa los valores reales.
 * mail-config.php NO se sube a git (ver .gitignore), para no exponer la
 * contraseña en un repositorio público.
 *
 * DÓNDE SUBIRLO — importante si usas el deploy automático de Git de hPanel:
 * ese deploy REEMPLAZA por completo el contenido de la carpeta pública en
 * cada push (borra cualquier archivo que hayas subido a mano ahí, esté o no
 * en git). contact.php busca este archivo primero UN NIVEL ARRIBA de la
 * carpeta pública (fuera de lo que el deploy reemplaza) y, si no lo
 * encuentra ahí, dentro de la carpeta pública. Así que:
 *   - Con Git auto-deploy en hPanel: sube "mail-config.php" a la carpeta
 *     PADRE de la carpeta pública (ej. si el sitio se sirve desde
 *     .../public_html/, súbelo a .../ — un nivel arriba de public_html).
 *   - Con FTP manual (subiendo dist/ tú mismo): puedes subirlo dentro de la
 *     misma carpeta pública, junto a contact.php; ahí no hay riesgo de que
 *     un deploy automático lo borre.
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
 *
 * SHEETS_WEBHOOK_URL / SHEETS_SHARED_SECRET: cada lead válido se registra
 * como una fila nueva en un Google Sheet, vía un Google Apps Script Web App
 * (no requiere cuenta de servicio de Google Cloud ni Composer). Ver
 * DEPLOYMENT.md, sección "Formulario de contacto", para el script exacto a
 * pegar en el Sheet y los pasos de despliegue. Si se deja
 * SHEETS_WEBHOOK_URL vacío, el registro en Sheets simplemente se omite (el
 * email sigue funcionando igual).
 */

define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465); // 465 = SSL implícito (probar primero). 587 = STARTTLS.
define('SMTP_SECURE', 'ssl'); // 'ssl' para el puerto 465, 'tls' para el 587.
define('SMTP_USER', 'info@carpinteropro.com'); // Buzón real creado en hPanel.
define('SMTP_PASSWORD', 'CAMBIA-ESTO-por-la-contrasena-real-del-buzon');

define('SHEETS_WEBHOOK_URL', ''); // URL de "/exec" del Google Apps Script desplegado (ver DEPLOYMENT.md).
define('SHEETS_SHARED_SECRET', 'CAMBIA-ESTO-por-un-secreto-largo-y-unico'); // Debe coincidir con SHARED_SECRET en el Apps Script.
