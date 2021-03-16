import userService from '../Service/UserService';

class UserController {
    async postUser(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const data = await userService.postUser(firstName, lastName, email, password);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async login(req, res) {
        try {
            const { email, password }= req.body;
            const data = await userService.login(email, password);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async changeUserPassword(req, res) {
        try {
            const { password, newPassword } = req.body;
            const userId = req.decoded.id;

            const data = await userService.changeUserPassword(password, newPassword, userId);

            res.status(200).send(data);
        } catch (error) {
            res.status(200).send(error);
        }
    }
}

export default new UserController();
