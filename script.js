const input = document.querySelector("#pokemonInput");
const button = document.querySelector("#searchBtn");
const cardContainer = document.querySelector("#pokemonCard");
const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#errorMessage");
const themeToggle = document.querySelector("#themeToggle");

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

button.addEventListener("click", fetchPokemon);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchPokemon();
  }
});

async function fetchPokemon() {
  const query = input.value.toLowerCase().trim();

  if (!query) return;

  cardContainer.innerHTML = "";
  errorMessage.classList.add("hidden");
  loading.classList.remove("hidden");
  button.disabled = true;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokémon not found. Please try again.");
      } else {
        throw new Error("Something went wrong. Try again later.");
      }
    }

    const data = await response.json();
    displayPokemon(data);

  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
    button.disabled = false;
  }
}

function displayPokemon(data) {
  const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const id = `#${String(data.id).padStart(3, "0")}`;
  const height = data.height / 10;
  const weight = data.weight / 10;
  const baseExp = data.base_experience;

  const types = data.types.map(type => type.type.name);

  const card = document.createElement("div");
  card.classList.add(
    "bg-gray-100",
    "dark:bg-gray-700",
    "rounded-xl",
    "p-4",
    "shadow-lg",
    "text-center",
    "transform",
    "transition",
    "duration-500",
    "scale-95",
    "opacity-0"
  );

  card.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${name}</h2>
    <p class="text-gray-600 dark:text-gray-300">${id}</p>

    <div class="flex justify-center gap-4 my-4 flex-wrap">
      <img src="${data.sprites.front_default}" alt="${name}">
      <img src="${data.sprites.back_default}" alt="${name}">
      <img src="${data.sprites.front_shiny}" alt="${name}">
    </div>

    <p><strong>Height:</strong> ${height} m</p>
    <p><strong>Weight:</strong> ${weight} kg</p>
    <p><strong>Base Experience:</strong> ${baseExp}</p>

    <div class="mt-3">
      <strong>Types:</strong>
      <div class="flex justify-center gap-2 mt-2 flex-wrap">
        ${types.map(type =>
          `<span class="px-2 py-1 bg-indigo-500 text-white rounded-full text-sm">${type}</span>`
        ).join("")}
      </div>
    </div>
  `;

  cardContainer.appendChild(card);

  setTimeout(() => {
    card.classList.remove("scale-95", "opacity-0");
    card.classList.add("scale-100", "opacity-100");
  }, 50);
}