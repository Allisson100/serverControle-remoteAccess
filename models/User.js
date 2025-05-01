const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isUserBlocked: {
      type: Boolean,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
      unique: true,
    },
    newUrl: {
      type: String,
    },
    hash: {
      type: String,
    },
  },
  {
    timestamps: true, // Para adicionar createdAt e updatedAt automaticamente
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
