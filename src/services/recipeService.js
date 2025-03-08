// src/services/recipeService.js

export const getRecipePredictions = async (params) => {
  try {
    // Intenta hacer la llamada al backend
    const response = await fetch('/api/recipes/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener recetas: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Añadir IDs a las recetas
    return data.recipes.map((recipe, index) => ({
      ...recipe,
      id: index + 1
    }));
  } catch (error) {
    console.error('Error en servicio de recetas:', error);
    throw error;
  }
};

// Mock de recetas para pruebas o desarrollo
export const getMockRecipes = (params) => {
  const mockRecipes = [
    { id: 1, name: 'Tortilla Española', time: '25 min', ingredients: ['huevos', 'patatas', 'cebolla'], color: '#FFDAB9', icon: '🍳' },
    { id: 2, name: 'Ensalada Caprese', time: '10 min', ingredients: ['tomate', 'queso mozzarella', 'albahaca'], color: '#E6E6FA', icon: '🥗' },
    { id: 3, name: 'Quesadillas', time: '15 min', ingredients: ['tortillas de trigo', 'queso', 'tomate'], color: '#FFFACD', icon: '🌮' },
    { id: 4, name: 'Huevos revueltos', time: '8 min', ingredients: ['huevos', 'queso', 'sal'], color: '#FFE4B5', icon: '🍚' }
  ];

  // Filtrar por tiempo de cocción
  return mockRecipes.filter(recipe => {
    const recipeMinutes = parseInt(recipe.time);
    return recipeMinutes <= parseInt(params.cookingTime);
  });
};