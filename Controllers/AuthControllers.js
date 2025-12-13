// import { User } from './../Models/UserModel.js';
const User  =  require('./../Models/UserModel.js');

const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send("Email and Password is required")
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User not registered"
            })
        }
        const auth = await compare(password, user.password)
        if (!auth) {
            return res.json({
                success: false,
                message: "Password mismatched"
            })
        }
        const token = jwt.sign({ email, id: user.id }, process.env.JWT_KEY, { expiresIn: '7d' })
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
module.exports = signin