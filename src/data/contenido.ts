// Todo el contenido del sitio vive aquí: cambia textos, precios o enlaces sin tocar los componentes.

export const WHATSAPP = "525616288303";
export const INSTAGRAM = "https://www.instagram.com/tomateweb.mx/";
export const INSTAGRAM_USUARIO = "@tomateweb.mx";

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

export const MENSAJE_GENERAL = "Hola Tomate 🍅, quiero información para hacer mi página web.";

export type IconoFuncion = "diseno" | "legal" | "redes" | "analytics" | "panel" | "funciones" | "nfc";

export type Funcion = {
  icono: IconoFuncion;
  t: string; // título corto
  d: string; // gancho de una línea
};

export type Paquete = {
  id: string;
  nombre: string; // nombre completo, p. ej. "Paquete Tomate Básico"
  nivel: string; // la palabra que se destaca en la tarjeta
  gancho: string;
  precio: number;
  mensualidad: number;
  ideal: string;
  destacado?: string;
  hereda?: string; // id del paquete cuyo contenido ya trae
  nuevas: Funcion[]; // lo que este paquete suma
  incluye: string[]; // detalle completo
  topes: string[];
};

const BASICO: Funcion[] = [
  { icono: "diseno", t: "Diseño personalizado", d: "Tu página a tu estilo y a la medida de tu negocio." },
  { icono: "legal", t: "Políticas y asuntos legales", d: "Aviso de privacidad y términos, en su propia página." },
  { icono: "redes", t: "Botones a tus redes", d: "Instagram, Facebook, TikTok… a un toque." },
  { icono: "analytics", t: "Google Analytics", d: "Con informe mensual de cómo te va." },
];

const AVANZADO: Funcion[] = [
  { icono: "panel", t: "Panel de control", d: "Cambia textos, fotos, productos y precios tú solito." },
  { icono: "funciones", t: "Apoyo en funciones", d: "Te echamos la mano con lo que tu negocio necesita." },
];

const PRO: Funcion[] = [
  { icono: "nfc", t: "50 estampas NFC", d: "Acercan el celular y se abre tu página al instante." },
];

export const PAQUETES: Paquete[] = [
  {
    id: "basico",
    nombre: "Paquete Tomate Básico",
    nivel: "Básico",
    gancho: "Tu negocio en internet, bonito, en regla y medido.",
    precio: 800,
    mensualidad: 100,
    ideal: "Para arrancar con todo sin gastar de más.",
    destacado: "El esencial",
    nuevas: BASICO,
    incluye: [
      "Diseño de página personalizado",
      "Página de políticas y asuntos legales",
      "Botones a tus redes sociales",
      "Tu sitio conectado a Google Analytics",
      "Informe mensual de visitas",
      "Garantía de un mes",
    ],
    topes: [
      "Sitio de 1 página con varias secciones",
      "Políticas: aviso de privacidad y términos y condiciones",
      "Informe mensual con los datos de Google Analytics",
    ],
  },
  {
    id: "avanzado",
    nombre: "Paquete Tomate Avanzado",
    nivel: "Avanzado",
    gancho: "Todo el Básico, y además tú tienes el control.",
    precio: 1200,
    mensualidad: 150,
    ideal: "Para menús y catálogos que cambian seguido.",
    destacado: "El favorito",
    hereda: "basico",
    nuevas: AVANZADO,
    incluye: [
      "Todo lo del Paquete Tomate Básico",
      "Panel de control funcional",
      "Edita textos y fotos de tu página",
      "Edita tu menú o catálogo: productos y precios",
      "Apoyo en funciones para tu negocio",
      "Guía en PDF para usar tu panel",
    ],
    topes: [
      "Menú o catálogo de hasta 50 productos",
      "Pedidos o inventario desde el panel",
    ],
  },
  {
    id: "pro",
    nombre: "Paquete Tomate Pro",
    nivel: "Pro",
    gancho: "Todo lo anterior, y tu página llega a la mano de tus clientes.",
    precio: 1500,
    mensualidad: 150,
    ideal: "Para negocios que quieren que más gente los encuentre.",
    destacado: "El más completo",
    hereda: "avanzado",
    nuevas: PRO,
    incluye: [
      "Todo lo del Paquete Tomate Avanzado",
      "50 estampas NFC conectadas a tu sitio",
      "Acercan el celular y abre tu página al instante",
      "Llega a más lugares que solo redes sociales",
    ],
    topes: [
      "Estampas NFC adhesivas lisas (sin impresión)",
      "Todas abren la página principal de tu negocio",
    ],
  },
];

/** Todas las funciones que trae un paquete, contando las que hereda. */
export function funcionesDe(p: Paquete): Funcion[] {
  const base = p.hereda ? PAQUETES.find((x) => x.id === p.hereda) : undefined;
  return [...(base ? funcionesDe(base) : []), ...p.nuevas];
}

export const MENSUALIDAD_CUBRE =
  "La mensualidad mantiene tu página en línea, segura y al día: correcciones menores y detalles, igual que durante la garantía.";

export type Proyecto = {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  url: string;
  etiquetas: string[];
  color: string;
  /**
   * Opcional: captura fija del sitio (sin iframes, carga al instante).
   * Guárdala en public/portafolio/ (ideal 1600×1040, .webp o .jpg) y pon aquí la ruta, p. ej. "/portafolio/charolas.webp".
   * Si no hay imagen, se muestra una portada diseñada con el nombre y los colores del proyecto.
   */
  imagen?: string;
};

