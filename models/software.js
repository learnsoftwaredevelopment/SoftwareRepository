const mongoose = require("mongoose");

const softwareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "No software name"],
    },
    version: {
      type: String,
      default: "0.0.0",
    },
    homepage: {
      type: String,
      required: [true, "No software homepage url"],
    },
    platform: {
      type: String,
      required: [true, "Missing platform"],
    },
    isActiveDevelopment: {
      type: Boolean,
      required: true,
    },
    query: {
      updateUrl: {
        type: String,
      },
    },
    meta: {
      votes: Number,
      tags: {
        type: [String],
        default: [],
      },
      addedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      updatedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
