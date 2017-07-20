let express = require('express');
let router = express.Router();
let models = require('../models');
const version = require('../../package.json').version;

router.use((req, res, next) => {
    res.header('X-SemRedir-Version', version);
    next();
});

router.get('/', function (req, res) {
    res.redirect('https://www.senorsen.com');
});

router.get('/messages/:app', async (req, res) => {
    try {
        let messages = await models.Message.findAll({
            where: {
                app: req.params.app,
                messageId: {
                    gt: parseInt(req.query.last || 0)
                },
                expire: {
                    gte: new Date()
                }
            },
            limit: 3,
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (e) {
        console.error(e);
        res.json({error: e.message});
    }
});

router.get('/:linkToken', async function (req, res, next) {
    try {
        let linkObject = await models.Link.findOne({
            where: {
                linkToken: req.params.linkToken
            }
        });
        if (!linkObject) {
            return next();
        }
        res.header('X-Redir', linkObject.linkUrl);
        if (parseInt(req.query.detail)) {
            return res.json(linkObject);
        }
        res.redirect(linkObject.linkUrl);
    } catch (e) {
        console.error(e);
        res.status(500);
        res.render('error', {
            message: e.message || '出错啦',
            error: e
        });
    }
});

router.get('/create', async function (req, res, next) {
    try {
        if (!req.query.linkToken || !req.query.linkUrl) {
            return res.json({
                code: 1,
                msg: '参数错误'
            });
        }
        let linkObject = await models.Link.create({
            linkToken: req.query.linkToken,
            linkUrl: req.query.linkUrl
        });
        res.json({
            version,
            err: 0,
            msg: 'SUCCESS',
            linkObject
        });
    } catch (e) {
        console.error(e);
        res.status(500);
        res.render('error', {
            message: e.message || '出错啦',
            error: e
        });
    }
});

module.exports = router;
