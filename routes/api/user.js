const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../../models/User");
const keys = require("../../config/index");

router.get("/text", (req, res) => {
  res.send({ msg: "login success" });
});

// 注册
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "邮箱已被注册!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        identity: req.body.identity,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.json(user);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    }
  });
});

// 登录
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "用户不存在!" });
    }

    // 密码匹配
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // res.json({msg: 'success'})
        // jwt.sign("规则", "加密名字", "过期时间", "箭头函数")
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity,
        };
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token: "bearer " + token,
          });
        });
      } else {
        return res.status(404).json({ password: "密码错误!" });
      }
    });
  });
});

// 当前用户信息
// router.get('/current', "验证token", (req, res)=> {})
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity,
    });
  }
);

module.exports = router;
