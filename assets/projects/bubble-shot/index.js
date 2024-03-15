document.addEventListener("DOMContentLoaded", (event) => {
  const counterDisplay = document.querySelector("h3");
  const countdownDisplay = document.querySelector("#countdown");
  const gameTimerDisplay = document.querySelector("#gameTimer");
  const playAgainButton = document.querySelector("#playAgainButton");
  let counter = 0;
  let gameStarted = false;
  let gameInterval;

  const getRandomSize = () => Math.random() * 200 + 100 + "px";
  const getRandomPosition = () => `${Math.random() * 100 + 50}%`;

  const createBubble = () => {
    if (!gameStarted) return; // Ne crée pas de bulles si le jeu n'a pas commencé

    const bubble = document.createElement("span");
    bubble.classList.add("bubble");
    document.body.appendChild(bubble);

    const size = getRandomSize();
    bubble.style.height = size;
    bubble.style.width = size;
    bubble.style.top = getRandomPosition();
    bubble.style.left = getRandomPosition();

    const plusMinus = Math.random() > 0.5 ? 1 : -1;
    bubble.style.setProperty("--left", `${Math.random() * 100 * plusMinus}%`);

    bubble.addEventListener("click", function () {
      if (!gameStarted) return;
      counter++;
      counterDisplay.textContent = counter;
      bubble.remove();
    });

    setTimeout(() => {
      bubble.remove();
    }, 8000);
  };

  const startGameTimer = () => {
    let gameTimeLeft = 60; // Le jeu dure 60 secondes
    let minutes = Math.floor(gameTimeLeft / 60);
    let seconds = gameTimeLeft % 60;
    gameTimerDisplay.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    const gameTimer = setInterval(() => {
      gameTimeLeft--;
      minutes = Math.floor(gameTimeLeft / 60);
      seconds = gameTimeLeft % 60;
      gameTimerDisplay.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
      if (gameTimeLeft <= 0) {
        clearInterval(gameTimer);
        gameStarted = false; // Arrête le jeu
        clearInterval(gameInterval); // Arrête la création de bulles
        gameTimerDisplay.textContent = "GAME OVER"; // Afficher fin du jeu
        showPlayAgainButton();
      }
    }, 1000);
  };

  const startCountdown = (duration) => {
    let timeLeft = duration;
    countdownDisplay.textContent = timeLeft;

    const countdownTimer = setInterval(() => {
      timeLeft--;
      countdownDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        countdownDisplay.textContent = ""; // Cache le compte à rebours
        counterDisplay.style.display = "block"; // Montre le h3 après le compte à rebours
        gameStarted = true; // Le jeu commence
        gameInterval = setInterval(createBubble, 1000); // Commence à générer des bulles
        startGameTimer(); // Lance le compte à rebours du jeu
      }
    }, 1000);
  };

  const showPlayAgainButton = () => {
    playAgainButton.style.display = "block"; // Montre le bouton
  };

 playAgainButton.addEventListener("click", function () {
   gameStarted = false; // Assurez-vous que le jeu est considéré comme non commencé
   counter = 0; // Réinitialiser le compteur
   counterDisplay.textContent = counter; // Réinitialiser l'affichage du compteur
   counterDisplay.style.display = "none"; // Cache le h3 pendant le compte à rebours
   gameTimerDisplay.textContent = ""; // Efface "GAME OVER" ou le texte actuel
   playAgainButton.style.display = "none"; // Cache le bouton Play Again
   startCountdown(3); // Commencer le compte à rebours avant de commencer une nouvelle partie
 });

  startCountdown(3); // Commence le compte à rebours de 5 secondes avant le début du jeu
});
