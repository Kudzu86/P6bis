document.addEventListener('DOMContentLoaded', () => {
    // URL de l'API pour récupérer les genres
    const apiUrl = 'http://localhost:8000/api/v1/genres/?page_size=25';

    // Fonction pour récupérer les genres de l'API
    function fetchGenres() {
        return fetch(apiUrl)
            .then(response => response.json())  // Convertir la réponse en JSON
            .then(data => {
                const genres = data.results;  // Les genres sont dans data.results
                return genres;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des genres:', error);
                return [];
            });
    }

    // Fonction pour afficher les genres dans la page
    function displayGenres(genres) {
        const ul = document.getElementById('genre-list');
        ul.innerHTML = ''; // Nettoyer le contenu précédent
    
        genres.forEach(genre => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";  // On empêche la redirection
            a.textContent = genre.name;  // Nom du genre
            li.appendChild(a);
            ul.appendChild(li);
    
            // Ajout d'un événement click pour charger les films de ce genre
            a.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('selected-genre-title').textContent = genre.name;
                document.getElementById('selected-genre-title').style.display = 'flex';
                document.getElementById('selected-genre-movies').style.display = 'flex';
                document.getElementById('toggle-selected-genre').style.display = 'flex';
                loadCategoryFilms(genre.name, 'selected-genre-movies');
            });
        });
    }
    

    // Fonction pour activer l'accordéon
    function setupAccordion() {
        const accordion = document.querySelector('.accordion');
        const panel = document.querySelector('.panel');
        const arrow = document.querySelector('.accordion .arrow');

        accordion.addEventListener('click', function() {
            this.classList.toggle('active');
            if (panel.style.maxHeight) {
                // Accordéon ouvert, on le ferme
                panel.style.maxHeight = null;
                arrow.innerHTML = '&#9660;'; // Flèche vers le bas
            } else {
                // Accordéon fermé, on l'ouvre
                panel.style.maxHeight = panel.scrollHeight + "px";
                arrow.innerHTML = '&#9650;'; // Flèche vers le haut
            }
        });
    }

    // Récupérer et afficher les genres
    fetchGenres().then(genres => {
        displayGenres(genres);
        setupAccordion(); // Configurer l'accordéon après que les genres soient affichés
    });
});
