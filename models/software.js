const mongoose = require("mongoose");
const { default: validator } = require("validator");

const softwareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Software name is required"],
    },
    version: {
      type: String,
      trim: true,
      default: "0.0.0",
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Software description is required"],
    },
    homepage: {
      type: String,
      validate: [
        (value) =>
          validator.isURL(value, {
            protocols: ["http", "https"],
          }),
        "A valid url is required",
      ],
      required: [true, "Software homepage url is required"],
    },
    platforms: {
      type: [String],
      required: [true, "Software platform is required"],
    },
    isActiveDevelopment: {
      type: Boolean,
      required: true,
    },
    buildOn: {
      type: [String],
      default: [],
    },
    query: {
      isEnabled: {
        type: String,
        default: false,
      },
      updateUrl: {
        type: String,
        default: null,
      },
    },
    meta: {
      votes: {
        type: Number,
        default: 0,
      },
      tags: {
        type: [String],
        default: [],
      },
      addedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      updatedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },
  },
  { timestamps: true }
);

softwareSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Software", softwareSchema);
