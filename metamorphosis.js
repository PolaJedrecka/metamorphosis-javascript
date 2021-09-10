const dom = {
    isEmpty: function (el) {
        return el.children.length === 0;
    },
    hasClass: function (el, cls) {
        return el.classList.contains(cls);
    },
};

const ui = {
    mixedCardsContainer: null,
    slots: null,
    cards: null,
    emptySlots: null
};

const game = {
    dragged: null,
};

function initDragAndDrop() {
    initElements();
    shuffleCards();
    initDragEvents();
}

function initElements() {
    ui.cards = document.querySelectorAll(".card");
    ui.slots = document.querySelectorAll(".card-slot");
    ui.mixedCardsContainer = document.querySelector(".mixed-cards");

    ui.cards.forEach(function (card) {
        card.setAttribute("draggable", true);
    });
}

function shuffleCards() {
    const mixedCards = ui.mixedCardsContainer.children;

    for (let i = mixedCards.length; i >= 0; i--) {
        ui.mixedCardsContainer.appendChild(mixedCards[(Math.random() * i) | 0]);
    }
}

function initDragEvents() {
    ui.cards.forEach(function (card) {
        initDraggable(card);
    });

    ui.slots.forEach(function (slot) {
        initDropzone(slot);
    });
}

function initDraggable(draggable) {
    draggable.setAttribute("draggable", true);
    draggable.addEventListener("dragstart", handleDragStart);
    draggable.addEventListener("dragend", handleDragEnd);
}

function initDropzone(dropzone) {
    dropzone.addEventListener("dragenter", handleDragEnter);
    dropzone.addEventListener("dragover", handleDragOver);
    dropzone.addEventListener("dragleave", handleDragLeave);
    dropzone.addEventListener("drop", handleDrop);
}
function handleDragStart(e) {
    this.classList.add('highlight')
    game.dragged = e.currentTarget;
    changeALLSlotsAppearance()
    console.log("Drag start of", game.dragged);
}

function handleDragEnd() {
    console.log("Drag end of", game.dragged);
    this.classList.remove('highlight')
    restoreAllSlotsAppearance()
    game.dragged = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    this.style.background = '#dda0dd'
    this.style.border = '4px solid #da70d6'
    console.log("Drag enter of", e.currentTarget);
}

function handleDragLeave(e) {
    changeALLSlotsAppearance()
    console.log("Drag leave of", e.currentTarget);
}

function handleDrop(e) {
    e.preventDefault();
    restoreAllSlotsAppearance()
    const dropzone = e.currentTarget;
    console.log("Drop of", dropzone);

    if (dom.hasClass(dropzone, "card-slot")) {
        if (dom.isEmpty(dropzone)) {
            dropzone.appendChild(game.dragged);
            return;
        }
    }
}

initDragAndDrop();


function changeALLSlotsAppearance() {
    ui.emptySlots = document.querySelectorAll(".card-slot:empty");
    ui.emptySlots.forEach(function(slot){
        changeAppearance(slot)
    })
}

function changeAppearance(slot) {
    slot.style.background = '#ffb6c1'
    slot.style.border = '4px solid #db7093'
}

function restoreAllSlotsAppearance() {
    ui.emptySlots = document.querySelectorAll(".card-slot:empty");
    ui.emptySlots.forEach(function(slot){
        restoreAppearance(slot)
    })
}

function restoreAppearance(slot) {
    slot.removeAttribute('style')
}
