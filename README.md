# Snack - Frontend Móvil

Este repositorio contiene el código fuente del frontend móvil para **Snack**, una red social centrada en el streaming de videos y series, compra por medio de tokens, comentarios, reacciones y caracteristicas sociales avanzadas.

## 🛠️ Stack Tecnológico

*   **Framework:** [Expo](https://expo.dev/) (React Native)
*   **Navegación:** [Expo Router](https://docs.expo.dev/router/introduction/)
*   **Estilos:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para React Native)
*   **Gestión de Datos:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
*   **Multimedia:** [Expo Video](https://docs.expo.dev/versions/latest/sdk/video-av/) & [Screen Orientation](https://docs.expo.dev/versions/latest/sdk/screen-orientation/)
*   **Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🏗️ Arquitectura

El proyecto sigue una **Arquitectura basada en Feature (Feature-based Architecture)**. En lugar de organizar el código solo por tipos de archivos (hooks, componentes, etc.), lo organizamos por módulos funcionales. 

Cada módulo dentro de la carpeta `components/` encapsula su propia lógica:
*   **`components/`**: UI específica del módulo.
*   **`hooks/`**: Lógica de estado y efectos propia de la feature.
*   **`services/`**: Llamadas a API y lógica de negocio.
*   **`interfaces/`**: Definiciones de TypeScript para el módulo.

Esta estructura permite que el proyecto sea más escalable, fácil de testear y que los equipos trabajen en paralelo de forma más eficiente.

Adicionalmente, implementamos **archivos de barril (barrel files)** mediante archivos `index.ts` en cada subdirectorio. Esto garantiza importaciones más limpias, organizadas y fáciles de mantener al centralizar las exportaciones de cada módulo.



---

## 🚀 Guía de Instalación y Uso

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 📋 Requisitos Previos

Antes de comenzar, asegúrate de cumplir con lo siguiente:
*   **Backend:** El servidor backend debe estar en funcionamiento. Puede estar corriendo localmente (expuesto vía **ngrok**) o estar ya desplegado en un servidor.
*   **Node.js:** Tener instalado Node.js **v24.14.0** o superior.


### 1. Instalación de dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

### 2. Iniciar el proyecto

Para lanzar el servidor de desarrollo de Expo:

```bash
npx expo start
```

### 3. Ejecución en dispositivos móviles

*   Descarga la aplicación **Expo Go** en tu teléfono (disponible en Google Play o App Store).
*   Una vez que el proyecto esté corriendo en tu terminal, escanea el código QR que aparece con la app Expo Go o ingresa la URL proporcionada.

