# Configuración para que la app funcione

## 1. Dependencias

```bash
npm install
```

## 2. Supabase (obligatorio para conectar)

La app usa Supabase para guardar vehículos y configuración. **Sin este paso la app aparecerá "Desconectada".**

1. Entra a **https://supabase.com/dashboard** e inicia sesión.
2. Abre tu proyecto (o créalo). La URL del proyecto debe ser la que está en el código:  
   `https://xrpsvleodzlydlcdxpdq.supabase.co`
3. En el menú izquierdo: **SQL Editor** → **New query**.
4. Abre el archivo **`supabase-ejecutar-todo.sql`** de este proyecto.
5. Copia **todo** su contenido, pégalo en el SQL Editor y pulsa **Run**.
6. Debe aparecer **Success. No rows returned**.
7. Comprueba en **Table Editor** que existan las tablas **vehicles** y **settings**.

Si ya habías creado tablas antes con otro esquema (columnas en camelCase), ejecuta primero en el SQL Editor:

```sql
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.vehicles;
```

Luego vuelve a ejecutar todo el contenido de **`supabase-ejecutar-todo.sql`**.

## 3. Probar la conexión desde la app

1. Arranca la app: `npm run dev`
2. Abre la URL (por ejemplo http://localhost:3000), inicia sesión (nombre + rol).
3. Ve a **Ajustes** → pestaña **Sesión / Cloud** → pulsa **Probar conexión**.
   - Si sale **"OK. Tabla vehicles encontrada"**, la conexión es correcta.
   - Si sale un error, revisa que hayas ejecutado el SQL en el **mismo proyecto** cuya URL usa la app.

La conexión a Supabase está definida en el código (`supabaseClient.ts`). Para usar otro proyecto, edita ahí la URL y la Anon Key.
