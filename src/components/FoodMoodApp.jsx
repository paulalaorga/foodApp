import React, { useState, useEffect } from 'react';
import { getRecipePredictions } from '../services/recipeService';
import '../App.css';

const FoodMoodApp = () => {
  const [currentStep, setCurrentStep] = useState('form');
  const [formData, setFormData] = useState({
    fridgeItems: '',
    cookingTime: '30',
    diet: 'none'
  });
  const [recipes, setRecipes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [spinCount, setSpinCount] = useState(0); // Para efectos de animación incrementales

  // Efecto para manejar la animación de "brillo" en el botón cuando está disponible
  useEffect(() => {
    if (!spinning && recipes.length > 0 && !selectedRecipe) {
      const button = document.querySelector('.spin-button');
      if (button) {
        button.classList.add('pulse-animation');
      }
    }
  }, [spinning, recipes, selectedRecipe]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentStep('loading');
    
    try {
      // Llamar a la API real para obtener recetas
      const predictedRecipes = await getRecipePredictions(formData);
      setRecipes(predictedRecipes);
      setCurrentStep('roulette');
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      
      // Fallback a recetas de muestra en caso de error
      const mockRecipes = [
        { id: 1, name: 'Tortilla Española', time: '25 min', ingredients: ['huevos', 'patatas', 'cebolla'], color: '#FFA07A', icon: '🍳' },
        { id: 2, name: 'Ensalada Caprese', time: '10 min', ingredients: ['tomate', 'queso mozzarella', 'albahaca'], color: '#98FB98', icon: '🥗' },
        { id: 3, name: 'Quesadillas', time: '15 min', ingredients: ['tortillas de trigo', 'queso', 'tomate'], color: '#FFDEAD', icon: '🌮' },
        { id: 4, name: 'Huevos revueltos', time: '8 min', ingredients: ['huevos', 'queso', 'sal'], color: '#FFD700', icon: '🍚' },
        { id: 5, name: 'Pasta Carbonara', time: '20 min', ingredients: ['pasta', 'huevo', 'bacon', 'queso'], color: '#F0E68C', icon: '🍝' },
        { id: 6, name: 'Smoothie Verde', time: '5 min', ingredients: ['espinacas', 'plátano', 'leche', 'miel'], color: '#9ACD32', icon: '🥤' }
      ];
      
      // Filtrar por tiempo de cocción
      const filteredRecipes = mockRecipes.filter(recipe => 
        parseInt(recipe.time) <= parseInt(formData.cookingTime)
      );
      
      setRecipes(filteredRecipes);
      setCurrentStep('roulette');
    }
  };

  const spin = () => {
    if (!spinning && recipes.length > 0) {
      // Remover clase de animación si existe
      const button = document.querySelector('.spin-button');
      if (button) {
        button.classList.remove('pulse-animation');
      }
      
      setSpinning(true);
      setSpinCount(prevCount => prevCount + 1); // Incrementar para hacer cada giro único
      
      // Más rotaciones para efecto más cinematográfico
      const fullRotations = Math.floor(Math.random() * 4) + 5; // Entre 5 y 8 rotaciones completas
      const randomAngle = Math.floor(Math.random() * 360);
      const totalRotation = fullRotations * 360 + randomAngle;
      
      // Calculamos qué receta quedará seleccionada
      const normalizedAngle = randomAngle % 360;
      const segmentAngle = 360 / recipes.length;
      // Ajustamos el cálculo para que coincida con el puntero
      const itemIndex = Math.floor(normalizedAngle / segmentAngle);
      
      // Aplicamos la rotación
      setRotationAngle(totalRotation);
      
      // Usamos un tiempo más largo para la animación
      setTimeout(() => {
        setSelectedRecipe(recipes[itemIndex]);
        setSpinning(false);
      }, 5000); // Duración de la animación en milisegundos
    }
  };

  const reset = () => {
    setCurrentStep('form');
    setSelectedRecipe(null);
    setRotationAngle(0);
    setSpinCount(0);
  };

  // Generar estilos de los segmentos de la ruleta de manera más precisa
  const createSegments = () => {
    if (!recipes.length) return [];
    
    const segmentAngle = 360 / recipes.length;
    
    return recipes.map((recipe, index) => {
      const rotationAngle = index * segmentAngle;
      
      // Calcular la posición del icono en coordenadas polares
      const iconRadius = recipes.length <= 4 ? 110 : recipes.length <= 6 ? 100 : 90;
      const iconAngle = rotationAngle + (segmentAngle / 2);
      const iconX = 50 + iconRadius * Math.cos(iconAngle * Math.PI / 180);
      const iconY = 50 + iconRadius * Math.sin(iconAngle * Math.PI / 180);
      
      return (
        <div 
          key={recipe.id} 
          className="wheel-segment"
          style={{ 
            transform: `rotate(${rotationAngle}deg)`,
            clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
            transformOrigin: 'center',
            borderRadius: '50%'
          }}
        >
          <div 
            className="wheel-segment-content"
            style={{
              backgroundColor: recipe.color,
              transform: `rotate(${segmentAngle/2}deg)`,
              clipPath: `polygon(0 0, ${100/(recipes.length <= 4 ? 1 : 1.5)}% 0, 0 ${100/(recipes.length <= 4 ? 1 : 1.5)}%)`,
              opacity: 0.9
            }}
          />
          <span 
            className="recipe-icon"
            style={{
              left: `${iconX}%`,
              top: `${iconY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {recipe.icon}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <h1 className="header">FOOD MOOD</h1>
      
      {currentStep === 'form' && (
        <div className="form-container">
          <h2 className="form-title">¿Qué comemos hoy? 🍽️</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>🧊 ¿Qué tienes en la nevera?</label>
              <textarea name="fridgeItems" value={formData.fridgeItems} onChange={handleInputChange} className="input" placeholder="ej: huevos, tomates, queso..." />
            </div>
            <div className="input-group">
              <label>⏱️ ¿Cuánto tiempo quieres emplear en cocinar?</label>
              <select name="cookingTime" value={formData.cookingTime} onChange={handleInputChange} className="select">
                <option value="15">15 minutos o menos</option>
                <option value="30">30 minutos o menos</option>
                <option value="60">1 hora o menos</option>
                <option value="120">Más de 1 hora</option>
              </select>
            </div>
            <div className="input-group">
              <label>🥑 ¿Haces alguna dieta?</label>
              <select name="diet" value={formData.diet} onChange={handleInputChange} className="select">
                <option value="none">Ninguna</option>
                <option value="vegetarian">Vegetariana</option>
                <option value="vegan">Vegana</option>
                <option value="keto">Keto</option>
                <option value="lowCarb">Baja en carbohidratos</option>
              </select>
            </div>
            <button type="submit" className="button">¡Encontrar Recetas! 🍳</button>
          </form>
        </div>
      )}

      {currentStep === 'loading' && (
        <div className="loader">
          <div className="spinner"></div>
          <p className="loading-text">El chef está pensando... 👨‍🍳✨</p>
          <p className="loading-subtext">Seleccionando recetas basadas en tus ingredientes</p>
        </div>
      )}

      {currentStep === 'roulette' && (
        <div className="roulette-container">
          <div className="selected-recipe-container">
            {selectedRecipe ? (
              <h2 className="selected-recipe">{selectedRecipe.icon} {selectedRecipe.name} ({selectedRecipe.time})</h2>
            ) : (
              <h2 className="selected-recipe">¡Gira la ruleta para descubrir tu receta! 🎯</h2>
            )}
          </div>
          
          <div className="roulette">
            <div className="wheel-container">
              {/* Pointer */}
              <div className="wheel-pointer"></div>
              
              {/* Wheel */}
              <div 
                className="wheel" 
                style={{ 
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: spinning ? 'transform 5s cubic-bezier(0.32, 0.64, 0.45, 1)' : 'none'
                }}
              >
                {/* Decorative elements */}
                <div className="roulette-decoration"></div>
                
                {/* Segments */}
                {createSegments()}
                
                {/* Inner circle decoration */}
                <div className="wheel-inner-circle"></div>
              </div>
              
              {/* Center button with dynamic text */}
              <button 
                onClick={spin} 
                disabled={spinning} 
                className={`spin-button ${!spinning && recipes.length > 0 && !selectedRecipe ? 'pulse-animation' : ''}`}
              >
                {spinning ? '...' : 'SPIN'}
              </button>
            </div>
          </div>
          
          {selectedRecipe && (
            <div className="recipe-details">
              <h3>{selectedRecipe.icon} {selectedRecipe.name}</h3>
              <p><strong>Tiempo de preparación:</strong> {selectedRecipe.time}</p>
              <p><strong>Ingredientes:</strong></p>
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button onClick={reset} className="button">Buscar Otras Recetas</button>
        </div>
      )}
      
      {/* Estilos CSS dinámicos para animaciones avanzadas */}
      <style jsx="true">{`
        @keyframes pulse-animation {
          0% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px rgba(255, 165, 0, 0.5); }
          50% { transform: translate(-50%, -50%) scale(1.05); box-shadow: 0 0 30px rgba(255, 165, 0, 0.8); }
          100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px rgba(255, 165, 0, 0.5); }
        }

        .pulse-animation {
          animation: pulse-animation 1.5s infinite;
        }

        .wheel {
          animation: ${spinning ? 'wheelSpin-' + spinCount + ' 5s cubic-bezier(0.32, 0.64, 0.45, 1)' : 'none'};
        }

        @keyframes wheelSpin-${spinCount} {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(${rotationAngle}deg); }
        }
      `}</style>
    </div>
  );
};

export default FoodMoodApp;