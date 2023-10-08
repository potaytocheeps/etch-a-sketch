const gridContainer = document.querySelector('.grid-container');
const gridSize = 16;

for (let rowCounter = 1; rowCounter <= gridSize; rowCounter++)
{
    let row = document.createElement('div');
    row.classList.add('row');

    for (let gridCellCounter = 1; gridCellCounter <= gridSize; gridCellCounter++)
    {
        let gridCell = document.createElement('div');
        gridCell.classList.add('grid-cell');
        row.appendChild(gridCell);
    }

    gridContainer.appendChild(row);
}

function paintGridCells(event)
{
    event.target.style.backgroundColor = '#000';
}

const gridCells = document.querySelectorAll('.grid-cell');

// One click on the grid will start the painting process. Another click on the grid will
// stop it. This happens by toggling the painting class on the grid container on each click
gridContainer.addEventListener('click', (event) => {
    event.currentTarget.classList.toggle('painting');

    if (gridContainer.classList.contains('painting'))
    {
        // Only paint target if it is a grid cell. This fixes a bug where whole rows
        // or the entire grid are painted if the user clicks and drags on the container
        if (event.target.classList.contains('grid-cell'))
        {
            event.target.style.backgroundColor = '#000';
        }

        gridCells.forEach((gridCell) => gridCell.addEventListener('mouseenter', paintGridCells));
    }
    else
    {
        gridCells.forEach((gridCell) => gridCell.removeEventListener('mouseenter', paintGridCells));
    }
});
