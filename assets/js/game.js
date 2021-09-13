const myModule = (() => {
    'use strict'

    let deck           = [];
    const cardTypes    = ['C', 'D', 'H', 'S'],
          specialCards = ['A', 'J', 'Q', 'K'];

    let playersPoints = [];

    // Referenes HTML
    const redBack = document.querySelector('#redBack'),
          greyBack = document.querySelector('#greyBack');

    const btnTakeCard = document.querySelector('#btnTakeCard'),
          btnStopGame = document.querySelector('#btnStopGame'),
          btnNewGame  = document.querySelector('#btnNewGame');
          
    const msg = document.querySelector('span');
 
    const divCardsPlayers = document.querySelectorAll('.divCards'),
          playerCardsDiv  = document.querySelector('#playerCards'),
          machineCardsDiv = document.querySelector('#machineCards'),
          htmlPoints      = document.querySelectorAll('small');

    // This function start the game
    const startGame = ( playerNums = 2 ) => {
        deck = deckCreate();
        playersPoints = [];
        for (let i = 0; i < playerNums; i++) {
            playersPoints.push(0);
        }

        msg.innerText = 'Bienvenido';

        htmlPoints.forEach( elem => elem.innerText = 0 );

        divCardsPlayers.forEach( elem => elem.innerHTML = '');

        redBack.src = 'assets/cartas/red_back.png';
        redBack.classList.add('my-card');
        playerCardsDiv.append( redBack );
        greyBack.src = 'assets/cartas/grey_back.png';
        greyBack.classList.add('my-card');
        machineCardsDiv.append( greyBack );

        btnTakeCard.disabled = false;
        btnStopGame.disabled = false;

    }

    // This function create a new deck
    const deckCreate = () => {

        deck = [];

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
        
        return _.shuffle( deck );
    }

    // This function allows me to take a card
    const takeCard = () => {
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck';
        } 
        return deck.pop();
    }

    const cardValue = ( card ) => {
        const value = card.substring(0, card.length - 1);
        return ( isNaN( value ) ) ? 
            (( value === 'A') ? 11 : 10) 
            : value * 1;
    }
    // Turn: 0 = first player and the last element will be the machine
    const accumulatePoints = ( card, turn ) => {
        playersPoints[turn] = playersPoints[turn] + cardValue( card );
        htmlPoints[turn].innerText = playersPoints[turn];
        return playersPoints[turn];
    }

    const createCard = ( card, turn ) => {
        const imgCard = document.createElement('img');
        imgCard.src = `assets/cartas/${ card }.png`;
        imgCard.classList.add('my-card');
        divCardsPlayers[turn].append( imgCard );
    }

    const determineWinner = () => {

        const [ playerPoints, machinePoints ] = playersPoints;

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

    // marchine turn
    const machineTurn = ( playerPoints ) => {
        greyBack.src = '';
        
        let machinePoints = 0;

        do {
            const card = takeCard();
            machinePoints = accumulatePoints(card, playersPoints.length - 1 );
            createCard( card, playersPoints.length - 1 );

        } while ( (machinePoints < playerPoints) && (playerPoints <= 21) );

        determineWinner();

    }

    //Events
    btnTakeCard.addEventListener('click', () => {
        const card = takeCard();
        const playerPoints = accumulatePoints(card, 0 );

        redBack.src = '';
        redBack.src = '';

        createCard( card, 0 );

        if ( playerPoints > 21 ) {
            btnTakeCard.disabled = true;
            btnStopGame.disabled = true;
            machineTurn( playerPoints );

        } else if ( playerPoints === 21 ) {
            btnTakeCard.disabled = true;
            btnStopGame.disabled = true;
            machineTurn( playerPoints );
        }  
    });

    btnStopGame.addEventListener('click', () => {
        btnTakeCard.disabled = true;
        btnStopGame.disabled = true;

        machineTurn( playersPoints[0] );
    });

    btnNewGame.addEventListener('click', () => {
        
        startGame();

    });

    return {
        newGame: startGame
    };

})();
