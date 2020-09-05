const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Missing username"],
      minlength: [6, "The username should be at least 6 characters long"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    roles: {
      type: [String],
      default: ["user"],
    },
    contributions: {
      softwaresAdded: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Software",
          },
        ],
        default: [],
      },
      softwaresContributed: {
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
      lastLogin: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
