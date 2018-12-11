let pastElement;
let currentElement;
let otherElements = {};

function addStyles() {
    let head = document.querySelector('body');
    let style = document.createElement('style');
    style.innerHTML = `
    .window__container {
        z-index: 1000;
        height: 150px;
        width: 500px;
        background-color: #1dd1a1;
        border: 5px solid #10ac84;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 50px;
        left: 50px;
        opacity: 0.8; }
      
      .window__container__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
        padding: 0 7px; }
        .window__container__header .window__title {
          font-family: Verdana, Geneva, sans-serif;
          font-size: 20px;
          color: #222f3e; }
        .window__container__header .window__close__button {
          font-size: 20px;
          color: #222f3e;
          cursor: pointer; }
      
      .form {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap; }
        .form .input {
          font-family: Verdana, Geneva, sans-serif;
          color: #222f3e;
          height: 35px;
          width: 340px;
          box-sizing: border-box;
          background-color: #10ac84;
          border-radius: 5px;
          border: none;
          padding: 3px;
          margin: 5px;
          outline: none; }
        .form .button {
          font-family: Verdana, Geneva, sans-serif;
          color: #222f3e;
          height: 35px;
          width: 100px;
          padding: 3px;
          margin: 5px;
          box-sizing: border-box;
          background-color: #10ac84;
          border-radius: 5px;
          border: none;
          outline: none;
          box-shadow: none;
          transition: 200ms;
          cursor: pointer; }
          .form .button:hover {
            box-shadow: 0 2px 0 0 #0d8567; }
          .form .button--disable {
            cursor: default;
            background-color: #0d8567; }
            .form .button--disable:hover {
              box-shadow: none; }`;

    head.appendChild(style);
}

function createWindow() {
    let body = document.querySelector('body');
    
    let fragment = document.createDocumentFragment();
    let windowContainer = document.createElement('div');
    let windowContainerHeader = document.createElement('div');
    let windowTitle = document.createElement('h2');
    let windowCloseButton = document.createElement('span');
    let form = document.createElement('form');
    let input = document.createElement('input');
    let searchButton = document.createElement('button');
    let prevButton = document.createElement('button');
    let nextButton = document.createElement('button');
    let parentButton = document.createElement('button');
    let childrenButton = document.createElement('button');

    prevButton.dataset.type = 'prev';
    nextButton.dataset.type = 'next';
    parentButton.dataset.type = 'parent';
    childrenButton.dataset.type = 'children';

    windowContainer.id = 'windowContainer';
    windowTitle.id = 'windowTitle';
    input.id = 'serachInput';
    searchButton.id = 'searchButton';
    prevButton.id = 'prev';
    nextButton.id = 'next';
    parentButton.id = 'parent';
    childrenButton.id = 'children';

    windowTitle.innerHTML = 'Search node element'
    searchButton.innerHTML = 'Search';
    prevButton.innerHTML = 'prev';
    nextButton.innerHTML = 'next';
    parentButton.innerHTML = 'parent';
    childrenButton.innerHTML = 'children';
    windowCloseButton.innerHTML = '&#10006;';

    windowContainer.className = 'window__container';
    windowContainerHeader.className = 'window__container__header';
    windowTitle.className = 'window__title';
    windowCloseButton.className = 'window__close__button';
    form.className = 'form';
    input.className = 'input';
    searchButton.className = 'button';
    prevButton.className = 'button button--disable';
    nextButton.className = 'button button--disable';
    parentButton.className = 'button button--disable';
    childrenButton.className = 'button button--disable';

    prevButton.disabled = true;
    nextButton.disabled = true;
    parentButton.disabled = true;
    childrenButton.disabled = true;

    windowContainerHeader.appendChild(windowTitle);
    windowContainerHeader.appendChild(windowCloseButton);

    form.appendChild(input);
    form.appendChild(searchButton);
    form.appendChild(prevButton);
    form.appendChild(nextButton);
    form.appendChild(parentButton);
    form.appendChild(childrenButton);

    windowContainer.appendChild(windowContainerHeader);
    windowContainer.appendChild(form);
    fragment.appendChild(windowContainer);
    body.appendChild(fragment);
    
    searchButton.addEventListener('click', searchElement);
    windowCloseButton.addEventListener('click', closeWindow);
}

function closeWindow() {
    let parent = document.querySelector('body');
    let children = document.getElementById('windowContainer');

    parent.removeChild(children);
}

function searchElement(event) {
    event.preventDefault();

    if (currentElement) {
        pastElement = currentElement;
    }
    
    let searchValue = serachInput.value;
    serachInput.value = '';
    currentElement = document.querySelector(`${searchValue}`);

    if (isElement(currentElement)) {
        decorateElement(currentElement, pastElement);
        isOtherElements(currentElement);
    } else {
        console.error('No selector');
    }
}

function isElement(element) {
    if (element) {
        return true;
    } else {
        return false;
    }
}

function decorateElement(currentElement, pastElement) {
    currentElement.style.outline = '5px solid #FF0000';
    
    if (pastElement) {
        pastElement.style.outline = 'none';
    }
}

function isOtherElements(currentElement) {
    let prevElement = currentElement.previousElementSibling;
    let nextElement = currentElement.nextElementSibling;
    let parentElement = currentElement.parentElement;
    let childrenElement = currentElement.children[0];

    otherElements = {
        prev: prevElement,
        next: nextElement,
        parent: parentElement,
        children: childrenElement
    }

    changeButtons(otherElements); 
}

function changeButtons(otherElements) {
    let keys = Object.keys(otherElements);
    
    for (let i = 0; i < keys.length; i++) {
        if (otherElements[keys[i]]) {
            enableButton(document.getElementById(`${keys[i]}`));
        } else {
            disableButton(document.getElementById(`${keys[i]}`));
        }
    }
}

function enableButton(button) {
    button.className = 'button';
    button.disabled = false;
    button.addEventListener('click', addEvents);
}

function disableButton(button) {
    button.className = 'button button--disable';
    button.disabled = true;
    button.removeEventListener('click', addEvents);
}

function addEvents(event) {
    event.preventDefault();
    
    switch(event.target.dataset.type) {
        case 'prev':
          showNewElement(otherElements, 'prev');
          break;
        case 'next':
          showNewElement(otherElements, 'next');
          break;
        case 'parent':
          showNewElement(otherElements, 'parent');
          break;
        case 'children':
          showNewElement(otherElements, 'children');
          break;
        // default:
        //   alert( 'Я таких значений не знаю' );
      }
}

function showNewElement(otherElements, key) {
    pastElement = currentElement;
    currentElement = otherElements[key];
    
    decorateElement(currentElement, pastElement);
    isOtherElements(currentElement);
}

function initDragAndDrop() {
    let windowContainer = document.getElementById('windowContainer');

    windowContainer.onmousedown = function(e) {

        let coords = getCoords(windowContainer);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;
        
        moveAt(e);

        function moveAt(e) {
            windowContainer.style.left = e.pageX - shiftX + 'px';
            windowContainer.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        windowContainer.onmouseup = function() {
            document.onmousemove = null;
            windowContainer.onmouseup = null;
        };

    }

    windowContainer.ondragstart = function() {
        return false;
    };

    function getCoords(elem) {   // кроме IE8-
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
}

window.addEventListener('load', addStyles);
window.addEventListener('load', createWindow);
window.addEventListener('load', initDragAndDrop);