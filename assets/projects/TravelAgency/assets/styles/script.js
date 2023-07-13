var stepsLink = document.querySelector('a[href="#steps"]');

// Fonction pour modifier l'attribut href du lien #steps
function updateStepsLinkHref() {
    if (window.innerWidth < 880) {
        stepsLink.setAttribute('href', '#section-carousel');
    } else {
        stepsLink.setAttribute('href', '#steps');
    }
}

// Appeler la fonction de mise à jour initiale
updateStepsLinkHref();

// Écouter les changements de taille de fenêtre
window.addEventListener('resize', function () {
    updateStepsLinkHref();
});