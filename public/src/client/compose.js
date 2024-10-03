'use strict';

define('forum/compose', ['hooks'], function (hooks) {
    const Compose = {};

    Compose.init = function () {
        console.log('Compose init function triggered');  // Log to check if Compose.init is being called

        const container = $('.composer');
        console.log('Container found:', container.length);  // Log the container check

        if (container.length) {
            hooks.fire('action:composer.enhance', {
                container: container,
            });
        }

        // Add the event listener for the "Post Anonymously" checkbox using event delegation
        $(document).ready(function () {
            console.log('Document is ready, adding checkbox listener with event delegation');
            addAnonymousCheckboxListener();
        });
    };

    function addAnonymousCheckboxListener() {
        console.log('Adding event listener for anonymous checkbox with event delegation');  // Log when the listener is added

        // Use event delegation to listen for changes on dynamically loaded elements
        $(document).on('change', '#anonymousPost', function () {
            console.log('Checkbox change detected');  // Log every time the checkbox is changed
            if ($(this).is(':checked')) {
                console.log('Anonymous post option selected');
                localStorage.setItem('anonymousPost', true);
                fetchAnonymousPosts();
            } else {
                console.log('Anonymous post option deselected');
                localStorage.removeItem('anonymousPost');
            }
        });

        // Listen for post submission
		$(document).on('click', '[data-action="post"]', function (e) {
			console.log('Post button clicked');  // Log when the post button is clicked
			const isAnonymous = localStorage.getItem('anonymousPost');
			if (isAnonymous) {
				console.log('Posting anonymously');
				// Add a hidden input field to the form to mark the post as anonymous
				$('<input>').attr({
					type: 'hidden',
					name: 'isAnonymous',
					value: 'true',
				}).appendTo('form');
			}
		});
    }

    function fetchAnonymousPosts() {
        console.log('Fetching anonymous posts via API');
        $.ajax({
            url: '/api/anonymous-posts',  // API endpoint we'll define in the backend
            method: 'GET',
            success: function (data) {
                console.log('Anonymous posts fetched:', data);
                renderAnonymousPosts(data);
            },
            error: function (err) {
                console.error('Error fetching anonymous posts:', err);
            }
        });
    }

    function renderAnonymousPosts(posts) {
        const postsContainer = $('#anonymous-posts');
        postsContainer.empty();  // Clear existing posts

        if (posts.length) {
            posts.forEach(function (post) {
                const postHtml = `<div class="post mb-3">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <hr />
                </div>`;
                postsContainer.append(postHtml);
            });
        } else {
            postsContainer.append('<div class="alert alert-info">No anonymous posts available.</div>');
        }
    }

    return Compose;
});
