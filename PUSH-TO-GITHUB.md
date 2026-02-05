# Subir el proyecto a GitHub (auxiliartic-lab/logitrack)

Abre una terminal en la carpeta del proyecto y ejecuta en orden:

## Si aún NO has inicializado Git

```bash
git init
git add .
git commit -m "Initial commit: LogiTrack Pro con Supabase y Capacitor"
git branch -M main
git remote add origin https://github.com/auxiliartic-lab/logitrack.git
git push -u origin main
```

## Si YA tienes Git inicializado (ya hiciste git init antes)

```bash
git add .
git commit -m "Subir LogiTrack Pro a GitHub"   # (solo si hay cambios sin commitear)
git branch -M main
git remote add origin https://github.com/auxiliartic-lab/logitrack.git
git push -u origin main
```

Si ya tenías un `remote` llamado `origin` con otra URL, cámbialo:

```bash
git remote set-url origin https://github.com/auxiliartic-lab/logitrack.git
git push -u origin main
```

## Después del push

1. Entra a https://github.com/auxiliartic-lab/logitrack y verifica que esté el código.
2. Para generar el APK: pestaña **Actions** → **Build Android APK** → **Run workflow** → al terminar descarga el artifact **app-debug.apk**.
