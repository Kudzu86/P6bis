document.addEventListener('DOMContentLoaded', () => {
    function fetchFilmDetails(filmUrl) {
        return fetch(filmUrl)
            .then(response => response.json())
            .catch(error => console.error('Erreur lors de la récupération des détails du film:', error));
    }

    window.handleImageError = function(imgElement, imgUrl) {
        console.error(`Erreur de chargement de l'image: ${imgUrl}`);
        imgElement.src = 'https://ih1.redbubble.net/image.3243769575.1059/st,small,507x507-pad,600x600,f8f8f8.jpg';
    }
    
    window.loadCategoryFilms = function(category, containerId) {
        fetch(`http://localhost:8000/api/v1/titles/?genre_contains=${category}&sort_by=-imdb_score&page_size=30`)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById(containerId);
                container.innerHTML = '';

                Promise.all(data.results.map(film => fetchFilmDetails(film.url)))
                    .then(filmsDetails => {
                        filmsDetails.forEach((film, index) => {
                            const filmElement = document.createElement('div');
                            filmElement.classList.add('film-container');
                            filmElement.classList.add('hidden'); // Cache par défaut

                            filmElement.innerHTML = `
                                <div class="film-banner-container">
                                    <a href="${film.image_url}" target="_blank">
                                        <img src="${film.image_url}" alt="Image de couverture de ${film.title}" title="Cliquez pour afficher l'image" 
                                        onerror="handleImageError(this, '${film.image_url}')"/>
                                    </a>
                                    <div class="film-banner">
                                        <div class="film-banner-content">
                                            <h3>${film.title}</h3>
                                            <a href="${film.url}" class="bouton_details">Détails</a>
                                        </div>
                                    </div>
                                </div>
                            `;
                            container.appendChild(filmElement);
                        });

                        updateFilmVisibility(container);

                        // Attacher les événements aux nouveaux boutons "Détails"
                        document.querySelectorAll('.bouton_details').forEach(button => {
                            button.addEventListener('click', (event) => {
                                event.preventDefault(); // Empêche la navigation par défaut
                                const filmUrl = button.getAttribute('href');

                                fetch(filmUrl)
                                    .then(response => response.json())
                                    .then(filmDetails => {
                                        window.openModal(filmDetails); // Appelle la fonction globalement définie
                                    })
                                    .catch(error => console.error('Erreur lors de la récupération des détails du film:', error));
                            });
                        });
                    })
                    .catch(error => console.error('Erreur lors de la récupération des films de la catégorie:', error));
            })
            .catch(error => console.error('Erreur lors de la récupération des films de la catégorie:', error));
    }

    function updateFilmVisibility(container) {
        container.querySelectorAll('.film-container').forEach((film, index) => {
            if (window.innerWidth <= 456 && index >= 2) {
                film.classList.add('hidden');
            } else if (window.innerWidth <= 788 && index >= 4) {
                film.classList.add('hidden');
            } else if (index >= 6) {
                film.classList.add('hidden');
            } else {
                film.classList.remove('hidden');
            }
        });
    }

    loadCategoryFilms('', 'best-movies');
    loadCategoryFilms('Sci-Fi', 'Sci-Fi-movies');
    loadCategoryFilms('Mystery', 'mystery-movies');
    loadCategoryFilms('Fantasy', 'fantasy-movies');

    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const containerId = button.getAttribute('data-target');
            const container = document.getElementById(containerId);
            const hiddenFilms = container.querySelectorAll('.film-container.hidden');

            if (hiddenFilms.length) {
                hiddenFilms.forEach(film => film.classList.remove('hidden'));
                button.textContent = 'Voir moins';
            } else {
                updateFilmVisibility(container);
                button.textContent = 'Voir plus';
            }
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.movies-container').forEach(container => {
            updateFilmVisibility(container);
        });
    });
});
