const express = require("express");
const {
  registerUser,
  userLogin,
  allUsers,
  userDetail,
  editProfilePicture,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../multer/multer");

const router = express.Router();

router.post("/api/user/register", registerUser);
router.post("/api/user/login", userLogin);
router.get("/api/user", auth, allUsers);
router.get("/api/singleuser", auth, userDetail);
router.put("/api/changeimage", upload.single("pic"), editProfilePicture);
// router.put("/api/changeimage", editProfilePicture);

// router.options("/api/changeImage/user/:id", (req, res) => {
//   console.log("OPTIONS request received");
//   res.status(204).end();
// });
module.exports = router;
