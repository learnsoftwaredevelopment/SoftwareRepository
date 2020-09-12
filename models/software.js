const mongoose = require("mongoose");

const softwareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Software name is required"],
    },
    version: {
      type: String,
      default: "0.0.0",
    },
    description: {
      type: String,
      required: [true, "Software description is required"]
    },
    homepage: {
      type: String,
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
      default: []
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
