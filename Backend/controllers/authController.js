const User = require("../models/User");
const jwt = require("jsonwebtoken");

//genreate token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

//register user

exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Cet utilisateur existe déjà." });
        }

        //create new user

        const newUser = new User({
            fullName,
            email,
            password,
            profileImageUrl: req.body.profileImageUrl || null,
        });

        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({ token });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        res
            .status(500)
            .json({ message: "Erreur interne du serveur." });
    }
};

//login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "S'il vous plaît, remplissez tous les champs." });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }

        if (!await user.comparePassword(password) || !password) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        const token = generateToken(user._id);
        res.status(200)
            .json({
                id: user._id,
                user,
                token: generateToken(user._id),
            });
    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

//get user info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
        res
            .status(500)
            .json({ message: "Erreur interne du serveur." });
    }
};

