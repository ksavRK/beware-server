const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // console.log("req == ", req.body);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    let user = await newUser.save();

    if (req.body.roles) {
      console.log("i am here 22");

      try {
        let roles = await Role.find({ name: { $in: req.body.roles } });

        if (roles && roles.length > 0) {
          user.roles = roles.map((role) => role._id);
          try {
            await user.save();
            res.send({ message: "User was registered successfully!" });
          } catch (err) {
            res.status(500).send({ message: err });
            return;
          }
        }
      } catch (err) {
        res.status(500).send({ message: err });
        return;
      }
    } else {
      try {
        let role = await Role.findOne({ name: "user" });
        user.roles = [role?._id];

        try {
          await user.save();
          res.send({ message: "User was registered successfully!" });
        } catch (err) {
          res.status(500).send({ message: err });
          return;
        }
      } catch (err) {
        res.status(500).send({ message: err });
        return;
      }
    }
  } catch (err) {
    res.status(500).send({ message: "err" });
    return;
  }
};

exports.signin = async (req, res) => {
  try {
    console.log(" req body == ", req.body);
    let user = await User.findOne({ email: req.body.email }).populate("roles", "-__v").exec();
    console.log("user in signin == ", user);

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    let passwordIsValid = await bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid login credential!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    var authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err });
    return;
  }
};
