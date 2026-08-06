// question 1
function OddEven() {
  let num = document.getElementById("num").value;
  if (num % 2 === 0) {
    let oddEvenResult = document.getElementById("oddEvenResult");
    oddEvenResult.textContent = "زوج";
    oddEvenResult.style.color = "blue";
    oddEvenResult.style.backgroundColor = "rgb(0, 0, 0)";
  } else {
    let oddEvenResult = document.getElementById("oddEvenResult");
    oddEvenResult.textContent = "فرد";
    oddEvenResult.style.color = "red";
    oddEvenResult.style.backgroundColor = "rgb(0, 0, 0)";
  }
}

// question 2
function SumNumbers() {
  let num = parseInt(document.getElementById("num1").value);
  let sumBtn = document.getElementById("sumBtn");
  let result = document.getElementById("res");
  result.style.color = "#fff";
  result.style.backgroundColor = "rgb(0, 0, 0)";
  let sum = 0;
  for (let i = 1; i <= num; i++) {
    sum += i;
  }
  result.textContent = "جمع اعداد یک تا " + num + " میشود : " + sum;
}

// question 3
function DrawTriangle() {
  let num = parseInt(document.getElementById("num3").value);
  let drawBtn = document.getElementById("drawBtn");
  let result = document.getElementById("triangleResult");
  result.style.color = "#fff";
  result.style.backgroundColor = "rgb(0, 0, 0)";
  let triangle = "";
  for (let i = 1; i <= num; i++) {
    triangle += "*".repeat(i) + "<br/>";
  }
  result.innerHTML = triangle;
}

// question 4
function DivisibleBy3And7() {
  let num = parseInt(document.getElementById("num4").value);
  let result = document.getElementById("divisibleBy3And7Result");
  result.style.color = "#fff";
  result.style.backgroundColor = "rgb(0, 0, 0)";
  let divisibleCount = 0;
  let notDivisibleCount = 0;
  for (let i = 1; i <= num; i++) {
    if (i % 3 === 0 && i % 7 === 0) {
      divisibleCount++;
    } else {
      notDivisibleCount++;
    }
  }
  result.innerHTML =
    "تعداد اعداد بخش پذیر به 3 و 7: " +
    divisibleCount +
    "<br/>" +
    "تعداد اعداد بخش پذیر نیستند: " +
    notDivisibleCount;
}
