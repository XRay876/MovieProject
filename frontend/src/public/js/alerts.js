console.log('alerts.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    window.location.href = '/';
                } else {
                    console.error('Logout failed:', response.statusText);
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Logout request error:', error);
                alert('An error occurred during logout.');
            }
        });
    }

    const editMovieButton = document.getElementById('edit-movie-button');
    if (editMovieButton) {
        editMovieButton.addEventListener('click', (e) => {
            const movieId = editMovieButton.dataset.movieId;
            window.location.href = `/movies/${movieId}/edit`; // Redirect to edit page
        });
    }

    const deleteMovieButton = document.getElementById('delete-movie-button'); // Changed ID to target button
    if (deleteMovieButton) {
        deleteMovieButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const confirmDelete = confirm('Are you sure you want to delete this movie? This action cannot be undone.');

            if (confirmDelete) {
                const movieId = deleteMovieButton.dataset.movieId;
                try {
                    const response = await fetch(`/movies/${movieId}/delete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        window.location.href = '/movies';
                    } else {
                        console.error('Delete failed:', response.statusText);
                        alert('Delete failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Delete request error:', error);
                    alert('An error occurred during deletion.');
                }
            }
        });
    }
});