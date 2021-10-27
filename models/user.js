const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail, normalizeEmail } = require('validator');
const { ALLOWED_USERNAME_REGEX } = require('../utils/config');

const usernameRegex = RegExp(ALLOWED_USERNAME_REGEX);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Missing username'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [
        (value) => usernameRegex.test(value),
        'A valid username is required',
      ],
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'An email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, 'A valid email address is required'],
      set: (value) => normalizeEmail(value),
    },
    password: {
      type: String,
      default: '',
    },
    firebaseUid: {
      type: String,
      required: [true, 'firebase user id is required.'],
      unique: true,
    },
    roles: {
      type: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
      default: ['user'],
    },
    developerOf: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Software',
        },
      ],
      default: [],
    },
    maintainerOf: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Software',
        },
      ],
      default: [],
    },
    contributions: {
      softwaresAdded: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Software',
          },
        ],
        default: [],
      },
      softwaresContributed: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Software',
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
            ref: 'Software',
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
  { timestamps: true },
);

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = mongoose.model('User', userSchema);
