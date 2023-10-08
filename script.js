function deleteGrid(gridContainer)
{
    while (gridContainer.hasChildNodes())
    {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    // This helps fix a bug where, upon creating a new grid, the "painting" class would
    // remain on the grid container, and it would take two separate clicks to
    // be able to start painting on the grid again, instead of the usual single click
    if (gridContainer.classList.contains('painting'))
    {
        gridContainer.classList.remove('painting');
    }
}

function paintGridCells(event)
{
    event.target.style.backgroundColor = '#000';
}

function addPaintingInteractionToGrid(event)
{
    const gridContainer = document.querySelector('.grid-container');
    const gridCells = document.querySelectorAll('.grid-cell');

    // One click on the grid will start the painting process. Another click on the grid will
    // stop it. This happens by toggling the painting class on the grid container on each click
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
}

function createGrid()
{
    const gridContainer = document.querySelector('.grid-container');
    const createGridButton = document.querySelector('.create-grid');

    createGridButton.addEventListener('click', () => {
        // Delete current grid before creating a new one. This makes sure that
        // the new grid will replace the old one and not be appended below it instead
        deleteGrid(gridContainer);

        const gridSize = Number(prompt("Enter size n of new nxn grid:", 16));

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
    });

    gridContainer.addEventListener('click', addPaintingInteractionToGrid);
}

createGrid();
