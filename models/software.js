const mongoose = require('mongoose');
const { isURL } = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const softwareSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Software name is required'],
      unique: true,
    },
    alternativeNames: {
      type: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
      default: [],
    },
    version: {
      type: String,
      trim: true,
      default: '0.0.0',
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Software description is required'],
    },
    homePage: {
      type: String,
      validate: [
        (value) =>
          isURL(value, {
            protocols: ['http', 'https'],
          }),
        'A valid url is required',
      ],
      required: [true, 'Software homepage url is required'],
    },
    platform: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Software platform is required'],
    },
    isActiveDevelopment: {
      type: Boolean,
      required: true,
    },
    buildOn: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      default: [],
    },
    developedBy: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      default: [],
    },
    maintainedBy: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      default: [],
    },
    query: {
      isEnabled: {
        type: Boolean,
        default: false,
      },
      updateUrl: {
        type: String,
        validate: [
          (value) =>
            isURL(value, {
              protocols: ['http', 'https'],
            }) || value === '',
          'A valid update url is required',
        ],
        default: '',
      },
      downloadUrl: {
        type: String,
        validate: [
          (value) =>
            isURL(value, {
              protocols: ['http', 'https', 'ftp'],
            }) || value === '',
          'A valid download url is required',
        ],
        default: '',
      },
    },
    meta: {
      votes: {
        type: Number,
        default: 0,
      },
      tags: {
        type: [
          {
            type: String,
            trim: true,
            lowercase: true,
          },
        ],
        default: [],
      },
      addedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      updatedByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
  },
  { timestamps: true },
);

softwareSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

softwareSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Software', softwareSchema);
