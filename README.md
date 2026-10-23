# 🍅 Asistente Tomate · DMs de Instagram con IA

Un asistente que **lee y entiende** los mensajes de @tomateweb.mx y contesta solo, como lo harías tú:
analiza qué quiere la persona, le recomienda el paquete que le queda, saca sus datos (negocio, presupuesto)
y te avisa con 🚩 cuando algo lo tienes que ver tú (pagos, descuentos, quejas, cosas raras).

Todo gratis: API oficial de Instagram + Gemini (free tier) + hosting gratis.

---

## Qué hace

- **Responde solo** usando Gemini, con la info de tus paquetes y tu tono (editable desde el panel).
- **Junta mensajes seguidos**: si alguien manda 3 mensajes rápido, espera y contesta todo junto.
- **Se hace a un lado cuando tú entras**: si contestas desde la app de IG o desde el panel, el bot se calla en ese chat (6 h por defecto).
- **Analiza cada chat**: intención, ánimo, urgencia, paquete ideal y datos del cliente.
- **Banderas 🚩** para lo que necesita a un humano.
- **Panel web** con contraseña: ver chats, pausar el bot por chat o todo, contestar tú, simulador y "cerebro" editable.
- **Simulador**: pruebas cómo contesta sin tocar Instagram.

---

## 0. Pruébalo YA (sin configurar nada)

Necesitas Node.js 18 o más nuevo.

```bash
npm install
npm run demo
```

Abre http://localhost:3000/panel → contraseña `tomate` → pestaña **Simulador**. La IA es de mentiritas (modo demo), pero ves cómo funciona todo.

---

## 1. Llave de Gemini (gratis, 2 min)

1. Entra a https://aistudio.google.com/apikey con tu cuenta de Google.
2. **Create API key** → cópiala.
3. Va en `GEMINI_API_KEY` del `.env`.

⚠️ Ojo: en el plan gratis, Google puede usar los mensajes para mejorar sus modelos. Para un negocio chiquito está bien, pero no le pases datos sensibles al bot (tarjetas, contraseñas). Si algún día crece, activas facturación y deja de pasar.

---

## 2. Instagram (Meta for Developers)

### 2.1 Cuenta profesional
En la app de IG: Configuración → Tipo de cuenta → **Cambiar a cuenta profesional** (Creador o Empresa). @tomateweb.mx ya debería estar.

### 2.2 Crear la app
1. Entra a https://developers.facebook.com/apps → **Crear app**.
2. Tipo **Business** (Negocio) → nombre "Asistente Tomate".
3. En el panel de la app, agrega el producto **Instagram** → elige **API setup with Instagram login** (no necesitas página de Facebook).
4. En **App settings > Basic** copia el **Instagram app secret** → va en `IG_APP_SECRET`.

### 2.3 Token de acceso
1. En Instagram > API setup > **Generate access tokens** → **Add account** → entra con @tomateweb.mx.
2. Acepta los permisos (`instagram_business_basic` e `instagram_business_manage_messages`).
3. Copia el token → `IG_ACCESS_TOKEN`. Ahí mismo aparece el ID de la cuenta → `IG_USER_ID`.

El token dura ~60 días; Meta te deja renovarlo desde el mismo lugar. Ponte recordatorio.

### 2.4 Webhook
Primero sube el server (paso 4) para tener una URL pública. Luego:
1. En **Configure webhooks**: Callback URL = `https://TU-URL/webhook`, Verify token = lo mismo que pusiste en `IG_VERIFY_TOKEN`.
2. **Verify and save**.
3. Suscribe el campo **messages** (y si quieres `messaging_postbacks`).
4. En la sección de la cuenta, activa la suscripción de webhooks para @tomateweb.mx.

### 2.5 La parte que nadie te dice (importante)
- **Mientras la app esté en modo desarrollo**, solo funciona con gente que tenga un rol en la app. O sea: agrega tu cuenta personal de IG como **Instagram Tester** (App roles > Roles), acepta la invitación en IG (Configuración > Apps y sitios web > Invitaciones de tester) y prueba mandándole DMs a @tomateweb.mx desde ahí.
- **Para que conteste a cualquier persona** necesitas **Advanced Access** al permiso `instagram_business_manage_messages`. Eso pide:
  - Poner la app en modo **Live** (te pide URL de política de privacidad: puedes hacer una página en tu sitio de Tomate).
  - **Verificación del negocio** en Meta Business (con tus datos de freelancer / RFC).
  - **App Review**: un video corto mostrando cómo funciona el bot y para qué usas los mensajes.
  Es gratis, solo tarda unos días. Mientras, todo lo pruebas con tu cuenta tester.
