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

function getRandomValue(highestValueInRange)
{
    return Math.floor((Math.random() * (highestValueInRange + 1)));
}

function getRandomColor()
{
    return `rgb(${getRandomValue(255)}, ${getRandomValue(255)}, ${getRandomValue(255)})`
}

function retrieveColorValues(colorString = '')
{
    // Get only the numbers part of the color string. The string will come in the form of:
    // "rgb(redValue, greenValue, blueValue)"
    colorString = colorString.substring(colorString.indexOf('(') + 1, colorString.indexOf(')'));
    let RGBColorValuesArray = colorString.split(', ');

    return RGBColorValuesArray.map((colorValue) => Number(colorValue));
}

function darkenColor(originalColorValuesArray, currentColorValuesArray)
{
    for (let index = 0; index < originalColorValuesArray.length; index++)
    {
        // This formula will darken the current color by a tenth of its original
        // shade, meaning that after ten passes, the original color will have completely
        // turned to black
        currentColorValuesArray[index] -= ((originalColorValuesArray[index]) / 10);
    }

    return currentColorValuesArray;
}

function lightenColor(originalColorValuesArray, currentColorValuesArray)
{
    for (let index = 0; index < originalColorValuesArray.length; index++)
    {
        // This formula will lighten the current color by a tenth of its original
        // shade, meaning that after ten passes, the original color will have completely
        // turned to white
        currentColorValuesArray[index] += ((255 - originalColorValuesArray[index]) / 10);
    }

    return currentColorValuesArray;
}

function changeColorShading(event, brushType = '')
{
    let currentColor = event.target.style.backgroundColor;
    let originalColor = event.target.originalColor;

    let currentColorValuesArray = retrieveColorValues(currentColor);
    let originalColorValuesArray = retrieveColorValues(originalColor);
    let newColorValuesArray = null;

    if (brushType.includes('darken-color'))
    {
        newColorValuesArray = darkenColor(originalColorValuesArray, currentColorValuesArray);
    }
    else if (brushType.includes('lighten-color'))
    {
        newColorValuesArray = lightenColor(originalColorValuesArray, currentColorValuesArray);
    }

    console.log('Original Color: ' + originalColorValuesArray);
    console.log('Current Color: ' + currentColorValuesArray);
    console.log('New Color: ' + newColorValuesArray);

    return `rgb(${newColorValuesArray[0]}, ${newColorValuesArray[1]}, ${newColorValuesArray[2]})`;
}

function paintGridCells(event)
{
    const brushButtons = document.querySelectorAll('.brush');

    for (const brushButton of brushButtons)
    {
        if (brushButton.classList.contains('selected'))
        {
            if (brushButton.className.includes('single-color'))
            {
                event.target.style.backgroundColor = '#000';
                // Create a new property of the event.target object to store the original
                // color that was used to paint this grid cell. This value can then later be
                // used for the calculation for darkening the color with the darken color brush
                event.target.originalColor = event.target.style.backgroundColor;
            }
            else if (brushButton.className.includes('random-color'))
            {
                event.target.style.backgroundColor = getRandomColor();
                event.target.originalColor = event.target.style.backgroundColor;
            }
            else if (brushButton.className.includes('darken-color') || brushButton.className.includes('lighten-color'))
            {
                event.target.style.backgroundColor = changeColorShading(event, brushButton.className);
            }
        }
    }
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
            paintGridCells(event);
        }

        gridCells.forEach((gridCell) => gridCell.addEventListener('mouseenter', paintGridCells));
    }
    else
    {
        gridCells.forEach((gridCell) => gridCell.removeEventListener('mouseenter', paintGridCells));
    }
}

function getUserInput()
{
    let userInput = Number(prompt("Enter size n of new nxn grid (must be within range of 1-100):", 16));

    while (userInput <= 0 || userInput > 100)
    {
        alert("Please enter a number that is within the range of 1-100.");
        userInput = Number(prompt("Enter size n of new nxn grid (must be within range of 1-100):", 16));
    }

    return userInput;
}

function createGrid()
{
    const gridContainer = document.querySelector('.grid-container');
    const createGridButton = document.querySelector('.create-grid');

    createGridButton.addEventListener('click', () => {
        // Delete current grid before creating a new one. This makes sure that
        // the new grid will replace the old one and not be appended below it instead
        deleteGrid(gridContainer);

        const gridSize = getUserInput();

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

function removeSelection(brushButtons)
{
    for (const brushButton of brushButtons)
    {
        if (brushButton.classList.contains('selected'))
        {
            brushButton.classList.remove('selected');
        }
    }
}

function addInteractionToButtons()
{
    const brushButtons = document.querySelectorAll('.brush');

    for (const brushButton of brushButtons)
    {
        brushButton.addEventListener('click', (event) => {
            // The selection removal on the buttons makes sure that only one
            // is selected at a time. When a brush button is clicked, any other
            // button that was selected will be deselected
            removeSelection(brushButtons);
            event.target.classList.add('selected');
        });
    }
}

createGrid();
addInteractionToButtons();
