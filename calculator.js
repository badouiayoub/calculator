const display = document.getElementById("display");
let lastInput = "";
let addpt = true;
const audiobut = new Audio("click_effect-86995-[AudioTrimmer.com].mp3");
const equalbut = new Audio("pick-92276-[AudioTrimmer.com].mp3");
const errorsound = new Audio("error_CDOxCYm.mp3");
const backspacesound = new Audio("mixkit-classic-click-1117.wav");
function appendToDisplay(input) {
  if (display.value == "Infinity" || display.value == "Error") {
    display.value = "";
  }
  audiobut.play();
  checkLastPart();
  const operators = ["+", "-", "x", "/", "^", "%"];

  if (operators.includes(lastInput) && operators.includes(input)) {
    return;
  }
  if (
    !isNaN(input) &&
    (display.value.slice(-1) == "!" || display.value.slice(-1) == ")")
  ) {
    display.value += "x";
  }
  if (input == "(" && display.value.slice(-1) == "!") {
    display.value += "x(";
    return;
  }
  if (input == "(" && display.value.slice(-1) == ")") {
    display.value += "x(";
    return;
  }
  if (input == "(" && display.value != "" && !isNaN(display.value.slice(-1))) {
    display.value += "x(";
    return;
  }

  if (display.value.slice(-1) === "." && input === ".") {
    return;
  }

  if (input === "." && operators.includes(lastInput)) {
    display.value += "0.";
    lastInput = input;
    return;
  }

  if (input === "." && display.value === "") {
    display.value = "0.";
    lastInput = input;
    return;
  }
  if (input === "." && display.value.slice(-1) === "(") {
    display.value += "0.";
    lastInput = input;
    return;
  }

  if (input === "." && addpt) {
    display.value += ".";
    lastInput = input;
    return;
  } else if (input === "." && !addpt) {
    return;
  }

  if (input === "√" && isNaN(display.value.slice(-1))) {
    display.value += "√(";
    lastInput = input;
    return;
  } else if (input === "√" && display.value == "") {
    display.value += "√(";
    lastInput = input;
    return;
  } else if (input === "√" && !isNaN(display.value.slice(-1))) {
    display.value += "x√(";
    lastInput = input;
    return;
  } else if (
    (input === "^" || input === "x" || input === "/" || input === "!") &&
    display.value == ""
  ) {
    return;
  } else if (input === "^") {
    display.value += "^(";
    lastInput = input;
    return;
  } else if (input === "!" && isNaN(display.value.slice(-1))) {
    if (display.value.slice(-1) != ")") return;
  }

  display.value += input;
  lastInput = input;
}

function checkLastPart() {
  const parts = display.value.split(/[-+/x!^√%]+/);
  const lastPart = parts[parts.length - 1];

  addpt = !lastPart.includes(".");
}

function clearDisplay() {
  display.value = "";
  lastInput = "";
}

function calculate() {
  if (display.value != "")
    try {
      equalbut.play();
      let expression = display.value;

      expression = expression.replaceAll("^", "**");
      expression = expression.replaceAll("√", "Math.sqrt");
      expression = expression.replaceAll("x", "*");

      const factorialRegex = /\d+!|\([^)]+\)!/g;
      while (expression.match(factorialRegex)) {
        expression = expression.replace(factorialRegex, (match) => {
          if (match.includes("(")) {
            const innerExpression = match.slice(1, -2);
            const value = eval(innerExpression);
            return factorial(value);
          } else {
            let num = parseInt(match.slice(0, -1));
            return factorial(num);
          }
        });
      }

      function factorial(n) {
        if (n === 0 || n === 1) {
          return 1;
        } else {
          return n * factorial(n - 1);
        }
      }

      display.value = eval(expression);
    } catch (error) {
      errorsound.play();
      display.value = "Error";
      lastInput = "";
    }
}

function clear_click() {
  backspacesound.play();
  if (display.value == "Error" || display.value == "Infinity") {
    display.value = "";
    lastInput = "";
  } else if (
    display.value.slice(-2, -1) === "^" ||
    display.value.slice(-2, -1) === "√"
  ) {
    display.value = display.value.slice(0, -2);
    lastInput = display.value.slice(-1);
  } else {
    display.value = display.value.slice(0, -1);
    lastInput = display.value.slice(-1) || "";
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "+") {
    appendToDisplay("+");
  } else if (event.key === "-") {
    appendToDisplay("-");
  } else if (event.key === "/") {
    appendToDisplay("/");
  } else if (event.key === "!") {
    appendToDisplay("!");
  } else if (event.key === "%") {
    appendToDisplay("%");
  } else if (event.key === "*") {
    appendToDisplay("x");
  } else if (!isNaN(event.key)) {
    appendToDisplay(event.key);
    lastInput = event.key;
  } else if (event.key === "=") {
    calculate();
  } else if (event.key == "Backspace") {
    clear_click();
  } else if (event.key == ".") {
    appendToDisplay(".");
  } else if (event.key === "^") {
    appendToDisplay("^");
  } else if (event.key === "(") {
    appendToDisplay("(");
  } else if (event.key === ")") {
    appendToDisplay(")");
  }
});

function changemode() {
  const changer = document.getElementById("theme");
  const mode = document.getElementById("modebut");
  const sound = new Audio("changemodesoundeffect.mp3");
  if (mode.innerHTML.endsWith("Dark Mode")) {
    sound.play();
    mode.innerHTML = "Default Mode";
    changer.href = "darkcalculator.css";
  } else {
    sound.play();
    mode.innerHTML = "Dark Mode";
    changer.href = "calculator.css";
  }
}
