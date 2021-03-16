import articleService from '../Service/ArticleService';

class ArticleController {
    async postArticle(req, res) {
        try {
            const { name, price } = req.body;
            const data = await articleService.postArticle(name, price);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async putArticle(req, res){
        try {
            const { name, price } = req.body;
            const { id } = req.params;
            const data = await articleService.putArticle(id, name, price);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async deleteArticle(req, res) {
        try {
            const { id } = req.params;
            const data = await articleService.deleteArticle(id);

            res.status(200).send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default new ArticleController();
