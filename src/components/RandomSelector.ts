import { RandomHelpers } from '../helpers';
import { RandomSelectorEventName } from '../enums/RandomSelectorEventName.enum';
import { SelectionListItemModel } from '../models/SelectionListItem.model';

export class RandomSelectorComponent extends HTMLElement {    
  private _selectionList: SelectionListItemModel[] = [];
  private readonly itemDisplaySelectorContainer: HTMLElement;
  private readonly randomSelectorContainer: HTMLElement;
  private readonly selectButton: HTMLButtonElement;
  

  public get selectionList(): SelectionListItemModel[] {
    return this._selectionList;
  }

  public set selectionList(list: SelectionListItemModel[]) {
    this._selectionList = list;
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    this.randomSelectorContainer = document.createElement('div');
    this.randomSelectorContainer.classList.add('random-selector');
    this.itemDisplaySelectorContainer = document.createElement('div');
    this.selectButton = document.createElement('button');
    this.selectButton.classList.add('pick-icon');
    this.selectButton.innerText = 'Random';

    this.selectButton.addEventListener(
      'click',
      this.onSelectClick.bind(this),
    );

    const baseFontSize = parseInt(
      this.getAttribute('data-base-font-size') || '',
    );

    this.randomSelectorContainer.innerHTML = `
      <style>${this.getStyles(
        isNaN(baseFontSize) ? undefined : baseFontSize,
      )}</style>
    `;

    this.randomSelectorContainer.appendChild(this.itemDisplaySelectorContainer);
    this.randomSelectorContainer.appendChild(this.selectButton);

    shadow.appendChild(this.randomSelectorContainer);

    setTimeout(() => {
      this.selectButton.classList.add('spread');
    })
  }

  private delayedSelection() {
    return new Promise<void>(res => {
      setTimeout(() => {
        this.makeSelection();
        res();
      }, 200);
    });
  }

  private getSelectionListItemHtml(item: SelectionListItemModel): string {
    return `<span>${item.description}</span>`
  }

  private getStyles(baseFontSize = 28) {
    return `
      :host {
        --body-font-size: ${baseFontSize}px;
        --font-size-l: 1.5em;
        --font-size-xl: 2.25em;
        --font-size-xxl: 3.375em;
        --font-size-xxxl: 5.063em;
        --font-size-xxxxl: 7.594em;

        --padding-small: 0.5rem;
        --padding-regular: 1rem;
        --padding-large: 2.5rem;

        --default-transition: 250ms ease-in-out;

        --primary-font-colour: #fcfcfc;

        font-size: var(--body-font-size);
        color: var(--primary-font-colour);
        line-height: 1.5;
        text-align: justify;
      }

      .random-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    `;
  }

  private makeSelection(): SelectionListItemModel {
    const item = RandomHelpers.getRandomSelection(this.selectionList);
    this.itemDisplaySelectorContainer.innerHTML = this.getSelectionListItemHtml(
      item
    );
    return item;
  }

  private onSelectClick() {
    const numberIterations = RandomHelpers.getRandomArbitraryNumber(15, 20),
      iterations: (() => Promise<void>)[] = [];

    for (let i = 0; i < numberIterations; i++) {
      iterations[i] = this.delayedSelection.bind(this);
    }
    
    iterations.reduce((prev, curr) => prev.then(curr), Promise.resolve()).then(() => {
      const payload = this.makeSelection();
      this.triggerEvent(RandomSelectorEventName.SELECTION_MADE, payload);
    }).catch((err) => console.log(err));
  }

  private triggerEvent(
    eventName: RandomSelectorEventName,
    payload?: SelectionListItemModel,
  ) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: payload,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('random-selector-component', RandomSelectorComponent);

declare global {
  interface HTMLElementTagNameMap {
    'random-selector-component': RandomSelectorComponent;
  }
}
