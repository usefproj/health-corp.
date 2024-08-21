document.addEventListener("DOMContentLoaded", function () {
  fetch("/login-status")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        document.getElementById(
          "calories"
        ).textContent = `Daily Calorie Intake: ${data.bmr} kcal`;
        document.getElementById("signup-link").style.display = "none";
        document.getElementById("login-link").style.display = "none";
        document.getElementById("username").style.display = "inline";
        document.getElementById("username").querySelector("span").textContent =
          data.name;
        document.getElementById("logout-link").style.display = "inline";
      } else {
        document.getElementById("calories").textContent =
          "Daily Calorie Intake: Please log in";
        document.getElementById("signup-link").style.display = "inline";
        document.getElementById("login-link").style.display = "inline";
        document.getElementById("username").style.display = "none";
        document.getElementById("logout-link").style.display = "none";
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
});

const apiKey = "d025fbdf916c403caad20bea59d4f9ec";
const endpoint = "https://api.spoonacular.com/recipes/findByIngredients";
const endpoint2 = "https://api.spoonacular.com/recipes/";

// Select the input fields and recipe container
const input = document.querySelector("#ingredient");
const mealCountInput = document.querySelector("#numberOfMeals");
const container = document.querySelector("#recipeContainer");

// Function to fetch recipes based on ingredients
async function fetchRecipes() {
  const ingredients = input.value.trim();
  const numberOfMeals = Math.min(
    Math.max(parseInt(mealCountInput.value) || 1, 1),
    3
  );
  const url = `${endpoint}?ingredients=${encodeURIComponent(
    ingredients
  )}&number=${numberOfMeals}&apiKey=${apiKey}`;
  console.log(url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const recipes = await response.json();
    container.innerHTML = ""; // Clear previous results

    // Loop through the returned recipes and fetch detailed information
    for (const recipe of recipes) {
      const detailsUrl = `${endpoint2}${recipe.id}/information?apiKey=${apiKey}`;

      const detailsResponse = await fetch(detailsUrl);
      if (!detailsResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const details = await detailsResponse.json();

      // Build the HTML for each recipe card
      const listIngr = details.extendedIngredients
        .map(
          (ingredient) =>
            `<li>${ingredient.name} - ${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitShort}</li>`
        )
        .join("");

      const cardTemplate = `
        <div class="recipeCard">
          <img src="${details.image}" alt="${details.title}" />
          <h2>${details.title}</h2>
          <p>Ready in: ${details.readyInMinutes} minutes</p>
          <button onclick="openRecipe('${details.spoonacularSourceUrl}')">More Info</button>
          <ul>${listIngr}</ul>
        </div>
      `;

      container.innerHTML += cardTemplate;
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Function to open the recipe URL in a popup window
function openRecipe(url) {
  // Check if the popup already exists
  if (document.querySelector(".popup")) return;

  // Create and show the popup
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <div class="popup-content">
      <span class="close" onclick="closePopup()">&times;</span>
      <iframe src="${url}" title="Recipe Details"></iframe>
    </div>
  `;
  document.body.appendChild(popup);

  // Ensure the popup is visible
  popup.classList.add("show");
}

// Function to close the popup window
function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.classList.remove("show");
    // Delay removal of popup to allow CSS transition
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 300); // Adjust timeout based on CSS transition duration
  }
}

