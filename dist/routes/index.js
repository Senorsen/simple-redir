'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {return step("next", value);}, function (err) {return step("throw", err);});}}return step("next");});};}let express = require('express');
let router = express.Router();
let models = require('../models');
const version = require('../../package.json').version;

router.use((req, res, next) => {
    res.header('X-SemRedir-Version', version);
    next();});


router.get('/', function (req, res) {
    res.redirect('https://www.senorsen.com');});


router.get('/:linkToken', (() => {var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {var 

        linkObject;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) switch (_context.prev = _context.next) {case 0:_context.prev = 0;_context.next = 3;return models.Link.findOne({ 
                        where: { 
                            linkToken: req.params.linkToken } });case 3:linkObject = _context.sent;if (


                    linkObject) {_context.next = 6;break;}return _context.abrupt('return', 
                    next());case 6:

                    res.header('X-Redir', linkObject.linkUrl);
                    res.redirect(linkObject.linkUrl);_context.next = 15;break;case 10:_context.prev = 10;_context.t0 = _context['catch'](0);

                    console.error(_context.t0);
                    res.status(500);
                    res.render('error', { 
                        message: _context.t0.message || '出错啦', 
                        error: _context.t0 });case 15:case 'end':return _context.stop();}}, _callee, this, [[0, 10]]);}));return function (_x, _x2, _x3) {return ref.apply(this, arguments);};})());




router.get('/create', (() => {var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {var 







        linkObject;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) switch (_context2.prev = _context2.next) {case 0:_context2.prev = 0;if (!(!req.query.linkToken || !req.query.linkUrl)) {_context2.next = 3;break;}return _context2.abrupt('return', res.json({ code: 1, msg: '参数错误' }));case 3:_context2.next = 5;return models.Link.create({ 
                        linkToken: req.query.linkToken, 
                        linkUrl: req.query.linkUrl });case 5:linkObject = _context2.sent;

                    res.json({ 
                        version, 
                        err: 0, 
                        msg: 'SUCCESS', 
                        linkObject });_context2.next = 14;break;case 9:_context2.prev = 9;_context2.t0 = _context2['catch'](0);


                    console.error(_context2.t0);
                    res.status(500);
                    res.render('error', { 
                        message: _context2.t0.message || '出错啦', 
                        error: _context2.t0 });case 14:case 'end':return _context2.stop();}}, _callee2, this, [[0, 9]]);}));return function (_x4, _x5, _x6) {return ref.apply(this, arguments);};})());




module.exports = router;