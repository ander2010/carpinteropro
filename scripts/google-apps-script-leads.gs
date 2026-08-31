/**
 * Google Apps Script — recibe los leads del formulario de CarpinteroPro
 * (enviados por public/contact.php) y agrega cada uno como una fila nueva
 * en este Google Sheet. Nunca reemplaza filas existentes.
 *
 * No requiere una cuenta de servicio de Google Cloud ni Composer: se
 * ejecuta directamente dentro del propio Sheet.
 *
 * ---------------------------------------------------------------------
 * INSTALACIÓN (ver también DEPLOYMENT.md, sección "Formulario de contacto")
 * ---------------------------------------------------------------------
 *   1. Abre el Google Sheet de leads → menú Extensiones → Apps Script.
 *   2. Borra el contenido de Code.gs y pega este archivo completo.
 *   3. Reemplaza SHARED_SECRET (abajo) por un valor secreto — debe ser
 *      EXACTAMENTE el mismo valor que pongas en SHEETS_SHARED_SECRET
 *      dentro de public/mail-config.php.
 *   4. Menú Implementar → Nueva implementación → tipo "Aplicación web".
 *        - Ejecutar como: Yo (tu cuenta).
 *        - Quién tiene acceso: Cualquier usuario.
 *      Autoriza los permisos que pida Google (son de tu propio Sheet).
 *   5. Copia la URL que termina en "/exec" — esa es SHEETS_WEBHOOK_URL en
 *      mail-config.php.
 *   6. En la FILA 1 del Sheet, escribe estos encabezados, uno por columna,
 *      de A a AB (en este orden exacto):
 *      Lead ID | Fecha | Hora | Nombre | Teléfono | Email | ZIP Code |
 *      Condado | Tipo de proyecto | Descripción | Presupuesto |
 *      Cuándo quiere comenzar | Contacto preferido | Fotos | Fuente |
 *      Página de origen | UTM Source | UTM Medium | UTM Campaign |
 *      Consentimiento | Estado | Carpintero asignado | Fecha asignación |
 *      Contactado | Presupuesto realizado | Trabajo cerrado |
 *      Valor del trabajo | Notas
 *
 * Si vuelves a "Implementar" tras editar el script, usa "Gestionar
 * implementaciones" → editar (ícono de lápiz) → Nueva versión, para que la
 * URL /exec siga funcionando sin tener que actualizar mail-config.php.
 */

const SHARED_SECRET = 'REEMPLAZA-ESTO-por-el-mismo-secreto-de-mail-config.php';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.secret !== SHARED_SECRET) {
      return jsonResponse({ success: false, error: 'unauthorized' });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    sheet.appendRow([
      data.leadId || '',
      data.fecha || '',
      data.hora || '',
      data.nombre || '',
      data.telefono || '',
      data.email || '',
      data.zip || '',
      data.condado || '',
      data.tipoProyecto || '',
      data.descripcion || '',
      data.presupuesto || '',
      data.cuandoComenzar || '',
      data.contactoPreferido || '',
      data.fotos || '',
      data.fuente || 'Website',
      data.paginaOrigen || '',
      data.utmSource || '',
      data.utmMedium || '',
      data.utmCampaign || '',
      data.consentimiento || '',
      'Nuevo', // Estado
      '', // Carpintero asignado
      '', // Fecha asignación
      'No', // Contactado
      'No', // Presupuesto realizado
      'No', // Trabajo cerrado
      '', // Valor del trabajo
      '', // Notas
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
