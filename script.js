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

const gridCells = document.querySelectorAll('.grid-cell');

gridCells.forEach((gridCell) => {
    gridCell.addEventListener('mouseenter', (event) => {
        event.target.style.backgroundColor = '#000';
    })
})
