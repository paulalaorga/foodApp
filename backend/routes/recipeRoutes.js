// backend/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/predict', async (req, res) => {
  try {
    const { fridgeItems, cookingTime, diet } = req.body;
    
    // Construir el prompt para la API de IA
    const prompt = `
      Genera 6 recetas basadas en los siguientes parámetros:
      - Ingredientes disponibles: ${fridgeItems}
      - Tiempo máximo de cocción: ${cookingTime} minutos
      - Restricciones dietéticas: ${diet}
      
      Para cada receta, proporciona:
      - Nombre de la receta
      - Tiempo de preparación (en minutos)
      - Lista de ingredientes necesarios
      - Un emoji que represente la receta
      - Un color en formato hexadecimal para representar la receta en una interfaz
      
      Responde en formato JSON como:
      [
        {
          "name": "Nombre de la receta",
          "time": "XX min",
          "ingredients": ["ingrediente1", "ingrediente2", ...],
          "icon": "emoji",
          "color": "#hexcolor"
        },
        ...
      ]
    `;
    
    // Llamada a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres un chef experto que sugiere recetas basadas en ingredientes disponibles." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    // Extraer y parsear la respuesta
    const responseContent = completion.choices[0].message.content;
    const recipes = JSON.parse(responseContent).recipes || [];
    
    res.json({ success: true, recipes });
  } catch (error) {
    console.error('Error al generar recetas:', error);
    res.status(500).json({ success: false, message: 'Error al generar recetas', error: error.message });
  }
});

module.exports = router;