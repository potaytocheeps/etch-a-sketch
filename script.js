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

function checkShadingThreshold(originalColorValuesArray, currentColorValuesArray, shadingType)
{
    let passesThreshold = true;

    for (let index = 0; index < originalColorValuesArray.length; index++)
    {
        if (shadingType === 'darkening')
        {
            // If at least one color value is still above the original color value, then
            // the threshold has not yet been achieved, meaning that we have not yet arrived
            // at the original shading
            if (currentColorValuesArray[index] > originalColorValuesArray[index])
            {
                passesThreshold = false;
            }
        }
        else if (shadingType === 'lightening')
        {
            if (currentColorValuesArray[index] < originalColorValuesArray[index])
            {
                passesThreshold = false;
            }
        }
    }

    return passesThreshold;
}

function darkenColor(event, originalColorValuesArray, currentColorValuesArray)
{
    for (let index = 0; index < originalColorValuesArray.length; index++)
    {
        if (event.target.classList.contains('lightened'))
        {
            // This formula works only when the lighten color brush has been previously
            // used on a colored grid cell. It will darken a lightened color back to its
            // original shade after, at most, ten steps
            currentColorValuesArray[index] -= Math.ceil(((255 - originalColorValuesArray[index]) / 10));

            // Once the RGB values for the current color go below the grid cell's original
            // color values, the current color values will be replaced by the original color values. This
            // makes sure that the grid cell's color will arrive back at its original shading after having
            // been lightened and then darkened
            if (index >= 2 && checkShadingThreshold(originalColorValuesArray, currentColorValuesArray, 'darkening'))
            {
                currentColorValuesArray = originalColorValuesArray;
                return currentColorValuesArray;
            }
        }
        else
        {
            // This formula will darken the current color by a tenth of its original
            // shade, meaning that after ten passes, the original color will have completely
            // turned to black
            currentColorValuesArray[index] -= Math.ceil(((originalColorValuesArray[index]) / 10));
        }
    }

    return currentColorValuesArray;
}

function lightenColor(event, originalColorValuesArray, currentColorValuesArray)
{
    for (let index = 0; index < originalColorValuesArray.length; index++)
    {
        if (event.target.classList.contains('darkened'))
        {
            // This formula will bring the shading back to the original color after at most
            // ten steps, only if the grid cell has been previously darkened
            currentColorValuesArray[index] += Math.ceil((originalColorValuesArray[index] / 10));

            // When all of the current color values go above the original color values, assign the
            // original color to the current color and return it, this makes sure that we arrive
            // back at the exact same shade of the original color after having darkened it and then lightened it
            if (index >= 2 && checkShadingThreshold(originalColorValuesArray, currentColorValuesArray, 'lightening'))
            {
                currentColorValuesArray = originalColorValuesArray;
                return currentColorValuesArray;
            }
        }
        else
        {
            // This formula will lighten the current color by a tenth of its original
            // shade, meaning that after ten passes, the original color will have completely
            // turned to white
            currentColorValuesArray[index] += Math.ceil(((255 - originalColorValuesArray[index]) / 10));
        }
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

    // This fixes a bug where using a shading brush on a grid cell would not have any effect on
    // its color because of the interaction of the grid cell having a 'darkened' or 'lightened'
    // class. The class would be removed on the first pass, and then it would be shaded on the
    // second pass, causing a clunky interaction. Removing them makes sure that edge case does not occur
    if (currentColor === originalColor)
    {
        event.target.classList.remove('darkened');
        event.target.classList.remove('lightened');
    }

    if (brushType.includes('darken-color'))
    {
        newColorValuesArray = darkenColor(event, originalColorValuesArray, currentColorValuesArray);
        event.target.classList.add('darkened');
    }
    else if (brushType.includes('lighten-color'))
    {
        newColorValuesArray = lightenColor(event, originalColorValuesArray, currentColorValuesArray);
        event.target.classList.add('lightened');
    }

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
        if (userInput === 0) return;
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
        const gridSize = getUserInput();

        if (gridSize === 0 || isNaN(gridSize)) return;

        // Delete current grid before creating a new one. This makes sure that
        // the new grid will replace the old one and not be appended below it instead
        deleteGrid(gridContainer);

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