- En los ajustes de IG de @tomateweb.mx: Configuración → Mensajes y respuestas a historias → Herramientas de mensajes conectadas → **Permitir acceso a los mensajes** = activado.
- Instagram solo te deja contestar dentro de las **24 h** después del último mensaje de la persona. El bot contesta en segundos, así que no hay pedo.

---

## 3. Configura el `.env`

Copia `.env.example` como `.env` y llénalo:

```env
IG_VERIFY_TOKEN=una-palabra-secreta-que-inventes
IG_APP_SECRET=...
IG_ACCESS_TOKEN=...
IG_USER_ID=...
GEMINI_API_KEY=...
PANEL_PASSWORD=una-contraseña-buena
```

Luego `npm start`. Al arrancar te dice qué te falta.

---

## 4. Subirlo a internet gratis

Meta necesita una URL pública con HTTPS. Opciones:

### A) Render (recomendado para empezar)
1. Sube esta carpeta a un repo de GitHub (sin el `.env`, ya está en `.gitignore`).
2. https://render.com → New → **Web Service** → conecta el repo.
3. Build: `npm install` · Start: `npm start` · Plan: **Free**.
4. En **Environment** pega las variables del `.env`.
5. Tu URL queda tipo `https://asistente-tomate.onrender.com` → webhook: `/webhook`, panel: `/panel`.

Lo malo del plan gratis de Render:
- Se **duerme** tras 15 min sin uso; el primer mensaje tarda ~30-50 s en despertar (Meta reintenta, así que igual llega).
- El disco se **borra** cuando se reinicia: se pierden los chats guardados y los cambios del "Cerebro". Por eso: lo que cambies en el Cerebro, cópialo también a `src/defaults.js` y súbelo al repo. (Siguiente nivel: conectar una base gratis tipo Supabase o Turso; lo armamos cuando quieras.)

Truco para que no se duerma: un monitor gratis (UptimeRobot o cron-job.org) que visite `https://TU-URL/health` cada 10 min.

### B) Tu compu + túnel (100% gratis y sin borrarse)
```bash
npm start
# en otra terminal:
npx cloudflared tunnel --url http://localhost:3000
```
Te da una URL `https://algo.trycloudflare.com`. Lo malo: cambia cada vez y la compu debe estar prendida.

---

## Cómo usar el panel

- **Chats**: lista de conversaciones. 🚩 = te necesita, ⏸ = bot en pausa ahí, número rojo = mensajes nuevos.
  A la derecha ves lo que entendió la IA y los datos del cliente.
  Abajo puedes contestar tú (eso pausa al bot en ese chat).
- **Interruptor "Bot prendido"**: apaga el bot en TODOS los chats de un jalón.
- **Simulador**: escribe como cliente para probar respuestas. No manda nada a IG.
- **Cerebro**: personalidad, info del negocio, tiempos de espera, aviso de asistente y mensaje de respaldo.

---

## Estructura

```
src/
  server.js     → servidor, webhook y API del panel
  bot.js        → lógica: juntar mensajes, pausas, responder
  ai.js         → prompt + llamada a Gemini (con modelos de respaldo)
  instagram.js  → API oficial de IG (mandar, "escribiendo…", perfil, firma)
  db.js         → base de datos en data/db.json
  defaults.js   → personalidad e info del negocio por defecto
public/
  panel.html    → el panel completo
```

## Ideas para la v2
- Que entienda **audios** e **imágenes** (Gemini puede, falta descargarlos).
- Avisarte por **Telegram** cuando haya 🚩.
- Guardar leads en Google Sheets.
- Llevarlo a **WhatsApp** con la misma lógica (solo cambia `instagram.js`).
- Base de datos gratis en la nube para no perder nada en Render.
