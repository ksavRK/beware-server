const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        }).exec()

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;         
        }
        next()
    }catch(err) {
        res.status(500).send({ message: "err" });
        return;
    }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
    checkDuplicateEmail,
    checkRolesExisted
};

module.exports = verifySignUp;