## Arquitectura de la aplicación Food Mood

### 1. Frontend (Cliente)

* **Framework** : React.js
* **Gestión de estado** :
* Context API para estados globales simples
* Redux o React Query para estados más complejos o cachés de datos
* **Estilo** : CSS-in-JS o Styled Components para evitar problemas de compatibilidad

### 2. Backend

* **Servidor API** : Node.js + Express
* **Endpoints principales** :
* `/api/recipes/predict` - Recibe ingredientes y restricciones, devuelve recetas recomendadas

### 3. Integración con IA

* **Opciones** :
* OpenAI API (GPT-4)
* Google Gemini API
* Anthropic Claude API

### 4. Base de datos (opcional)

* **MongoDB** para almacenar:
  * Recetas generadas previamente
  * Preferencias de usuario
  * Historial de selecciones
