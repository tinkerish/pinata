const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ratingSchema=new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },

})
module.exports=mongoose.model('Rating',ratingSchema);