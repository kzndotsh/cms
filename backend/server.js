const express = require('express');
const cors = require('cors');
const path = require('path');

const help = require('./helpers');
const delay = 1000;

const server = express();
server.use(express.json());
server.use(express.static(path.join(__dirname, '../dist')));
server.use(cors());
// 1
server.post('/api/login', async (req, res, next) => {
    try {
        const [status, payload] = await help.login(req.body);
        setTimeout(() => {
            res.status(status).json(payload);
        }, delay);
    } catch (err) {
        next(err);
    }
});
// 2
server.get('/api/articles', async (req, res) => {
    const token = req.headers.authorization;
    const [status, payload] = await help.getArticles(token);
    setTimeout(() => {
        res.status(status).json(payload);
    }, delay);
});
// 3
server.post('/api/articles', async (req, res) => {
    const token = req.headers.authorization;
    const [status, payload] = await help.postArticle(token, req.body);
    setTimeout(() => {
        res.status(status).json(payload);
    }, delay);
});
// 4
server.put('/api/articles/:article_id', async (req, res) => {
    const token = req.headers.authorization;
    const [status, payload] = await help.updateArticle(
        token,
        req.body,
        req.params.article_id
    );
    setTimeout(() => {
        res.status(status).json(payload);
    }, delay);
});
// 5
server.delete('/api/articles/:article_id', async (req, res) => {
    const token = req.headers.authorization;
    const [status, payload] = await help.deleteArticle(
        token,
        req.params.article_id
    );
    setTimeout(() => {
        res.status(status).json(payload);
    }, delay);
});
// SPA
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});
// 404
server.use((req, res) => {
    res.status(404).json({
        message: `Endpoint [${req.method}] ${req.originalUrl} does not exist`,
    });
});
// ERR
server.use((err, req, res, next) => {
    // eslint-disable-line
    res.status(err.status || 500).json({
        error: 'The app crashed for some reason, see message & stack',
        message: err.message,
        stack: err.stack,
    });
});

module.exports = server;
