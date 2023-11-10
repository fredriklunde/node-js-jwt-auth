const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middleware");
const db = require("../models/index");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.get("/api/auth/me", [authJwt.verifyToken], async (req, res) => {
    const id = req.userId;
    const user = await db.user.findOne({
      attributes: ["id", "email"],
      where: { id },
    });
    res.status(200).send(user);
  });
};
