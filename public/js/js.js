document.querySelector("#sensor-btn1").addEventListener("click", function (e) {
  e.preventDefault();
  showPopUp("#sensor-p1");
});

document.querySelector("#sensor-btn2").addEventListener("click", function (e) {
  e.preventDefault();
  showPopUp("#sensor-p2");
});

document.querySelector("#sensor-btn3").addEventListener("click", function (e) {
  e.preventDefault();
  showPopUp("#sensor-p3");
});

document
  .querySelector(".sensor-buy-btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
    alert("Why are you spending your money on this???");
  });

function showPopUp(selector) {
  const overlay = document.getElementById("sensor-overlay");
  const paragraph = document.querySelector(selector);

  overlay.style.display = "block";
  paragraph.classList.add("sensor-p-true");

  overlay.addEventListener("click", function () {
    paragraph.classList.remove("sensor-p-true");
    overlay.style.display = "none";
  });
}
