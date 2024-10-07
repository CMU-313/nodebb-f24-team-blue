# User Guide

This document provides instructions for using the new features added to the system, along with steps for user testing and information about the automated tests implemented for each feature. Below is a detailed guide on how to use the **Email Notification Feature**.

---

### Search Bar Feature

---

### Anonymous Posting Feature

---

### Email Notification Feature

#### Overview
The email notification feature allows users to receive an email when someone replies to a topic they have created. The goal is to ensure users are kept informed about conversations happening on their topics.

#### How to Use

1. **Creating a New Topic:**
   - A user can create a new topic, but no email notifications are sent at this point.
   - Once a reply is made to the topic by another user, the topic creator will receive an email notification.

2. **Receiving Email Notifications:**
   - The email includes details such as the topic title, the content of the reply, and a link to the reply.
   - The email is only sent if the person replying is different from the topic creator.

3. **Notification Rules:**
   - No emails are sent if the topic creator is banned.
   - If there is no valid email address associated with the user, the system will not send any notification.

#### User Testing

To test the email notification feature, follow these steps:

1. **Create a Topic:**
   - As a registered user, create a new topic in a category of your choice.

2. **Reply as Another User:**
   - Log in as another user and post a reply to the topic. The topic creator should receive an email notification for this reply.

3. **Verify the Notification Email:**
   - Check the topic creator's email inbox for the notification.
   - Ensure the email contains the reply content, topic title, and a valid link to the reply.

#### Automated Tests

The tests for the email notification feature can be found in the `test/emailer.js` file. These tests cover:

- **Email Sending Test:**
   - Verifies that an email is sent when a reply is made to a topic.
   - Confirms that the email content includes the topic title and the reply content.

- **Error Scenarios:**
   - Tests that no email is sent when there is no valid recipient email or when the topic creator is banned.

