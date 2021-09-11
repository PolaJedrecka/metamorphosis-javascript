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
    initDropzone(ui.mixedCardsContainer);
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
    dropzone.setAttribute('listener', true)
}

function handleDragStart(e) {
    this.classList.add('highlight')
    game.dragged = e.currentTarget;
    let animalType = game.dragged.getAttribute('animal-type')
    for (let slot of ui.slots) {
        if (slot.parentNode.parentNode.classList[0] !== animalType) {
            removeDragEvents(slot)
        } else {
            if (hasDragEvents(slot)) {
                changeSlotsAppearanceByAnimalType(animalType)
                changeMixedContainerAppearance();
            } else {
                initDropzone(slot)
                changeSlotsAppearanceByAnimalType(animalType)
                changeMixedContainerAppearance();
            }
        }
    }

    console.log("Drag start of", game.dragged);
}

function handleDragEnd() {
    console.log("Drag end of", game.dragged);
    this.classList.remove('highlight')
    restoreAllSlotsAppearance()
    restoreMixedContainerAppearance()

    game.dragged = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    changeDragEnterAppearance(this)
    e.preventDefault();
    console.log("Drag enter of", e.currentTarget);
}

function handleDragLeave(e) {
    if (e.dataTransfer.types.includes('type/dragged-box') && e.relatedTarget !== null &&
    e.currentTarget !== e.relatedTarget.closest('.card-slot') ||
    e.currentTarget !== e.relatedTarget.closest('.mixed-cards')) {
    let animalType = game.dragged.getAttribute('animal-type')
    changeSlotsAppearanceByAnimalType(animalType)
    changeMixedContainerAppearance();
    }
    e.preventDefault();
    console.log("Drag leave of", e.currentTarget);
}

function handleDrop(e) {
    e.preventDefault();
    restoreAllSlotsAppearance()
    const dropzone = e.currentTarget;
    if (dom.hasClass(dropzone, "card-slot")) {
        if (dom.isEmpty(dropzone)) {
            dropzone.appendChild(game.dragged);
            if (hasWon(dropzone)) {
                DisplayWinnerPage()
            }
            return;
        }
    } else if (dom.hasClass(dropzone, 'mixed-cards')) {
        dropzone.appendChild(game.dragged)
    }
}

function changeSlotsAppearanceByAnimalType(animalType) {
    ui.emptySlots = document.querySelectorAll(".card-slot:empty");
    ui.emptySlots.forEach(function(slot){
        if (slot.parentNode.parentNode.classList[0] === animalType) {
            changeAppearance(slot)
        }
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

function changeDragEnterAppearance(elem) {
    ui.emptySlots = document.querySelectorAll(".card-slot:empty");
    ui.mixedCardsContainer = document.querySelector(".mixed-cards");
    ui.emptySlots.forEach(function(slot) {
        if (elem === slot) {
            if (elem.parentNode.parentNode.classList[0] === game.dragged.getAttribute('animal-type')) {
            elem.style.background = '#dda0dd'
            elem.style.border = '4px solid #da70d6'
        }}
    if (elem === ui.mixedCardsContainer) {
        elem.style.background = '#dda0dd'
        elem.style.border = '4px dashed #da70d6'}
    })}

function changeMixedContainerAppearance() {
    ui.mixedCardsContainer = document.querySelector(".mixed-cards");
    ui.mixedCardsContainer.style.background = '#e6e6fa'
    ui.mixedCardsContainer.style.border = '4px dashed #6a5acd'
}
function restoreMixedContainerAppearance() {
    ui.mixedCardsContainer = document.querySelector(".mixed-cards");
    ui.mixedCardsContainer.style.background = '#eee'
    ui.mixedCardsContainer.style.border = '4px dashed #cdcdcd'
}
function changeALLEmptySlotsAppearance() {
    ui.emptySlots = document.querySelectorAll(".card-slot:empty");
    ui.emptySlots.forEach(function(slot) {
        changeAppearance(slot)
    })
}
function hasDragEvents(elem) {
    return elem.hasAttribute('listener');
}

function removeDragEvents(slot) {
        slot.removeEventListener("dragenter", handleDragEnter);
        slot.removeEventListener("dragover", handleDragOver);
        slot.removeEventListener("dragleave", handleDragLeave);
        slot.removeEventListener("drop", handleDrop);
        slot.removeAttribute('listener')
}
function hasWon() {
    ui.slots = document.querySelectorAll(".card-slot");
    for (let slot of ui.slots) {
        if (slot.getAttribute('slot-order') !== slot.firstChild.getAttribute('card-order')) {
            return false
        }
    }
    return true
}
function DisplayWinnerPage() {
    alert('You win the game!')
}


initDragAndDrop()




