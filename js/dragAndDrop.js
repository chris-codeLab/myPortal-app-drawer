// Helper function to handle drag start
function handleDragStart(e) {
    e.originalEvent.dataTransfer.setData('text/plain', e.target.id);
    e.originalEvent.dataTransfer.setData('parent-id', e.target.parentElement.id);
    $(e.target).addClass('dragging');
}

// Helper function to handle drag enter
function handleDragEnter(e) {
    e.preventDefault();
    $(e.target).addClass('card-over');
}

// Helper function to handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    $(e.target).removeClass('card-over');
}

// Helper function to handle drag end
function handleDragEnd(e) {
    $(e.target).removeClass('dragging');
}

// Helper function to handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'move';
}

// Helper function to handle drop
function handleDrop(e) {
    e.preventDefault();

    const target = $(e.target);

    // Check if the target is a valid column and not a card
    if (!target.hasClass('boxDisplayStripColumn') && target.hasClass('boxDisplayCard')) {
        return;
    }

    const cardId = e.originalEvent.dataTransfer.getData('text/plain');
    const originalParentId = e.originalEvent.dataTransfer.getData('parent-id');
    const targetParentId = e.target.id;

    // Check if the target column is the same as the original column
    if (originalParentId === targetParentId) {
        const card = $(`#${cardId}`);
        target.append(card);
    }
}


// Initialize drag and drop event listeners
function initializeDragAndDrop() {
    const cards = $('.boxDisplayCard');
    const columns = $('.boxDisplayStripColumn');

    // Add event listeners for cards
    cards.each(function () {
        $(this).on('dragstart', handleDragStart);
        $(this).on('dragend', handleDragEnd);
        $(this).on('dragenter', handleDragEnter);
        $(this).on('dragleave', handleDragLeave);
        $(this).attr('draggable', 'true');
    });

    // Add event listeners for columns
    columns.each(function () {
        $(this).on('dragover', handleDragOver);
        $(this).on('drop', handleDrop);
    });
}

// Initialize the drag and drop functionality on DOM ready
$(document).ready(initializeDragAndDrop);