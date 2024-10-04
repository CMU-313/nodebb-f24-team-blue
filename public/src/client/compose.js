define('forum/compose', ['hooks'], function (hooks) {
    const Compose = {};

    Compose.init = function () {
        const container = $('.composer');

        if (container.length) {
            hooks.fire('action:composer.enhance', {
                container: container,
            });
        }

        handleAnonymousPost();
    };

    return Compose;
});

function handleAnonymousPost() {
	console.log('handleAnonymousPost function called');
    const $checkbox = $('[component="composer"] .form-check-input');

    $checkbox.on('click', async function (event) {
        const isChecked = $checkbox.is(':checkd');
        const pid = ajaxify.data.pid;

        try {
            const response = await api.post(`/posts/${pid}/anonymous`, {
                anonymous: isChecked,
            });

            if (response.success) {
                console.log('Anonymous post status updated successfully.');
            } else {
                console.error('Failed to update anonymous post status.');
            }
        } catch (error) {
            console.error('Error updating anonymous post status: ', error);
        }
    });
}

