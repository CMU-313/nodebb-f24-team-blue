# User Guide

This document provides instructions for using the new features added to NodeBB, along with steps for user testing and information about the automated tests implemented for each feature. Below is a detailed guide on how to use the the features that were implemented across both sprints.

## IMPORTANT: 
Due to the anonymous posting feature being located in a NodeBB composer repo, there is an additional repo that is needed to make it work.

In order to install this repo, follow the same instructions as the frontend repo (the composer repo should be in the same directory as the main repo) and npm install it. To see changes, run `./nodebb build`. All repos are linked on the gradescope assignment.

---

### Search Bar Feature

#### Overview
The search topics/bar feature allows users to create a search for any topics by its title in a given category.

#### How to Use/Test

1. **Searching for a topic**
   - Click into any category to see its topic list. Right under the category name, there should be a search bar in the topic list bar
   - Enter a search term into the search bar and press "Enter" to trigger a search. This will immediately replace all the topics with topics that      have the search term you entered.
  
#### Automated Tests

The test for the search bar feature can be found in the `test/topics.js` file.

- **Gets all topics that have the search term within its title**
   - Creates a new test topic that has the word "search" in it and saves it to the Redis DB as hashet (this is necessary since the    
     `searchTopics` API scans the  Redis DB for topics whose title have the search term in it)
   - Calls the `searchTopics` API and verifies that the array of topics it returns all have the search term (in this case, "search") within it

#### Test Case Justification

Since there is only one search bar, that means the user can only trigger this feature by entering a search term. While it is possible to create more unit tests for more search terms, the code/logic executed is more or less the same for any search term entered.

---

### Anonymous Posting Feature

#### Overview
The anonymous posting feature allows users to create a new topic/post anonymously by simply selecting a checkbox when creating the topic! Additionally, within a category, an user can select a checkbox in the topic bar to only show the anonymous posts for their convenience.

#### How to Use/Test

1. **Creating a New Topic**
   - A user can create a new topic in any category
   - To make a post anoynmous, simply click the "Post Anonymously" checkbox which is right after the input for the topic title

2. **Verify the topic was anonymous**
   - If the "Post Anonymously" checkbox was checked, a new topic will show up in the category's topic list
   - The newly created anonymous topic will have a "?" as the profile picture and hovering it will reveal the poster to be a "Guest" user
   - Clicking into the post to view its details maintains the topic's anonymity
     
3. **Showing only anonymous topics**
   - Within each category, there is a "View Anonymous Posts" checkbox right next to the searchbar
   - Clicking this will immediately replace the topics in the category with only the anonymous topics
   - To restore the original topics, simply deselect the checkbox
  
#### Automated Tests

The tests for the email notification feature can be found in the `test/topics.js` file. These tests cover:

- **Creating an anonymous topic and verifying it's anonymous**
   - Creates a new anonymous topic 
   - Confirms that the new topic is anonymous by checking if `anonymous` in `topicData` is true

- **Creating a topic that not anonymous and verifying it's not anonymous**
   - Create a new topic that is not anonymous
   - Confirms that the new topic is not anonymous by checking if `anonymous` in `topicData` is false

- **Verifying that the selecting the "View Anonymous Post" checkbox only returns topics that are anonymous**
   - Creates a new anonymous topic that is anonymous and saves to Redis as hashet (this is necessary since the `anonymousTopics` API scans the    
     Redis DB for topics that are marked as anonymous)
   - Calls the `anonymousTopics` API and asserts that it returns an array of of topics
   - Loops through the array of topics and checks that each topic in that array is anonymous
   - Cleans up by deleting the anonymous topic that was created at the beginning from the Redis DB

#### Test Case Justification

Because this functionality only covers making an anonymous topic and then rendering them, these three tests (creating a anonymous topic, create a topic that is not anonymous, and render anonymous topics) are enough. This is because these three scenarios represent all the ways that an user can interact with this feature.

---

### Email Notification Feature

IMPORTANT: Email notifications will not work on the live Azure deployment as an email server on Azure requires creating more resources. Because of this, testing this feature can only be done locally.

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
   - As a registered user (prefably the admin), create a new topic in a category of your choice.

2. **Reply as Another User:**
   - Log in as another user and post a reply to the topic (new users can only post every 120 seconds)! The topic creator should receive an email 
     notification for this reply.

3. **Verify the Notification Email:**
   - Check the topic creator's email inbox for the notification.
   - Ensure the email contains the reply content, topic title, and a valid link to the reply.
   - This email might go to spam so check that!

#### Automated Tests

The tests for the email notification feature can be found in the `test/emailer.js` file. These tests cover:

- **Email Sending Test:**
   - Verifies that an email is sent when a reply is made to a topic.
   - Confirms that the email content includes the topic title and the reply content.

- **Error Scenarios:**
   - Tests that no email is sent when there is no valid recipient email or when the topic creator is banned.

### Test Case Justification

Because this functionality only works when making a reply to another post by another user, two tests (one success and one failure) are enough to cover all possible scenarios for this feature.
