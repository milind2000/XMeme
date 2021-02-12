const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

//Schema defining the values, made them unique using mongoose-validator.
const memeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    caption: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
memeSchema.plugin(uniqueValidator);
const Meme = mongoose.model("Meme", memeSchema);
module.exports = Meme;
