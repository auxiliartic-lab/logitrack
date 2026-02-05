# Qué hacer en Supabase para conectar LogiTrack Pro

Sigue estos pasos **en orden** en el panel de Supabase.

---

## 1. Entrar a tu proyecto

1. Abre el navegador y ve a: **https://supabase.com/dashboard**
2. Inicia sesión si hace falta.
3. En la lista de proyectos, haz clic en el que tiene esta URL:
   - **https://xrpsvleodzlydlcdxpdq.supabase.co**
4. Comprueba en la barra de direcciones que diga algo como:
   - `.../project/xrpsvleodzlydlcdxpdq`

---

## 2. Abrir el SQL Editor

1. En el **menú izquierdo** del dashboard, haz clic en **SQL Editor** (icono de “</>” o texto “SQL Editor”).
2. Arriba a la derecha, haz clic en **New query** (Nueva consulta).

---

## 3. Pegar y ejecutar el script

1. Abre en tu computadora el archivo:
   - **`supabase-ejecutar-todo.sql`** (está en la carpeta del proyecto).
2. Selecciona **todo** el contenido (Ctrl+A) y cópialo (Ctrl+C).
3. En Supabase, en el cuadro de texto del SQL Editor, pega el contenido (Ctrl+V).
4. Pulsa el botón **Run** (o Ctrl+Enter).
5. Abajo debe aparecer algo como:
   - **Success. No rows returned**
   - Si sale algún error en rojo, copia el mensaje completo.

---

## 4. Comprobar que las tablas existen

1. En el **menú izquierdo**, haz clic en **Table Editor**.
2. Deberías ver dos tablas:
   - **vehicles**
   - **settings**
3. Si **no** las ves:
   - Vuelve al **SQL Editor** y ejecuta de nuevo el script del paso 3.
   - Asegúrate de estar en el proyecto **xrpsvleodzlydlcdxpdq**.

---

## 5. (Opcional) Si la app sigue “desconectada”

A veces el API tarda en ver las tablas nuevas. Prueba:

1. **SQL Editor** → **New query**.
2. Pega solo esta línea:
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
3. Pulsa **Run**.
4. Espera **10–15 segundos** y recarga tu app en el navegador (F5).

---

## Resumen rápido

| Dónde        | Qué hacer |
|-------------|-----------|
| Supabase    | Proyecto **xrpsvleodzlydlcdxpdq** |
| SQL Editor  | New query → pegar **supabase-ejecutar-todo.sql** → Run |
| Table Editor| Ver que existan **vehicles** y **settings** |
| Si falla    | Ejecutar `NOTIFY pgrst, 'reload schema';` y esperar 10 s |

Cuando **vehicles** y **settings** aparezcan en Table Editor y hayas ejecutado el script sin errores, la app debería conectar. Recarga la app (F5) y vuelve a iniciar sesión.