export const PROYECTOS: Proyecto[] = [
  {
    id: "charolas",
    nombre: "Charolas Locas",
    tipo: "Tienda de postres con pedidos en línea",
    descripcion:
      "Menú completo con carrito, pedidos por WhatsApp con número de orden, envío por ubicación, códigos de descuento y panel de administración en tiempo real.",
    url: "https://charolas-locas.vercel.app/",
    etiquetas: ["Carrito", "Panel admin", "Pedidos en vivo"],
    color: "#BEB5A9",
  },
  {
    id: "dalto",
    nombre: "Dalto & Cobaiin Estudio",
    tipo: "Estudio de piercing y tatuaje",
    descripcion:
      "Dos marcas en un solo sitio: busto 3D interactivo con precios, catálogo de joyería, cotizador de tatuajes que genera un PDF y panel de control compartido.",
    url: "https://dalto-cobaiin-estudio.vercel.app/",
    etiquetas: ["Modelo 3D", "Cotizador", "Dos vistas"],
    color: "#A78D78",
  },
];

export const PROCESO = [
  { titulo: "Nos cuentas tu idea", texto: "Llenas un formulario cortito con lo que necesita tu negocio." },
  { titulo: "Diseñamos tu página", texto: "Armamos la propuesta a tu estilo y te la mostramos." },
  { titulo: "Afinamos detalles", texto: "Ajustas lo pequeño: tamaños, tipografía, textos." },
  { titulo: "¡Al aire!", texto: "Lanzamos tu sitio y arranca tu mes de garantía." },
];

export const PREGUNTAS = [
  {
    p: "¿Cuánto tardan en entregar mi página?",
    r: "Depende de cada proyecto: cuántas secciones lleva, las funciones a medida y qué tan rápido nos compartes tus fotos y textos. Al revisar tu idea te damos un tiempo estimado real.",
  },
  {
    p: "¿Qué cubre la garantía de un mes?",
    r: "Durante el primer mes después del lanzamiento corregimos detalles y errores menores sin costo. Cambiar formatos, funciones o muchos colores se cotiza aparte.",
  },
  {
    p: "¿Para qué es la mensualidad?",
    r: "Mantiene tu página en línea y funcionando. Después del primer mes cubre más o menos lo mismo que la garantía: correcciones menores y detalles.",
  },
  {
    p: "¿Tengo que empezar por el paquete más barato?",
    r: "No. Los paquetes no son una escalera: son tres opciones según tu presupuesto y las funciones que necesitas. Con cualquiera haces una gran inversión.",
  },
  {
    p: "¿Qué trae el informe mensual de Google Analytics?",
    r: "Cuánta gente visitó tu página, de dónde llegó (Google, Instagram, una estampa NFC…), qué fue lo más visto y desde qué dispositivos. Te lo mandamos cada mes en un resumen fácil de leer.",
  },
  {
    p: "¿Qué son las estampas NFC?",
    r: "Son stickers adhesivos con un chip. Tu cliente acerca su celular y se abre tu página al instante. Puedes pegarlas en tu mostrador, mesas, empaques o donde quieras.",
  },
  {
    p: "¿Puedo pedir cambios después de ver el diseño?",
    r: "Sí, puedes afinar detalles pequeños como tamaños, tipografía o textos antes de lanzar. Cambios grandes de estructura se platican y se cotizan aparte.",
  },
];

export const TERMINOS = [
  {
    t: "1. Servicio",
    c: "Tomate Desarrollo Web diseña y desarrolla sitios web personalizados según el paquete contratado. El alcance de cada paquete (número de páginas, panel de control, productos en catálogo, informes y estampas NFC) es el descrito en esta página.",
  },
  {
    t: "2. Proceso y aprobación",
    c: "El cliente comparte su idea mediante el formulario. Presentamos una propuesta de diseño; el cliente puede solicitar ajustes menores (tamaños, tipografía, textos) antes del lanzamiento. Cambios de estructura, funciones adicionales o rediseños se cotizan por separado.",
  },
  {
    t: "3. Pagos",
    c: "Los precios están en pesos mexicanos (MXN). El costo del paquete se cubre antes del lanzamiento según lo acordado. La mensualidad de mantenimiento se paga por adelantado cada mes a partir del segundo mes.",
  },
  {
    t: "4. Garantía",
    c: "Incluye un mes de garantía después del lanzamiento para corrección de errores y detalles menores. No cubre cambios de formato, nuevas funciones, cambios extensos de color ni contenido nuevo.",
  },
  {
    t: "5. Mantenimiento",
    c: "La mensualidad mantiene el sitio en línea y cubre correcciones menores. Si la mensualidad no se cubre, el sitio puede suspenderse hasta regularizar el pago.",
  },
  {
    t: "6. Contenido del cliente",
    c: "El cliente es responsable de que los textos, fotos, logos y marcas que comparte le pertenezcan o tenga permiso de usarlos. Los tiempos de entrega dependen de la entrega oportuna de este material.",
  },
  {
    t: "7. Estampas NFC",
    c: "Las estampas del Paquete Tomate Pro son adhesivas, lisas y sin impresión, programadas para abrir la página principal del cliente. Su funcionamiento depende de que el celular tenga NFC activado.",
  },
  {
    t: "8. Google Analytics e informes",
    c: "Conectamos el sitio a Google Analytics para medir visitas de forma anónima y agregada. Cada mes enviamos un informe con los datos principales. Las cifras dependen de lo que registre Google y de la configuración de privacidad de cada visitante.",
  },
  {
    t: "9. Portafolio",
    c: "Podemos mostrar el sitio terminado en nuestro portafolio, salvo que el cliente solicite lo contrario por escrito.",
  },
];
