'use strict';

const _ = require('lodash');

const meta = require('../meta');
const db = require('../database');
const plugins = require('../plugins');
const user = require('../user');
const topics = require('../topics');
const categories = require('../categories');
const groups = require('../groups');
const privileges = require('../privileges');
const emailer = require('../emailer');  // Import emailer to send email notifications

module.exports = function (Posts) {
    Posts.create = async function (data) {
        const { uid } = data;
        const { tid } = data;
        const content = data.content.toString();
        const timestamp = data.timestamp || Date.now();
        const isMain = data.isMain || false;

        if (!uid && parseInt(uid, 10) !== 0) {
            throw new Error('[[error:invalid-uid]]');
        }

        if (data.toPid) {
            await checkToPid(data.toPid, uid);
        }

        const pid = await db.incrObjectField('global', 'nextPid');
        let postData = {
            pid: pid,
            uid: uid,
            tid: tid,
            content: content,
            timestamp: timestamp,
        };

        if (data.toPid) {
            postData.toPid = data.toPid;
        }
        if (data.ip && meta.config.trackIpPerPost) {
            postData.ip = data.ip;
        }
        if (data.handle && !parseInt(uid, 10)) {
            postData.handle = data.handle;
        }

        let result = await plugins.hooks.fire('filter:post.create', { post: postData, data: data });
        postData = result.post;
        await db.setObject(`post:${postData.pid}`, postData);

        const topicData = await topics.getTopicFields(tid, ['cid', 'pinned', 'uid', 'title']);  // Fetch the topic creator's uid and title
        postData.cid = topicData.cid;

        // Fetch the topic creator's email
        const email = await user.getUserField(topicData.uid, 'email');
        console.log('Topic Creator Email:', email);  // Check if email is fetched correctly


        // Send an email notification to the topic creator if it's a reply
        if (tid && topicData.uid && uid !== topicData.uid) {  
            const emailParams = {
                subject: `New reply to your topic: "${topicData.title}"`,
                notification: {
                    type: 'reply',
                    content: postData.content,  // This is the dynamic reply content
                    title: topicData.title,  // Dynamic topic title
                    pid: postData.pid,  // Post ID
                    topicSlug: topicData.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),  // Topic slug
                },
            };
                       

            // Send the email
            try {
                await emailer.send('notification', topicData.uid, emailParams);
                console.log(`Email sent to topic owner (uid: ${topicData.uid}) for reply in topic "${topicData.title}".`);
            } catch (err) {
                console.error(`Failed to send email for reply to topic "${topicData.title}":`, err);
            }
        }

        return result.post;
    };

    async function addReplyTo(postData, timestamp) {
        if (!postData.toPid) {
            return;
        }
        await Promise.all([
            db.sortedSetAdd(`pid:${postData.toPid}:replies`, timestamp, postData.pid),
            db.incrObjectField(`post:${postData.toPid}`, 'replies'),
        ]);
    }

    async function checkToPid(toPid, uid) {
        const [toPost, canViewToPid] = await Promise.all([
            Posts.getPostFields(toPid, ['pid', 'deleted']),
            privileges.posts.can('posts:view_deleted', toPid, uid),
        ]);
        const toPidExists = !!toPost.pid;
        if (!toPidExists || (toPost.deleted && !canViewToPid)) {
            throw new Error('[[error:invalid-pid]]');
        }
    }
};
