const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.cards');
  let cardData = collectCardData();
  cardsContainer.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const activeElement = document.activeElement;
      const formElements = [
        ...cardsContainer.querySelectorAll('input, select'),
      ];
      const currentIndex = formElements.indexOf(activeElement);

      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  });
  const addCardButton = document.querySelector('.add-card-button');
  const templateCard = document.querySelector('.card-template');
  const printCards = document.querySelector('.print-report-button');

  addCardButton.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    if (cards.length >= 3) {
      alert('لا يمكن إضافة اكثر من 3 اشخاص');
      return;
    }

    const newCard = templateCard.cloneNode(true);
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.classList.add('close-button', 'btn', 'btn-danger');
    closeButton.style.width = '50px';
    closeButton.style.position = 'absolute'; // Position the button
    closeButton.style.left = '0'; // Align the button to the left
    closeButton.style.top = '0';

    newCard.classList.remove('card-template');
    newCard.appendChild(closeButton);

    document.querySelector('.cards').appendChild(newCard);
    const inputFields = newCard.querySelectorAll('input');
    const selectFields = newCard.querySelectorAll('select');

    inputFields.forEach((input) => {
      input.value = '';
    });
    selectFields.forEach((select) => {
      select.selectedIndex = 0;
    });

    closeButton.addEventListener('click', () => {
      newCard.remove();
    });
  });

  printCards.addEventListener('click', () => {
    try {
      cardData = collectCardData();
      ipcRenderer.send('print-report', cardData);
    } catch (error) {
      console.error('Error collecting card data:', error);
    }
  });

  function collectCardData() {
    try {
      const cards = document.querySelectorAll('.card');
      const cardData = [];

      cards.forEach((card) => {
        const inputs = card.querySelectorAll('input, select');
        const data = {};

        inputs.forEach((input) => {
          if (input.type === 'file') {
            if (input.files.length > 0) {
              // Get the file path and store it in the data object
              data[input.name] = input.files[0].path;
            }
          } else {
            data[input.name] = input.value;
          }
        });

        cardData.push(data);
      });

      console.log('Collected data:', cardData);
      return cardData;
    } catch (error) {
      console.error('Error collecting card data:', error);
      return [];
    }
  }
});
