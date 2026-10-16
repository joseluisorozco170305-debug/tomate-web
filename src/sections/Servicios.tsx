import { motion } from "framer-motion";
import { BookOpenText, LayoutDashboard, MessageCircle, Nfc, Palette, ShoppingBag, Sparkles, Store } from "lucide-react";
import { Revelar, TituloSube } from "../components/Revelar";

const BANDA = [
  { t: "Menús digitales", i: BookOpenText },
  { t: "Catálogos", i: ShoppingBag },
  { t: "Pedidos por WhatsApp", i: MessageCircle },
  { t: "Paneles de control", i: LayoutDashboard },
  { t: "Estampas NFC", i: Nfc },
  { t: "Logo y marca", i: Palette },
  { t: "Negocios locales", i: Store },
];

export function Banda() {
  const items = [...BANDA, ...BANDA];
  return (
    <div className="banda" aria-label="Lo que hacemos">
      <div className="banda-pista">
        {items.map((b, i) => (
          <span className="banda-item" key={i} aria-hidden={i >= BANDA.length}>
            <b.i /> {b.t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Servicios() {
  return (
    <section className="seccion" id="servicios" aria-labelledby="serv-titulo">
      <div className="contenedor">
        <div className="cabecera">
          <TituloSube id="serv-titulo" lineas={["Tu negocio, abierto", "las 24 horas."]} />
          <Revelar retraso={0.15}>
            <p>Mientras duermes, tu página enseña tu menú, toma pedidos y hace que te encuentren. Esto es lo que armamos para ti:</p>
          </Revelar>
        </div>

        <div className="bento">
          <Revelar className="bento-item vidrio b-a">
            <div className="ico-grande" style={{ color: "var(--piedra)" }}><MessageCircle /></div>
            <div className="demo-pedido" aria-hidden="true">
              <motion.div className="burbuja yo" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                Hola, quiero 2 charolas medianas 🍓
              </motion.div>
              <motion.div className="burbuja" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
                Pedido #12 recibido · Total $240 ✓
              </motion.div>
            </div>
            <h3>Pedidos directo a tu WhatsApp</h3>
            <p>Tus clientes eligen, arman su pedido y te llega listo y ordenado. Sin apps raras, sin comisiones.</p>
          </Revelar>

          <Revelar className="bento-item vidrio b-b" retraso={0.1}>
            <div className="nfc-ondas" aria-hidden="true">
              <span /><span /><span />
              <div className="sticker"><Nfc /></div>
            </div>
            <h3>Un toque y ya</h3>
            <p>Estampas NFC: acercan el celular y se abre tu página.</p>
          </Revelar>

          <Revelar className="bento-item vidrio b-c">
            <div className="ico-grande" style={{ color: "var(--arena)" }}><Palette /></div>
            <div className="estilo-muestras" aria-hidden="true">
              <i style={{ background: "#6e473b" }} />
              <i style={{ background: "#a78d78" }} />
              <i style={{ background: "#beb5a9" }} />
              <i style={{ background: "#e1d4c2" }} />
            </div>
            <h3>Con tu estilo</h3>
            <p>Te ayudamos con tu logo y tu marca para que todo combine.</p>
          </Revelar>

          <Revelar className="bento-item vidrio b-d" retraso={0.1}>
            <div className="ico-grande" style={{ color: "var(--piedra)" }}><LayoutDashboard /></div>
            <div className="demo-panel" aria-hidden="true">
              <div className="demo-fila"><span>Fresas con crema</span><span className="precio">$85</span><span className="interruptor" /></div>
              <div className="demo-fila"><span>Mini hotcakes</span><span className="precio">$70</span><span className="interruptor off" /></div>
            </div>
            <h3>Tú tienes el control</h3>
            <p>Cambia precios, fotos y productos desde tu propio panel. ¿Se acabó algo? Lo apagas en un toque.</p>
          </Revelar>
        </div>

        <Revelar retraso={0.1} style={{ display: "flex", justifyContent: "center", marginTop: "var(--e-5)" }}>
          <p className="pastilla" style={{ margin: 0 }}>
            <Sparkles size={16} style={{ color: "var(--arena)" }} /> Funciones a medida: lo que tu negocio necesite, dentro de tu paquete
          </p>
        </Revelar>
      </div>
    </section>
  );
}
