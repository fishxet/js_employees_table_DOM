'use strict';

const body = document.querySelector('body');
const formElement = document.createElement('form');
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

const toName = (item) => item.slice(0, 1).toUpperCase() + item.slice(1);

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

formElement.classList.add('new-employee-form');
body.appendChild(formElement);
