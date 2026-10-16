// Sanitiza texto del formulario: recorta, quita < > y caracteres de control, limita longitud.
export function limpiar(texto: string, max = 600) {
  return texto
    .replace(/[<>]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}
