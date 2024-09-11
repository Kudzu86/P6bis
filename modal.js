document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('film-modal');
    const closeModalButtons = document.querySelectorAll('.close, .close-modal');

    // Fonction pour ouvrir la modale et afficher les détails du film
    window.openModal = function(filmDetails) { // Expose openModal globally
        document.getElementById('modal-title').textContent = filmDetails.title;
        document.getElementById('modal-image').src = filmDetails.image_url;
        document.getElementById('modal-image').alt = `Image de couverture de ${filmDetails.title}`;
        document.getElementById('modal-image').title = `Image de couverture de ${filmDetails.title}`;
        document.getElementById('modal-image-bis').src = filmDetails.image_url;
        document.getElementById('modal-image-bis').alt = `Image de couverture de ${filmDetails.title}`;
        document.getElementById('modal-image-bis').title = `Image de couverture de ${filmDetails.title}`;
        document.getElementById('modal-genre').textContent = filmDetails.genres.join(', ');
        document.getElementById('modal-release-date').textContent = filmDetails.year;
        document.getElementById('modal-imdb-score').textContent = filmDetails.imdb_score;
        document.getElementById('modal-director-text').textContent = filmDetails.directors;
        document.getElementById('modal-actors').textContent = filmDetails.actors.join(', ');
        document.getElementById('modal-duration').textContent = filmDetails.duration;
        document.getElementById('modal-country').textContent = filmDetails.countries;
        if (!filmDetails.worldwide_gross_income || !filmDetails.budget_currency) {
            document.getElementById('modal-box-office').textContent = 'non-référencé';
        } else {
            document.getElementById('modal-box-office').textContent = `${filmDetails.worldwide_gross_income} ${filmDetails.budget_currency}`;
        }
        document.getElementById('modal-summary-text').textContent = filmDetails.long_description;

        // Ajuster le titre en fonction de sa longueur
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle.textContent.length > 30) {
            const words = modalTitle.textContent.split(" ");
            let firstLine = "";
            let secondLine = "";
            for (let i = 0; i < words.length; i++) {
                if ((firstLine + words[i]).length <= 30) {
                    firstLine += words[i] + " ";
                } else {
                    secondLine += words[i] + " ";
                }
            }
            modalTitle.innerHTML = firstLine.trim() + "<br>" + secondLine.trim();
        }

        modal.style.display = 'block';
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.style.display = 'none';
    }

    // Fonction pour gérer le clic sur le bouton de détails
    function handleDetailsButtonClick(event) {
        event.preventDefault(); // Empêcher la navigation vers l'URL

        const filmUrl = this.getAttribute('href');

        fetch(filmUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(filmDetails => openModal(filmDetails))
            .catch(error => console.error('Erreur lors de la récupération des détails du film:', error));
    }

    // Ajouter les écouteurs d'événements aux boutons de détails
    document.querySelectorAll('.bouton_details, .bouton_details1').forEach(button => {
        button.addEventListener('click', handleDetailsButtonClick);
    });

    // Ajouter les écouteurs d'événements aux boutons de fermeture
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Fermer la modale si l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
