# Generar APK para Android (Capacitor)

La app está configurada con **Capacitor** para empaquetar la web en una app Android y generar el APK.

---

## Opción 1: Sin Android Studio (recomendado) – GitHub Actions

Puedes generar el APK **en la nube** sin instalar Android Studio en tu PC.

1. **Sube el proyecto a GitHub** (crea un repositorio y haz push del código).
2. El workflow **Build Android APK** se ejecuta al hacer push a `main` o `master`, o manualmente desde **Actions** → **Build Android APK** → **Run workflow**.
3. Cuando termine, entra en la ejecución → **Artifacts** y descarga **app-debug.apk**.

El archivo del workflow está en `.github/workflows/build-apk.yml`. No necesitas Android Studio ni el SDK en tu máquina.

---

## Opción 2: Con Android Studio (en tu PC)

### Requisitos

- **Node.js** (ya lo usas para el proyecto)
- **Android Studio** (para compilar el APK): [Descargar](https://developer.android.com/studio)
- **JDK 17** (suele venir con Android Studio)

## Pasos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Compilar la web y añadir la plataforma Android (solo la primera vez)

```bash
npm run build
npx cap add android
```

Si ya tienes la carpeta `android/`, solo necesitas:

```bash
npm run build:android
```

### 3. Generar el APK

**Opción A – Con Android Studio (recomendado)**

1. **Instala Android Studio** si no lo tienes: [Descargar](https://developer.android.com/studio).

2. Abre el proyecto Android:
   - **Si `npm run android` dice "Unable to launch Android Studio"**: abre Android Studio → **File** → **Open** → selecciona la carpeta **`android`** que está dentro de tu proyecto (ruta: `logitrack-pro-gestión-de-flota\android`).
   - **O** indica la ruta de Android Studio (solo una vez) y luego usa `npm run android`:
     - En PowerShell (sustituye si tu instalación está en otra ruta):
       ```powershell
       $env:CAPACITOR_ANDROID_STUDIO_PATH = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
       npx cap open android
       ```
     - En instalaciones por defecto suele estar en: `C:\Program Files\Android\Android Studio\bin\studio64.exe`.

3. En Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
4. Cuando termine, haz clic en **locate** en la notificación para ver el APK (suele estar en `android/app/build/outputs/apk/debug/`).

**Opción B – Desde la terminal (si tienes el SDK configurado)**

```bash
cd android
./gradlew assembleDebug
```

El APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`.

### 4. APK de release (para publicar)

Para firmar y generar un APK de release, en Android Studio:

1. **Build** → **Generate Signed Bundle / APK** → **APK**.
2. Crea o elige un keystore y completa el asistente.

## Resumen de comandos (Opción 2 – Android Studio)

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila la web (genera `dist/`) |
| `npm run build:android` | Compila la web y sincroniza con el proyecto Android |
| `npm run android` | Abre el proyecto Android en Android Studio |

## Nota

No existe una herramienta llamada "Composer" para generar APK. Aquí se usa **Capacitor**, que es el estándar para convertir una app web (React/Vite) en app Android.
