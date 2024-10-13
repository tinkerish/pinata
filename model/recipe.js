const mongoose=require('mongoose');
const Schema=mongoose.Schema;

// name,
// description,
// image,
// video,
// servings,
// cookTime,
// difficulty,
// dietType,
// recipe: recipeValue,
// ingredients: fields,
const ratingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true }
});

const recipeSchema=new Schema({
    name:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    video:{
        type: String,
        required: true,    
    },
    dietType:{  
        type: String,
        required: true,
    },
    ingredients:{
        type: [String],
        required: true,
    },
    recipe:{
        type: String,
        required: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ownerName:{
        type: String,
        required: true,
    },
    cookTime:{
        type: Number,
        required: true,
    },
    difficulty:{
        type: String,
        required: true
    },
    servings:{
        type: Number,
        required: true,
    },
    ratings:[ratingSchema],
    averageRating:{
        type: Number,
        default: 0,
    },

})
module.exports=mongoose.model('Recipe',recipeSchema);