const Recipe = require('../model/recipe'); 
const Rating=require('../model/rating');
const User=require('../model/user');
// Get all recipes
exports.getRecipes = async (req, res, next) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({ recipes });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Get a recipe by ID
exports.getRecipeById = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            const error = new Error('Could not find recipe.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ recipe });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Create a new recipe
exports.createRecipe = async (req, res, next) => {
    // const { title, ingredients, instructions } = req.body;
    const recipe = new Recipe({
        ...req.body,
        owner: req.userId // Assuming you have user authentication
    });
    try {
        const user=await User.findById(req.userId);
        recipe.ownerName=user.name;
        await recipe.save();
        res.status(201).json({ message: 'Recipe created successfully!', recipe });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

// Update a recipe
exports.updateRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    const { name, description, image, video, servings, cookTime, difficulty, dietType, recipe, ingredients } = req.body;
    try {
        const foodItem = await Recipe.findById(recipeId);
        if (!foodItem) {
            const error = new Error('Could not find recipe.');
            error.statusCode = 404;
            throw error;
        }
        if (foodItem.owner.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        foodItem.name = name;
        foodItem.description = description;
        foodItem.image = image;
        foodItem.video = video;
        foodItem.servings = servings;
        foodItem.cookTime = cookTime;
        foodItem.difficulty = difficulty;
        foodItem.dietType = dietType;
        foodItem.recipe = recipe;
        foodItem.ingredients = ingredients;
        await foodItem.save();
        res.status(200).json({ message: 'Recipe updated successfully!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
// Delete a recipe
exports.deleteRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    
    try {
        const user=await User.findById(req.userId);
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            const error = new Error('Could not find recipe.');
            error.statusCode = 404;
            throw error;
        }
        if (recipe.owner.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        await Recipe.findByIdAndDelete(recipeId);
        const recipes=await Recipe.find({owner: req.userId});
        let totalRating=0;
        let totalRecipes=0;
        recipes.forEach(recipe=>{
            totalRating+=recipe.averageRating;
            totalRecipes++;
        })
        user.rating=parseFloat((totalRating / totalRecipes).toFixed(1));
        await user.save();
        res.status(200).json({ message: 'Recipe deleted successfully!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getRecipesByUser = async (req, res, next) => {
    const userId = req.userId;
    try {
        const recipes = await Recipe.find({ owner: userId });
        if (!recipes) {
            return res.status(200).json({ recipes: [] });
        }
        res.status(200).json({ recipes });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.rateRecipe = async (req, res, next) => {
    const { rating, recipeId, userId } = req.body;
    // const userId = req.userId;

    try {
        const recipe = await Recipe.findById(recipeId);
        const user=await User.findById(req.userId);
        
        if (!recipe) {
            const error = new Error('Recipe not found.');
            error.statusCode = 404;
            throw error;
        }

        // Find existing rating by the user
        const existingRatingIndex = recipe.ratings.findIndex(r => r.userId.toString() === userId.toString());
        
        if (existingRatingIndex !== -1) {
            const oldRating = recipe.ratings[existingRatingIndex].rating;
            recipe.ratings[existingRatingIndex].rating = rating;
            const totalRatingValue = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0);
            
            recipe.averageRating = parseFloat((totalRatingValue / recipe.ratings.length).toFixed(1));
        } else {
            recipe.ratings.push({ userId, rating });

            const totalRatingValue = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0);
            recipe.averageRating = parseFloat((totalRatingValue / recipe.ratings.length).toFixed(1));
        }

        await recipe.save();

        const recipes=await Recipe.find({owner: req.userId});
        let totalRating=0;
        let totalRecipes=0;
        recipes.forEach(recipe=>{
            totalRating+=recipe.averageRating;
            totalRecipes++;
        })
        user.rating=parseFloat((totalRating / totalRecipes).toFixed(1));
        await user.save();
        res.status(200).json({ message: 'Rated Successfully!' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};