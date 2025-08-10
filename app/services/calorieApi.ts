// Calorie Tracking API Service
export interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  unit: string;
}

export interface CalorieCalculationRequest {
  foodItems: string[];
  quantities?: { [key: string]: number };
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface CalorieCalculationResponse {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  items: NutritionInfo[];
  mealType: string;
  timestamp: string;
  recommendations?: string[];
}

// Comprehensive food database
const foodDatabase: { [key: string]: NutritionInfo } = {
  'apple': { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, servingSize: '1 medium', unit: 'piece' },
  'banana': { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, servingSize: '1 medium', unit: 'piece' },
  'chicken breast': { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, servingSize: '100g', unit: 'grams' },
  'salmon': { name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59, servingSize: '100g', unit: 'grams' },
  'rice': { name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, servingSize: '1 cup cooked', unit: 'cup' },
  'broccoli': { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.2, sugar: 2.6, sodium: 33, servingSize: '1 cup', unit: 'cup' },
  'milk': { name: 'Milk', calories: 103, protein: 8, carbs: 12, fat: 2.4, fiber: 0, sugar: 12, sodium: 107, servingSize: '1 cup', unit: 'cup' },
  'eggs': { name: 'Eggs', calories: 74, protein: 6.3, carbs: 0.6, fat: 5, fiber: 0, sugar: 0.4, sodium: 70, servingSize: '1 large', unit: 'piece' },
  'bread': { name: 'Bread', calories: 79, protein: 3.1, carbs: 15, fat: 1, fiber: 1.9, sugar: 1.4, sodium: 149, servingSize: '1 slice', unit: 'slice' },
  'cheese': { name: 'Cheese', calories: 113, protein: 7, carbs: 0.4, fat: 9, fiber: 0, sugar: 0.1, sodium: 174, servingSize: '1 oz', unit: 'ounce' }
};

export class CalorieApiService {
  static async calculateNutrition(request: CalorieCalculationRequest): Promise<CalorieCalculationResponse> {
    const { foodItems, quantities, mealType = 'snack' } = request;
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;
    const items: NutritionInfo[] = [];

    foodItems.forEach(foodItem => {
      const foodName = foodItem.toLowerCase().trim();
      const quantity = quantities?.[foodName] || 1;
      
      if (foodDatabase[foodName]) {
        const nutrition = foodDatabase[foodName];
        const multiplier = quantity / 100;
        
        const itemNutrition: NutritionInfo = {
          ...nutrition,
          calories: Math.round(nutrition.calories * multiplier),
          protein: Math.round(nutrition.protein * multiplier * 10) / 10,
          carbs: Math.round(nutrition.carbs * multiplier * 10) / 10,
          fat: Math.round(nutrition.fat * multiplier * 10) / 10,
          fiber: Math.round(nutrition.fiber * multiplier * 10) / 10,
          sugar: Math.round(nutrition.sugar * multiplier * 10) / 10,
          sodium: Math.round(nutrition.sodium * multiplier * 10) / 10
        };

        items.push(itemNutrition);
        totalCalories += itemNutrition.calories;
        totalProtein += itemNutrition.protein;
        totalCarbs += itemNutrition.carbs;
        totalFat += itemNutrition.fat;
        totalFiber += itemNutrition.fiber;
        totalSugar += itemNutrition.sugar;
        totalSodium += itemNutrition.sodium;
      }
    });

    const recommendations = this.generateRecommendations({
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      sugar: totalSugar,
      sodium: totalSodium
    });

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalSugar,
      totalSodium,
      items,
      mealType,
      timestamp: new Date().toISOString(),
      recommendations
    };
  }

  static getAvailableFoods(): string[] {
    return Object.keys(foodDatabase).sort();
  }

  private static generateRecommendations(nutrition: any): string[] {
    const recommendations: string[] = [];
    
    if (nutrition.protein < 10) {
      recommendations.push("Add protein-rich foods like lean meat, fish, eggs, or legumes.");
    }
    if (nutrition.fiber < 5) {
      recommendations.push("Include more fiber-rich foods like vegetables, fruits, and whole grains.");
    }
    if (nutrition.sugar > 25) {
      recommendations.push("This meal is high in sugar. Consider reducing added sugars.");
    }
    
    return recommendations;
  }
}
