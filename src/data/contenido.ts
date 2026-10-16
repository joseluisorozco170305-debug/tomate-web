// Todo el contenido del sitio vive aquí: cambia textos, precios o enlaces sin tocar los componentes.

export const WHATSAPP = "525616288303";
export const INSTAGRAM = "https://www.instagram.com/tomateweb.mx/";
export const INSTAGRAM_USUARIO = "@tomateweb.mx";

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

export const MENSAJE_GENERAL = "Hola Tomate 🍅, quiero información para hacer mi página web.";

export type Paquete = {
  id: string;
  nombre: string;
  gancho: string;
  precio: number;
  mensualidad: number;
  ideal: string;
  destacado?: string;
  claves: string[];
  incluye: string[];
  topes: string[];
};

export const PAQUETES: Paquete[] = [
  {
    id: "organices",
    nombre: "Pa' que te organices",
    gancho: "Tu negocio en internet, bonito y al punto.",
    precio: 800,
    mensualidad: 100,
    ideal: "Para arrancar con todo sin gastar de más.",
    destacado: "El esencial",
    claves: ["Diseño a tu estilo", "Hasta 2 funciones a medida", "Pedidos directo a WhatsApp", "Logo sencillo incluido"],
    incluye: [
      "Diseño de sitio web personalizado",
      "Funciones a medida para tu negocio o emprendimiento",
      "Contacto directo a WhatsApp",
      "Ayuda con diseño de logo y creación de marca",
      "Sistemas funcionales",
      "Garantía de un mes",
    ],
    topes: [
      "Sitio de 1 página con varias secciones",
      "Hasta 2 funciones a medida",
      "Logo y marca: diseño de un logo sencillo",
    ],
  },
  {
    id: "controles",
    nombre: "Pa' que lo controles",
    gancho: "Cambia precios y fotos tú solito, sin depender de nadie.",
    precio: 1200,
    mensualidad: 150,
    ideal: "Para menús y catálogos que cambian seguido.",
    destacado: "El favorito",
    claves: ["Todo lo del primero", "Panel de control propio", "Hasta 4 funciones a medida", "Catálogo de hasta 50 productos"],
    incluye: [
      "Todo lo de “Pa' que te organices”",
      "Panel de control funcional",
      "Edita textos y fotos de tu página",
      "Edita tu menú o catálogo: productos y precios",
      "Gestión de pedidos o inventario",
      "Guía en PDF para usar tu panel",
    ],
    topes: [
      "Hasta 4 funciones a medida",
      "Menú o catálogo de hasta 50 productos",
    ],
  },
  {
    id: "ventas",
    nombre: "Pa' que mejoren las ventas",
    gancho: "Tu página llega a la mano de tus clientes con un toque.",
    precio: 1500,
    mensualidad: 150,
    ideal: "Para negocios que quieren que más gente los encuentre.",
    destacado: "El más completo",
    claves: ["Todo lo del segundo", "50 estampas NFC", "Hasta 6 funciones a medida", "Más alcance que solo redes"],
    incluye: [
      "Todo lo de “Pa' que lo controles”",
      "50 estampas NFC conectadas a tu sitio",
      "Acercan el celular y abre tu página al instante",
      "Llega a más lugares que solo redes sociales",
    ],
    topes: [
      "Hasta 6 funciones a medida",
      "Estampas NFC adhesivas lisas (sin impresión)",
      "Todas abren la página principal de tu negocio",
    ],
  },
];

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
    c: "Tomate Desarrollo Web diseña y desarrolla sitios web personalizados según el paquete contratado. El alcance de cada paquete (número de páginas, funciones a medida, productos en catálogo y estampas NFC) es el descrito en esta página.",
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
    c: "Las estampas del paquete “Pa' que mejoren las ventas” son adhesivas, lisas y sin impresión, programadas para abrir la página principal del cliente. Su funcionamiento depende de que el celular tenga NFC activado.",
  },
  {
    t: "8. Portafolio",
    c: "Podemos mostrar el sitio terminado en nuestro portafolio, salvo que el cliente solicite lo contrario por escrito.",
  },
];
