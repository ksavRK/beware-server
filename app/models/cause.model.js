const mongoose = require("mongoose");

const Cause = mongoose.model(
  "Cause",
  new mongoose.Schema({
    name: String,
    description: String,
    business: String,
    comments: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          comment: { type: String, required: false },
        },
      ],
      default: [], // Set the default value to an empty array
    },
  })
);

module.exports = Cause;
