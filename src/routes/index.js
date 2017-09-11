let express = require('express');
let router = express.Router();
let models = require('../models');
const _ = require('lodash');
const geoip = require('geoip-lite');
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
        const o = {
            linkId: linkObject.linkId,
            linkToken: linkObject.linkToken,
            linkUrl: linkObject.linkUrl,
            linkUrlCn: linkObject.linkUrlCn,
            createdAt: linkObject.createdAt,
            updatedAt: linkObject.updatedAt
        };
        if (o.linkUrlCn) {
            const lookup = geoip.lookup(req.ip);
            if (lookup && lookup.country == 'CN') {
                o.orgLinkUrl = o.linkUrl;
                o.linkUrl = o.linkUrlCn;
            }
        }
        res.header('X-Redir', o.linkUrl);
        if (parseInt(req.query.detail)) {
            return res.json(o);
        }
        res.redirect(o.linkUrl);
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
            linkUrl: req.query.linkUrl,
            linkUrlCn: req.query.linkUrlCn
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
