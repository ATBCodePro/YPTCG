/* Javascript Area */
let cards = []; let filteredCards = []; /* Empty Array Literal; Prepare Some Space In Memory */
const jsonSource = window.location.pathname.includes("page2.html") ? "exclude.json" : "cards.json";
fetch(jsonSource).then(res => res.json()).then(data => { filteredCards = cards = data; renderCards(); });

/* Constraints Area */
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const colSelect = document.getElementById("columns");
const jumpSelect = document.getElementById("jump-to");
const darkToggle = document.getElementById("dark-mode-toggle");
const grid = document.getElementById("card-grid");

// New Modal Elements
const modal = document.getElementById("card-modal");
const modalImg = document.getElementById("modal-img");
const modalClose = document.querySelector(".modal-close");

/* Search Area */
searchInput.addEventListener("input", e => {const value = e.target.value.toLowerCase(); /* Search */
filteredCards = cards.filter(c => c.CRDNME.toLowerCase().includes(value) );renderCards();});

/* Sort Area */
sortSelect.addEventListener("change", e => {
    const mode = e.target.value;
    const searchTerm = searchInput.value.toLowerCase();
    let result = cards.filter(c => c.CRDNME.toLowerCase().includes(searchTerm));
    
    if (mode === "evo") {
        result.sort((a, b) => (a.EVO || 0) - (b.EVO || 0));
    } 
    else if (mode === "lp_desc") { // Highest to Lowest
        result = result.filter(c => c.LP !== undefined && c.LP !== null && c.LP !== "");
        result.sort((a, b) => b.LP - a.LP);
    } 
    else if (mode === "lp_asc") { // Lowest to Highest
        result = result.filter(c => c.LP !== undefined && c.LP !== null && c.LP !== "");
        result.sort((a, b) => a.LP - b.LP);
    } 
    else if (mode === "name") {
        result.sort((a, b) => a.CRDNME.localeCompare(b.CRDNME));
    }
    
    filteredCards = result; 
    renderCards();
});

/* Zoom Area */
colSelect.addEventListener("change", (e) => {const numCols = e.target.value;
grid.style.setProperty('--cols', numCols);}); 

/* Jump List */
if (jumpSelect) {jumpSelect.addEventListener("change", (e) => {const threshold = parseInt(e.target.value);
if (sortSelect.value !== "evo") {sortSelect.value = "evo"; sortSelect.dispatchEvent(new Event('change'));}
const targetIndex = filteredCards.findIndex(card => (card.EVO || 0) > threshold); if (targetIndex !== -1) {
const cardElements = grid.querySelectorAll(".card"); const targetElement = cardElements[targetIndex];
if (targetElement) {targetElement.scrollIntoView({behavior: "smooth", block: "center"});}}
jumpSelect.value = "";});}

/* Toggle Area */
darkToggle.addEventListener("click", () => {grid.classList.toggle("darkness-active");});

/* Modal Logic Hooks */
// Close modal when 'X' is clicked
modalClose.addEventListener("click", () => {
    modal.classList.remove("modal-open");
});

// Close modal when clicking anywhere on the dark background area
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("modal-open");
    }
});

/* Cards Area */
function renderCards() {
    grid.innerHTML = ""; 
    filteredCards.forEach(card => {
        const div = document.createElement("div"); 
        div.className = "card"; 
        
        const img = document.createElement("img"); 
        img.src = card.IMG_URL; 
        
        // Modal Open Event Triggered on Image Click
        img.addEventListener("click", () => {
            modalImg.src = card.IMG_URL;
            modal.classList.add("modal-open");
        });
        
        div.appendChild(img); 
        grid.appendChild(div); 
    }); 
}
