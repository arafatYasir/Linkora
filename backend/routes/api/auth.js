const express = require("express");
const { newUser, verifyUser, loginUser, findUser, resetCode, verifyCode, newPassword, refreshToken, getUser, updateProfilePicture, updateCoverPhoto, updateProfileIntro, addFriend, cancelRequest, follow, unFollow, acceptRequest, unFriend, deleteRequest, search, addToSearchHistory, removeFromSearchHistory, getFriends } = require("../../controllers/userControllers");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// ---- Authentication ---- //
/**
 * @swagger
 * /signup:
 *     post:
 *         summary: Registers a new user
 *         description: Creates a new user account and sends a verification email.
 *         tags:
 *             - Authentication
 *         security: [] #Public API (no JWT)
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/SignupInput'
 *         responses:
 *             201:
 *                 description: Registration successful! Please verify your email.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/SignupSuccess'
 *             400:
 *                 description: Validation error or email already exists.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 *             404:
 *                 description: Can't create a user.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/signup", newUser);

/**
 * @swagger
 * /verify:
 *     post:
 *         summary: Verifies a user's email
 *         description: Verifies a user's email address using a verification link.
 *         tags:
 *             - Authentication
 *         security: [] #Public API (no JWT)
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/VerifyInput'
 *         responses:
 *             200:
 *                 description: Email is verified successfully!
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/VerifySuccess'
 *             400:
 *                 description: This email is already verified!
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 *             404:
 *                 description: Token is expired or user not found!
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/verify", verifyUser);

/**
 * @swagger
 * /login:
 *     post:
 *         summary: Logs in a user
 *         description: Logs in a user and returns a JWT token.
 *         tags:
 *             - Authentication
 *         security: [] #Public API (no JWT)
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/LoginInput'
 *         responses:
 *             200:
 *                 description: Login successful!
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/LoginSuccess'
 *             400:
 *                 description: Invalid email or password or not verified user.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 *             404:
 *                 description: Email doesn't exist or password is invalid.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /refresh:
 *     post:
 *         summary: Refreshes a user's JWT token
 *         description: Refreshes a user's JWT token using his refresh token.
 *         tags:
 *             - Authentication
 *         security: [] #Public API (no JWT)
 *         parameters:
 *             - in: cookie
 *               name: refreshToken
 *               required: true
 *               description: Refresh token
 *               schema:
 *                 type: string
 *         responses:
 *             200:
 *                 description: Token is refreshed successfully.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/RefreshSuccess'
 *             400:
 *                 description: Token not found!
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 *             404:
 *                 description: Invalid token or user not found.
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/refresh", refreshToken);
router.post("/findUser", findUser);
router.post("/reset-code", resetCode);
router.post("/verify-code", verifyCode);
router.post("/new-password", newPassword);

// Profile
router.get("/get-user/:username", authMiddleware, getUser);
router.put("/update-profile-picture", authMiddleware, updateProfilePicture);
router.put("/update-cover-photo", authMiddleware, updateCoverPhoto);
router.put("/update-profile-intro", authMiddleware, updateProfileIntro);

// Friend & Followers
router.post("/add-friend/:id", authMiddleware, addFriend);
router.post("/accept-request/:id", authMiddleware, acceptRequest);
router.delete("/cancel-request/:id", authMiddleware, cancelRequest);
router.post("/follow/:id", authMiddleware, follow);
router.delete("/unfollow/:id", authMiddleware, unFollow);
router.delete("/unfriend/:id", authMiddleware, unFriend);
router.delete("/delete-request/:id", authMiddleware, deleteRequest);
router.get("/get-friends", authMiddleware, getFriends);

// Search
router.get("/search/:query", authMiddleware, search);
router.put("/add-to-search-history", authMiddleware, addToSearchHistory);
router.delete("/remove-from-search-history/:id", authMiddleware, removeFromSearchHistory);

module.exports = router;