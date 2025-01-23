// connexion.js

// Fonction principale pour gérer la connexion
const btnLogin = document.getElementById('btnlogin');

btnLogin.addEventListener('click', async function () {
    const login = document.getElementById('login').value.trim();
    const pwd = document.getElementById('pwd').value.trim();

    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');

    // Réinitialiser les messages d'erreur
    loginError.textContent = "";
    passwordError.textContent = "";

    let hasError = false;

    // Validation des champs
    if (login === "") {
        loginError.textContent = " Veillez entrer le login.";
        hasError = true;
    }

    if (pwd === "") {
        passwordError.textContent = " Veillez entrer le mot de passe.";
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Vérification de l'utilisateur
    try {
        const response = await fetch('http://localhost:3000/utilisateurs'); // Changer 'etudiants' à 'utilisateurs'

        if (response.ok) {
            const utilisateurs = await response.json();

            const utilisateur = utilisateurs.find(user => user.login === login && user.mdp === pwd);

            if (utilisateur) {
                console.log('Connexion réussie', utilisateur);
                connectUser(utilisateur); // Redirection basée sur le rôle
            } else {
                document.getElementById('alertConnex').innerHTML = `<div  class=" p-4 mb-4 mx-10 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-700 dark:text-red-300" role="alert">Login ou mot de passe incorrect.</div>`; 
                document.getElementById('pwd').value = ''; // Réinitialiser le mot de passe
            }
        } else {
            loginError.textContent = "Erreur de connexion avec le serveur.";
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        loginError.textContent = "Une erreur réseau est survenue. Veuillez réessayer plus tard.";
    }
});

// Fonction pour gérer la connexion de l'utilisateur
function connectUser(utilisateur) {
    // Sauvegarder les données de l'utilisateur dans le localStorage
    localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateur));

    // Rediriger l'utilisateur vers la page d'accueil après connexion
    window.location.href = "./tache.html";
}
