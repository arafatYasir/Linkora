const { validateEmail, validateLength, generateValideUsername } = require("../helpers/validation");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const newUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            day,
            month,
            year,
            gender
        } = req.body;

        // Checking if the length of firstname or lastname is out of bounds
        if (!validateLength(firstname, 3, 15)) {
            return res.status(400).json({
                error: "Firstname length should be between 3 - 15 characters"
            });
        }

        if (!validateLength(lastname, 3, 15)) {
            return res.status(400).json({
                error: "Lastname length should be between 3 - 15 characters"
            });
        }

        // Checking if the firs letter of both names are capital or not
        if(firstname[0] !== firstname[0].toUpperCase()) {
            return res.status(400).json({
                error: "First letter should be capital"
            });
        }

        if(lastname[0] !== lastname[0].toUpperCase()) {
            return res.status(400).json({
                error: "First letter should be capital"
            });
        }

        // Checking if the email is valid
        if (!validateEmail(email)) {
            return res.status(400).json({
                error: "Invalid Email!"
            });
        }

        // Checking if a user already exists with same email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                error: "The email already exists"
            });
        }

        // Creating a temporary username
        const tempUsername = firstname + lastname;
        const finalUsername = await generateValideUsername(tempUsername);

        // Checking password length
        if (!validateLength(password, 8, 40)) {
            return res.status(400).json({
                error: "Password length can be 8 - 40 characters"
            });
        }

        // Encrypting the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Creating a new user structure
        const user = new User({
            firstname,
            lastname,
            email,
            username: finalUsername,
            password: encryptedPassword,
            day,
            month,
            year,
            gender
        });

        // Saving the user to database
        await user.save();

        // Sending user data response
        res.send(user);

    } catch (e) {
        console.log(e.message);
        res.status(404).json({ error: "Can't create a user." });
    }
}

module.exports = { newUser };