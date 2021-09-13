/*
*2C = Two of blubs
*2C = Two of Diamonds
*2C = Two of Hearts
*2C = Two of Spades
*/

let deck           = [];
const cardTypes    = ['C', 'D', 'H', 'S'];
const specialCards = ['A', 'J', 'Q', 'K'];

let playerPoints  = 0,
    machinePoints = 0;

// Referenes HTML
const redBack = document.querySelector('#redBack');
const greyBack = document.querySelector('#greyBack');

const btnTakeCard = document.querySelector('#btnTakeCard');
const btnStopGame = document.querySelector('#btnStopGame');
const btnNewGame  = document.querySelector('#btnNewGame');

const msg = document.querySelector('span');

const htmlPoints      = document.querySelectorAll('small');
const playerCardsDiv  = document.querySelector('#player-cards');
const machineCardsDiv = document.querySelector('#machine-cards');

// This function create a new deck

const deckCreate = () => {
    for (let i = 2; i <= 10; i++) {
        for (let cardType of cardTypes) {
            deck.push( i + cardType);
        }
    }

    for (let cardType of cardTypes) {
        for (let specialCard of specialCards) {
            deck.push( specialCard + cardType );
        }
    }

    deck = _.shuffle( deck );
    console.log( deck );
    return deck;
}

deckCreate();

// This function allows me to take a card

const takeCard = () => {
    if ( deck.length === 0 ) {
        throw 'No hay cartas en el deck';
    }

    const card = deck.pop();
 
    return card;
}

// takeCard();

const cardValue = ( card ) => {
    const value = card.substring(0, card.length - 1);
    return ( isNaN( value ) ) ? 
           (( value === 'A') ? 11 : 10) 
           : value * 1;

    // let points = 0;
    // if ( isNaN( value ) ) {
    //     points = ( value === 'A') ? 11 : 10;
    // } else {
    //     points = value * 1; //Pasa string a numero
    // }

    //otr forma// points = ( isNaN( value ) ) ? (( value === 'A') ? 11 : 10) : value * 1;

    // console.log( points );
}

// marchine turn

const machineTurn = ( playerPoints ) => {
    greyBack.src = '';
    
    do {
        const card = takeCard();
    
        machinePoints = machinePoints + cardValue( card );
        htmlPoints[1].innerText = machinePoints;

        const imgCard = document.createElement('img');
        imgCard.src = `assets/cartas/${ card }.png`;
        imgCard.classList.add('my-card');
        machineCardsDiv.append( imgCard );

        if ( playerPoints > 21 ) {
            break;
        }

    } while ( (machinePoints < playerPoints) && (playerPoints <= 21) );

    if ( machinePoints === playerPoints ) {
        msg.innerText = ' ¡Empate!';
    } else if ( playerPoints > 21 ) {
        msg.innerText = ' ¡Perdiste!';
    } else if ( machinePoints > 21 ) {
        msg.innerText = ' ¡Ganaste!';
    } else {
        msg.innerText = ' ¡La máquina gana!';
    }

}

//Events

btnTakeCard.addEventListener('click', () => {
    const card = takeCard();
    
    playerPoints = playerPoints + cardValue( card );
    htmlPoints[0].innerText = playerPoints;

    redBack.src = '';
    redBack.src = '';

    const imgCard = document.createElement('img');
    imgCard.src = `assets/cartas/${ card }.png`;
    imgCard.classList.add('my-card');
    playerCardsDiv.append( imgCard );

    if ( playerPoints > 21 ) {
        console.warn('Perdiste');
        btnTakeCard.disabled = true;
        btnStopGame.disabled = true;
        machineTurn( playerPoints );

    } else if ( playerPoints === 21 ) {
        console.warn('21, genial');
        btnTakeCard.disabled = true;
        btnStopGame.disabled = true;
        machineTurn( playerPoints );
    }  
});

btnStopGame.addEventListener('click', () => {
    btnTakeCard.disabled = true;
    btnStopGame.disabled = true;

    machineTurn( playerPoints );
});

btnNewGame.addEventListener('click', () => {
    
    console.clear();
    
    deck = [];
    deck = deckCreate();
   
    playerPoints  = 0,
    machinePoints = 0;
    
    htmlPoints[0].innerText = 0; 
    htmlPoints[1].innerText = 0; 

    msg.innerText = 'Bienvenido';

    playerCardsDiv.innerHTML  = '';
    machineCardsDiv.innerHTML = '';

    redBack.src = 'assets/cartas/red_back.png';
    redBack.classList.add('my-card');
    playerCardsDiv.append( redBack );
    greyBack.src = 'assets/cartas/grey_back.png';
    greyBack.classList.add('my-card');
    machineCardsDiv.append( greyBack );

    btnTakeCard.disabled = false;
    btnStopGame.disabled = false;
});