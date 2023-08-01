const db = require("../models");
const Cause = db.cause;

exports.getAllCause = async (req, res) => {
  try {
    let causes = await Cause.find();
    console.log("causes", causes);

    res.status(200).send(causes);
  } catch (err) {
    res.status(500).send({ message: err });
    return;
  }
};

exports.addCommentToCause = async (req, res) => {
  const { causeId, userId, comment } = req.body;

  try {
    // Find the cause by ID
    const cause = await Cause.findById(causeId);

    if (!cause) {
      return res.status(404).send({ message: "Cause not found." });
    }

    // Add the comment to the cause
    cause.comments.push({ userId, comment });

    // Save the updated cause to the database
    await cause.save();

    res.status(200).send({ message: "Comment added successfully.", cause });
  } catch (err) {
    res.status(500).send({ message: err });
    return;
  }
};
