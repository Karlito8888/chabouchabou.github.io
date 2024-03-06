document.addEventListener("DOMContentLoaded", () => {
  const rangeValue = document.getElementById("password-length");
  const passwordOutput = document.getElementById("password-output");
  const lowercaseCheckbox = document.getElementById("lowercase");
  const uppercaseCheckbox = document.getElementById("uppercase");
  const numbersCheckbox = document.getElementById("numbers");
  const symbolsCheckbox = document.getElementById("symbols");
  const generateButton = document.getElementById("generateButton");

  const dataLowercase = "azertyuiopqsdfghjklmwxcvbn";
  const dataUppercase = dataLowercase.toUpperCase();
  const dataNumbers = "0123456789";
  const dataSymbols = "!-?";

  function generatePassword() {
    let data = "";
    let password = "";

    if (lowercaseCheckbox.checked) data += dataLowercase;
    if (uppercaseCheckbox.checked) data += dataUppercase;
    if (numbersCheckbox.checked) data += dataNumbers;
    if (symbolsCheckbox.checked) data += dataSymbols;

    if (data.length === 0) {
      alert("Veuillez sélectionner des critères");
      return;
    }

    for (let i = 0; i < rangeValue.value; i++) {
      password += data[Math.floor(Math.random() * data.length)];
    }

    passwordOutput.value = password;
  }

  generateButton?.addEventListener("click", generatePassword);

  function copyToClipboard() {
    passwordOutput.select();
    navigator.clipboard
      .writeText(passwordOutput.value)
      .then(() => {
        generateButton.textContent = "Copié !";
        setTimeout(() => {
          generateButton.textContent = "Générer mot de passe";
        }, 2000);
      })
      .catch((err) => console.error("Erreur lors de la copie : ", err));
  }

  passwordOutput.addEventListener("click", copyToClipboard);
});
