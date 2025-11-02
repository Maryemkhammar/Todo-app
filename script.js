// --- Sélection des éléments ---
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const filters = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", renderTasks);
form.addEventListener("submit", addTask);
filters.forEach(btn => btn.addEventListener("click", changeFilter));

// --- Ajouter une tâche ---
function addTask(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return alert("Veuillez entrer une tâche !");
  
  const newTask = {
    id: Date.now(),
    texte: text,
    terminee: false,
    date: new Date().toLocaleString()
  };

  tasks.push(newTask);
  saveTasks();
  input.value = "";
  renderTasks();
}

// --- Sauvegarder les tâches ---
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Rendu des tâches ---
function renderTasks() {
  list.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.terminee;
    if (currentFilter === "completed") return task.terminee;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.terminee ? " completed" : "");

    li.innerHTML = `
      <label>
        <input type="checkbox" ${task.terminee ? "checked" : ""} data-id="${task.id}" />
        <span>${task.texte}</span>
      </label>
      <button class="delete-btn" data-id="${task.id}">✖</button>
    `;

    list.appendChild(li);
  });

  updateCounter();

  // Ajout des événements
  document.querySelectorAll('input[type="checkbox"]').forEach(chk =>
    chk.addEventListener("change", toggleTask)
  );
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", deleteTask)
  );
}

// --- Marquer une tâche terminée ---
function toggleTask(e) {
  const id = parseInt(e.target.dataset.id);
  tasks = tasks.map(task =>
    task.id === id ? { ...task, terminee: !task.terminee } : task
  );
  saveTasks();
  renderTasks();
}

// --- Supprimer une tâche ---
function deleteTask(e) {
  const id = parseInt(e.target.dataset.id);
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// --- Changer le filtre ---
function changeFilter(e) {
  filters.forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentFilter = e.target.dataset.filter;
  renderTasks();
}

// --- Mettre à jour le compteur ---
function updateCounter() {
  const activeCount = tasks.filter(t => !t.terminee).length;
  counter.textContent = `${activeCount} tâche(s) restante(s)`;
}
