import { CardValue, SuitName } from './../enums/Deck.enum';

import { CardModel } from '../models/CardModel';
import { RandomHelpers } from '../helpers';

export class CardDeckComponent extends HTMLElement {
  private _numberOfCards: number;  
  private readonly cardDeckContainer: HTMLElement;
  private readonly deck = this.buildDeck();
  private readonly stylesContainer: HTMLStyleElement;

  public get numberOfCards(): number {
    return this._numberOfCards;
  }

  public set numberOfCards(number: number) {
    this._numberOfCards = number;
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this._numberOfCards = 7;
    this.cardDeckContainer = document.createElement('div');
    this.cardDeckContainer.classList.add('card-deck');

    this.stylesContainer = document.createElement('style');

    shadow.appendChild(this.stylesContainer);
    shadow.appendChild(this.cardDeckContainer);
    
    this.buildHand();
  }

  private buildDeck(): CardModel[] {
    return (Object.keys(SuitName) as (keyof typeof SuitName)[]).reduce((acc: CardModel[], curr) => {
      return acc.concat((Object.keys(CardValue) as (keyof typeof CardValue)[]).map((value) => ({
        suit: SuitName[curr],
        value: CardValue[value]
      })))
    }, []);
  }

  private buildHand(): void {
    this.cardDeckContainer.replaceChildren();
    const hand = RandomHelpers.getMultipleRandomSelection(this.deck, this.numberOfCards);

    hand.forEach(card => {
      const span = document.createElement('span');
      span.dataset.suit = card.suit;
      span.dataset.value = card.value;
      span.classList.add(card.suit === SuitName.DIAMONDS || card.suit === SuitName.HEARTS ? 'red' : 'black')
      this.cardDeckContainer.appendChild(span);
    });

    this.buildStyles();

    setTimeout(() => {
      this.cardDeckContainer.classList.add('spread');
    });
  }

  private buildStyles(iconSizePx = 48) {
    const cards = new Array<string>(this.numberOfCards);
    const angle = 160 / (this.numberOfCards - 1);

    for (let index = 0; index < this.numberOfCards; index++) {
      cards[index] = '';      
    }

    this.stylesContainer.innerHTML = `
      :host {
        --card-number: 0;
        --card-angle: ${angle}deg;
        --red-card-colour: #ca3c50;
        --black-card-colour: #151518;
      }

      .card-deck {
        position: relative;
        border: none;
        background: transparent;
      }
        
      .card-deck span {
        --translateX: translateX(-50%);
        --translateY: translateY(-30px);
        --rotate: rotate(calc(var(--card-number) * var(--card-angle) - 80deg));
        
        position: absolute;
        top: 0;
        left: 50%;
        min-width: 0.9em;
        padding: 0.3em 0.25em;

        transform: var(--translateX) rotate(-90deg);
        transform-origin: 50% 105%;
        transition: transform 250ms linear;
  
        border-radius: 0.1em;
  
        background-color: white;
  
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${iconSizePx}px;
      }

      .card-deck span.red {
        color: var(--red-card-colour);
      }

      .card-deck span.black {
        color: var(--black-card-colour);
      }
      
      ${cards.map((card, index) => {
        return `.card-deck span:nth-child(${index + 1}) {
          --card-number: ${index};
        }`;
      }).join('\n\r')}
      
      .card-deck.spread span {
        transform: var(--translateX) var(--rotate);
      }
      
      .card-deck.spread span:hover {
        transform: var(--translateX) var(--rotate) var(--translateY);
      }

      .card-deck span::before {
        content: attr(data-suit);
      }

      .card-deck span::after {
        content: attr(data-value) att(data-suit);
        font-size: 0.4em;
        position: absolute;
        top: 0;
        left: 0.1em;
        font-weight: 600;
      }
    `;
  }

  private getRandomSuit(): string {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    return RandomHelpers.getRandomSelection(suits);
  }

  

  public setRandomNumberOfCards(min = 3, max = 14) {
    this.numberOfCards = RandomHelpers.getRandomArbitraryNumber(min, max);
    this.cardDeckContainer.classList.remove('spread');

    setTimeout(() => {
      this.buildHand();
    }, 500);
  }
}

customElements.define('card-deck-component', CardDeckComponent);

declare global {
  interface HTMLElementTagNameMap {
    'card-deck-component': CardDeckComponent;
  }
}
