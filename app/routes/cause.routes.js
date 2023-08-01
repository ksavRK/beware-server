const controller = require("../controllers/cause.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/cause/all", [authJwt.verifyToken], controller.getAllCause);
  app.post("/api/cause/comment", [authJwt.verifyToken], controller.addCommentToCause);
};
