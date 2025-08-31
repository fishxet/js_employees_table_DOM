'use strict';

const body = document.querySelector('body');
const formElement = document.createElement('form');
const tableElement = document.querySelector('table');
const tableHeadElement = tableElement.rows[0];
const tableBodyElement = tableElement.querySelector('tbody');
const rowsArray = Array.from(tableBodyElement.rows);
const button = document.createElement('button');
const inputList = ['name', 'position', 'office', 'age', 'salary'];
const officeList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

let sorted = false;
let lastClickedElement;
let lastActiveElement;
const NOTIFICATION_DELAY = 2000;
const MIN_AGE = 18;
const MAX_AGE = 90;

const formatValue = (element) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(element);

const toName = (item) => item.slice(0, 1).toUpperCase() + item.slice(1);

const pushNotification = (posTop, posRight, title, description, type) => {
  const blockElement = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  blockElement.classList.add('notification');
  titleElement.classList.add('title');

  if (type === 'success') {
    blockElement.classList.add('success');
  } else {
    blockElement.classList.add('error');
  }

  blockElement.style.top = posTop + 'px';
  blockElement.style.right = posRight + 'px';
  blockElement.setAttribute('data-qa', 'notification');

  titleElement.innerText = title;
  descriptionElement.innerText = description.toString();

  blockElement.appendChild(titleElement);
  blockElement.appendChild(descriptionElement);
  body.appendChild(blockElement);

  window.setTimeout(() => {
    blockElement.style.display = 'none';
  }, NOTIFICATION_DELAY);
};

function sortByASC(firstCell, secondCell) {
  if (firstCell < secondCell) {
    return -1;
  }

  if (firstCell > secondCell) {
    return 1;
  }

  return 0;
}

function sortByDESC(firstCell, secondCell) {
  if (firstCell > secondCell) {
    return -1;
  }

  if (firstCell < secondCell) {
    return 1;
  }

  return 0;
}

inputList.forEach((item) => {
  const labelElement = document.createElement('label');
  const textValue = item.toString();
  let input = document.createElement('input');

  if (textValue === 'office') {
    input = document.createElement('select');

    officeList.forEach((listElement) => {
      const newOption = new Option(toName(listElement.toString()), listElement);

      input.appendChild(newOption);
    });
  } else if (textValue === 'age' || textValue === 'salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.setAttribute('data-qa', textValue);
  input.setAttribute('name', textValue);

  labelElement.textContent = toName(item) + ':';
  labelElement.append(input);
  formElement.appendChild(labelElement);
});

[...tableHeadElement.cells].map((x, index) => {
  x.addEventListener('click', (e) => {
    if (lastClickedElement === x) {
      sorted = !sorted;
    } else {
      sorted = false;
      lastClickedElement = x;
    }

    rowsArray.sort((element1, element2) => {
      let firstCell = element1.cells[index].textContent.trim();
      let secondCell = element2.cells[index].textContent.trim();

      firstCell = firstCell.includes('$')
        ? Number(firstCell.replace('$', '').replaceAll(',', ''))
        : firstCell;

      secondCell = secondCell.includes('$')
        ? Number(secondCell.replace('$', '').replaceAll(',', ''))
        : secondCell;

      return sorted
        ? sortByDESC(firstCell, secondCell)
        : sortByASC(firstCell, secondCell);
    });

    while (tableBodyElement.lastElementChild) {
      tableBodyElement.removeChild(tableBodyElement.lastElementChild);
    }

    rowsArray.forEach((item) => tableBodyElement.appendChild(item));
  });
});

button.type = 'submit';
button.textContent = 'Save to table';
formElement.appendChild(button);
formElement.classList.add('new-employee-form');

rowsArray.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    if (lastActiveElement) {
      lastActiveElement.classList.remove('active');
    }
    item.classList.add('active');
    lastActiveElement = item;
  });
});

tableBodyElement.addEventListener('dblclick', (e) => {
  const activeInput = tableBodyElement.querySelector('.cell-input');

  if (activeInput) {
    const prevCell = activeInput.parentElement;

    prevCell.textContent =
      activeInput.value === '' ? activeInput.defaultValue : activeInput.value;
  }

  const cell = e.target.closest('td');
  const inputElement = document.createElement('input');
  const initialValue = cell.textContent;

  inputElement.classList.add('cell-input');
  inputElement.value = initialValue;
  cell.textContent = '';
  cell.append(inputElement);
  inputElement.focus();

  const save = () => {
    cell.textContent =
      inputElement.value === '' ? initialValue : inputElement.value;
  };

  inputElement.addEventListener('keydown', (inputEvent) => {
    if (inputEvent.key === 'Enter') {
      save();
    }
  });

  inputElement.addEventListener('blur', save);
});

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formElement);

  if (formData.get('name').length < 4) {
    pushNotification(
      10,
      10,
      'Error: Name is too short',
      'Input Name is too short. \n Field Name must be above four letters long',
      'error',
    );

    return;
  } else if (formData.get('position') === '') {
    pushNotification(
      10,
      10,
      'Error: Position is empty',
      'Input Position must contain a string. ' +
        ' \n Field Position cannot be empty',
      'error',
    );

    return;
  } else if (formData.get('age') < MIN_AGE) {
    pushNotification(
      10,
      10,
      `Error: Age is below ${MIN_AGE}`,
      'Input Age is less than required by system. ' +
        ` \n Field Age must be above ${MIN_AGE} and less then ${MAX_AGE}`,
      'error',
    );

    return;
  } else if (formData.get('age') > MAX_AGE) {
    pushNotification(
      10,
      10,
      `Error: Age is below ${MIN_AGE}`,
      'Input Age is less than required by system. ' +
        ` \n Field Age must be above ${MIN_AGE} and less then ${MAX_AGE}`,
      'error',
    );

    return;
  }

  const tableRow = document.createElement('tr');

  for (const key of formData.keys()) {
    const tableData = document.createElement('td');

    if (key === 'salary') {
      tableData.textContent = formatValue(formData.get('salary'));
    } else {
      tableData.textContent = formData.get(key);
    }
    tableRow.appendChild(tableData);
  }
  rowsArray.push(tableRow);

  while (tableBodyElement.firstElementChild) {
    tableBodyElement.removeChild(tableBodyElement.firstElementChild);
  }

  rowsArray.forEach((item) => tableBodyElement.appendChild(item));

  pushNotification(
    10,
    10,
    'Employee added succesfully.',
    'All of info was correct, so the data was added to the table',
    'success',
  );
});

body.appendChild(formElement);
