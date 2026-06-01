# Setup SSH Key desde el Panel de Hosting (cPanel)

Hazlo una vez. Después, los deploys corren sin contraseña.

## 1 — Generar el par de claves en cPanel

1. Entra a **cPanel → Security → SSH Access** (o "Administrar claves SSH").
2. Haz clic en **Generate a New Key**.
3. Configura:
   - **Key Name**: `id_rsa_hosting` (o el nombre que prefieras)
   - **Key Password**: opcional pero recomendado (solo la escribes una vez por sesión)
   - **Key Type**: `RSA` o `ed25519` (ed25519 es más moderno y seguro)
   - **Key Size**: 4096 (RSA) o dejar el default (ed25519)
4. Haz clic en **Generate Key**.
5. En la lista de claves, haz clic en **Manage** junto a la clave que acabas de crear.
6. Haz clic en **Authorize** — esto instala la clave pública en `~/.ssh/authorized_keys` del servidor.

## 2 — Descargar la clave privada

En la misma pantalla de administración (o en la lista principal de claves):
- Haz clic en **View/Download** para la clave privada.
- Guarda el archivo `.pem` o la clave en texto plano.
- Colócala en tu directorio SSH local:

**Windows (PowerShell)**:
```powershell
# Crea la carpeta si no existe
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"
# Mueve el archivo descargado
Move-Item "$env:USERPROFILE\Downloads\id_rsa_hosting" "$env:USERPROFILE\.ssh\id_rsa_hosting"
```

En Windows, OpenSSH gestiona los permisos del archivo automáticamente si está dentro de `%USERPROFILE%\.ssh\`.

## 3 — Verificar la conexión

```
ssh -p {PORT} -i ~/.ssh/id_rsa_hosting {USER}@{HOST}
```

Debe conectar sin pedir contraseña del servidor (solo pedirá la passphrase de la clave si pusiste una).

## 4 — Actualizar deploy config

Pon la ruta de la clave en `.deploy.json`:

```json
{
  "key_path": "~/.ssh/id_rsa_hosting"
}
```

Si nombraste la clave `id_rsa` (el default de SSH), puedes dejar `key_path` vacío.
