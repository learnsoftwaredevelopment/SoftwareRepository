const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { isEmail } = require("validator");

const usernameRegex = RegExp("^[a-z0-9_.-]+$");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Missing username"],
      minlength: [6, "The username should be at least 6 characters long"],
      unique: true,
      lowercase: true,
      validate: [
        (value) => usernameRegex.test(value),
        "Please enter a valid username.",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "An email address is required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "A valid email is required"],
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
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);