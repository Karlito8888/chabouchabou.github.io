class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (
      this.readyToReset ||
      (this.currentOperand.toString() + number.toString()).length <= 11
    ) {
      if (this.readyToReset) {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
        this.readyToReset = false;
      }
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = (
        this.currentOperand.toString() + number.toString()
      ).slice(0, 11); // Limite à 11 caractères
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "" && this.readyToReset) {
      this.operation = operation;
      this.readyToReset = false;
      return;
    }

    if (this.currentOperand === "") return;
    if (this.previousOperand !== "" && !this.readyToReset) {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.readyToReset = false;
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = String(computation).slice(0, 11);
    this.operation = undefined;
    this.previousOperand = "";
    this.readyToReset = true;
  }

  getDisplayNumber(number) {
    let stringNumber = number.toString();
    let integerDigits = parseFloat(stringNumber.split(".")[0]);
    let decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toString();
    }

    // Si le nombre total de chiffres est supérieur à 11, ajustez la précision des décimales.
    if (stringNumber.length > 11) {
      // Si le nombre entier dépasse la limite, tronquez-le.
      if (integerDisplay.length > 11) {
        return integerDisplay.slice(0, 11);
      }

      // Calculez le nombre de chiffres décimaux possibles dans la limite.
      let availableDigitsForDecimals = 10 - integerDisplay.length; // 10 pour les chiffres et 1 pour le point.

      if (decimalDigits) {
        decimalDigits = decimalDigits.slice(0, availableDigitsForDecimals);
      }
    }

    // Gérez l'affichage des nombres avec décimales.
    if (decimalDigits != null && decimalDigits !== "") {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  toggleSign() {
    if (this.currentOperand.startsWith("-")) {
      this.currentOperand = this.currentOperand.substring(1);
    } else if (this.currentOperand !== "") {
      this.currentOperand = "-" + this.currentOperand;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const toggleSignButton = document.querySelector("[data-toggle-sign]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

toggleSignButton.addEventListener("click", () => {
  calculator.toggleSign();
  calculator.updateDisplay();
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});
