const db = require("../models");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.roles;

const Op = db.Sequelize.Op;


async function someAsyncOperation(rules) {
    let roleId;

    if (rules) {
        if (rules[0] === "admin") {
            roleId = 2;
        } else if (rules[0] === "superadmin") {
            roleId = 3;
        } else if (rules[0] === "modarator") {
            roleId = 4;
        } else {
            roleId = 1;
        }
    }
    return roleId
}

const RoleSetup = async (rules, userId) => {
    if (!rules) return;
    for (const item of rules) {
        await Role.create({
            name: item,
            userId: userId
        });
    }
};


exports.singUp = async (req, res) => {
    const body = req.body;
    try {
        const data = await User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email },
                ],
            },
        })

        if (data) {
            return res.status(204).send({
                success: true,
                message: "User Already exist",
            })
        }

        await User.create({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            image_url:req.body.image_url
        });


        const user = await User.findOne({
            order: [['id', 'DESC']]
        });

        await RoleSetup(data?.rules, user?.id);


        res.status(200).send({
            success: true,
            message: "Registration Successfull",
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


exports.singIn = async (req, res) => {
    try {
        const data = await User.findOne({
            where: {
                [Op.or]: [
                    { username: req.body.username },
                    { email: req.body.username },
                ],
            },
        })

        if (!data) {
            return res.status(404).send({ success: false, message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            data.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }


        const token = jwt.sign({ id: data.id }, config.secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
            success: true,
            message: "Login Successfully",
            id: req.userId,
            accessToken: token,
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}


exports.getUsers = async (req, res) => {
    try {
        const data = await User.findAll({
            limit:30
        })
        res.status(200).send({
            success: true,
            items: data,
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

exports.getSingleUsers = async (req, res) => {
    try {
        const data = await User.findOne({
            where: {
                id: req.userId
            }
        })
        res.status(200).send({
            success: true,
            items: data,
        })

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}

exports.updateUsers = async (req, res) => {
    const id = req.userId;
    const { first_name, last_name, email, username, password, image_url } = req.body;

    try {

        await User.update(
            {
                first_name,
                last_name,
                username,
                email,
                password,
                image_url
            },
            {
                where: { id }
            }
        );
        res.status(200).send({
            success: true,
            message: "Update Successfulll",
        });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


