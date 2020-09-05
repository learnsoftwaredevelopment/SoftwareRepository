const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Missing username"],
    minlength: [6, "The username should be at least 6 characters long"],
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: [true, "Missing password hash"],
    minlength: [8, "The password should be at least 8 characters long"],
  },
  contributions: {
    softwareAdded: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Software",
        },
      ],
      default: [],
    },
    softwareContributed: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Software",
        },
      ],
      default: [],
    },
  },
  meta: {
    favourites: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Software",
        },
      ],
      default: [],
    },
  },
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
