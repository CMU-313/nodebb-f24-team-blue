'use strict';

const db = require('./database');

const anonymousPosts = {};

anonymousPosts.getAnonymousPosts = async function () {
    try {
        console.log('Fetching anonymous posts from the database...');
        const posts = await db.getObjects('anonymous:posts');
        console.log('Anonymous posts fetched from the database:', posts);
        return posts;
    } catch (err) {
        console.error('Error fetching anonymous posts from the database:', err);
        throw err;
    }
};

module.exports = anonymousPosts;