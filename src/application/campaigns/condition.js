import './condition.css';

var conditionIcon = '<i class="fas fa-map-signs"></i>'

/**
 * ConditionBlock for the Editor.js
 * Creates a condition and paragraphs can be saved in it.
 * Requires no server-side uploader.
 *
 * @typedef {object} ConditionBlockData
 * @description Tool's input and output data format
 * @property {string} text - condition text
 * @property {array} items - condition paragraphs
 */

export default class ConditionBlock {
  /**
   * Icon and title for displaying at the Toolbox
   * @returns {{tittle: string, icon: string}}
   */
  static get toolbox() {
    return {
      title: 'Condition',
      icon: conditionIcon,
    };
  }

  /**
   * Disables the creation of new EditorJS blocks by pressing
   * 'enter' when in a condition block.
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Notify core that the read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Render tool`s main Element and fill it with saved data
   *
   * @param {{data: object, api: object}}
   * data - Previously saved data
   * api - Editor.js API
   * readOnly - read-only mode status
   */
  constructor({ data, api, readOnly }) {
    this.data = {
      text: data.text || '',
      fk: data.fk || `fk-${crypto.randomUUID()}`,
      items: data.items || 0,
    };
    this.itemsId = [];
    this.api = api;
    this.wrapper = undefined;
    this.readOnly = readOnly || false;
    this.addListeners();
    this.addSupportForUndoAndRedoActions();
    this.addSupportForDragAndDropActions();
  }

  /**
   * First it gets the condition index.
   *
   * After checks the condition status, if this is 'closed' then open it.
   *
   * After inserts a new block after the condition index and the a method
   * is called to add the required properties to the new block.
   * gets the focus.
   *
   * @param {KeyboardEvent} e - key up event
   */
  createParagraphFromConditionRoot(e) {
    if (e.code === 'Enter') {
      const currentPosition = document.getSelection().focusOffset;
      const originalIndex = this.api.blocks.getCurrentBlockIndex();
      const block = this.api.blocks.getBlockByIndex(originalIndex);
      const { holder } = block;
      const blockCover = holder.firstChild;
      const blockContent = blockCover.firstChild;
      const content = blockContent.children[1].innerHTML;

      const breakLine = content.indexOf('<br>');
      const end = breakLine === -1 ? content.length : breakLine;


      const newText = content.slice(end + 4, currentPosition.focusOffset);
      blockContent.children[1].innerHTML = content.slice(currentPosition.focusOffset, end);

      this.api.blocks.insert('paragraph', { text: newText }, {}, originalIndex + 1, 1);
      this.setAttributesToNewBlock();
    }
  }

  /**
   * Calls the method to add the required properties to the new block.
   */
  createParagraphFromIt() {
    this.setAttributesToNewBlock();
  }

  /**
   * Gets the index of the new block, then assigns the required properties,
   * and finally sends the focus.
   */
  setAttributesToNewBlock(entryIndex = null, foreignKey = this.wrapper.id) {
    const index = entryIndex === null ? this.api.blocks.getCurrentBlockIndex() : entryIndex;
    const id = crypto.randomUUID();

    const newBlock = this.api.blocks.getBlockByIndex(index);

    if (!this.itemsId.includes(newBlock.id)) {
      this.itemsId.splice(index - 1, 0, newBlock.id);
    }

    const { holder } = newBlock;
    const content = holder.firstChild;
    const item = content.firstChild;

    holder.setAttribute('foreignKey', foreignKey);
    holder.setAttribute('id', id);

    holder.classList.add('condition-block__item');

    if (!this.readOnly) {
      holder.onkeydown = this.setEventsToNestedBlock.bind(this);
      item.focus();
    }
  }

  /**
   * Sets the events to be listened through the holder
   * in a nested block.
   *
   * @param {KeyboardEvent} e - key down event
   */
  setEventsToNestedBlock(e) {
    if (e.code === 'Enter') {
      this.createParagraphFromIt();
    } else {
      const indexBlock = this.api.blocks.getCurrentBlockIndex();
      const nestedBlock = this.api.blocks.getBlockByIndex(indexBlock);
      const { holder } = nestedBlock;

      if (e.code === 'Tab' && e.shiftKey) {
        this.extractBlock(indexBlock);
      }
      if (e.code === 'Backspace') {
        const cursorPosition = document.getSelection().focusOffset;
        this.removeBlock(holder, nestedBlock.id, cursorPosition);
      }
    }
  }

  /**
   * When a nested block is removed, the 'items' attribute
   * is updated, subtracting from it an unit.
   * @param {string} id - block identifier
   */
  removeBlock(holder, id, cursorPosition) {
    if (cursorPosition === 0) {
      const currentBlock = holder.nextSibling;
      const blockCover = currentBlock.firstChild;
      const blockContent = blockCover.firstChild;
      const oldContent = blockContent.innerHTML;

      const conditionCover = holder.firstChild;
      const conditionContent = conditionCover.firstChild;

      conditionContent.children[1].innerHTML += oldContent;

      const position = this.itemsId.indexOf(id);
      this.itemsId.splice(position, 1);

      const conditionPosition = this.api.blocks.getCurrentBlockIndex();
      this.api.blocks.delete(conditionPosition + 1);
    }
  }

  /**
   * Removes all properties of a nested block.
   *
   * @param {number} destiny - block position
   */
  removeAttributesFromNewBlock(destiny) {
    const newBlock = this.api.blocks.getBlockByIndex(destiny);
    const { holder } = newBlock;

    if (!this.itemsId.includes(newBlock.id)) {
      const i = this.itemsId.indexOf(newBlock.id);
      this.itemsId.splice(i, 1);
    }

    holder.removeAttribute('foreignKey');
    holder.removeAttribute('id');
    holder.onkeydown = {};
    holder.onkeyup = {};
    holder.classList.remove('condition-block__item');
  }

  /**
   * Creates a condition block view without paragraphs
   * and sets the default content.
   */
  createCondition() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('condition-block__selector');
    this.wrapper.id = this.data.fk;

    const icon = document.createElement('span');
    const input = document.createElement('div');
    const defaultContent = document.createElement('div');

    icon.classList.add('condition-block__icon');
    icon.innerHTML = conditionIcon;

    input.classList.add('condition-block__input');
    input.setAttribute('contentEditable', !this.readOnly);
    input.innerHTML = this.data.text || '';

    // Events
    if (!this.readOnly) {
      // Events to create other blocks and destroy the condition
      input.addEventListener('keyup', this.createParagraphFromConditionRoot.bind(this));
      input.addEventListener('keydown', this.removeCondition.bind(this));

      // Sets the focus at the end of the text when a nested block is deleted with the backspace key
      input.addEventListener('focusin', () => this.setFocusConditionRootAtTheEnd());

      // Establishes the placeholder for the condition root when it's empty
      input.addEventListener('keyup', this.setPlaceHolder.bind(this));
      input.setAttribute('placeholder', 'Condition');

      // Calculates the number of condition items
      input.addEventListener('focus', this.setDefaultContent.bind(this));
      input.addEventListener('focusout', this.setDefaultContent.bind(this));

      // Event to add a block when the default content is clicked
      defaultContent.addEventListener('click', this.clickInDefaultContent.bind(this));

      input.addEventListener('focus', this.setNestedBlockAttributes.bind(this));
    }

    defaultContent.classList.add('condition-block__content-default');
    defaultContent.innerHTML = 'Fill content if condition resolved positive';

    this.wrapper.appendChild(icon);
    this.wrapper.appendChild(input);
    this.wrapper.appendChild(defaultContent);
  }

  /**
   * Sets the focus at the end of the condition root when
   * a nested block is deleted through the backspace key.
   */
  setFocusConditionRootAtTheEnd() {
    const condition = document.activeElement;
    const selection = window.getSelection();
    const range = document.createRange();

    selection.removeAllRanges();
    range.selectNodeContents(condition);
    range.collapse(false);
    selection.addRange(range);
    condition.focus();
  }

  /**
   * Adds the actions to do when the default content is clicked.
   */
  clickInDefaultContent() {
    this.api.blocks.insert();
    this.setAttributesToNewBlock();
    this.setDefaultContent();
  }

  /**
   * Sets the default content. If the condition has no other blocks inside it,
   * so sets the 'block__hidden tag' in the default content,
   * otherwise it removes it.
   */
  setDefaultContent() {
    const children = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);
    const { firstChild, lastChild } = this.wrapper;
    const value = (children.length > 0);

   
    firstChild.style.color = (children.length === 0) ? 'gray' : 'black';
  }

  /**
   * Deletes the condition structure and converts the main text and the nested blocks
   * in regular blocks.
   *
   * @param {KeyboardEvent} e - key down event
   */
  removeCondition(e) {
    if (e.code === 'Backspace') {
      const { children } = this.wrapper;
      const content = children[1].innerHTML;

      const cursorPosition = document.getSelection();

      if (cursorPosition.focusOffset === 0) {
        const index = this.api.blocks.getCurrentBlockIndex();
        const breakLine = content.indexOf('<br>');
        const end = breakLine === -1 ? content.length : breakLine;
        const blocks = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);

        for (let i = 1; i < blocks.length + 1; i += 1) {
          this.removeAttributesFromNewBlock(index + i);
        }

        this.api.blocks.delete(index);
        this.api.blocks.insert('paragraph', { text: content.slice(0, end) }, {}, index, 1);
        this.api.caret.setToBlock(index);
      }
    }
  }

  /**
   * Extracts a nested block from a condition
   * with 'shift + tab' combination
   *
   * @param {HTMLDivElement} entryIndex - block index
   */
  extractBlock(entryIndex) {
    const condition = this.wrapper.children[1];

    let currentBlock = {};
    let index;

    while (currentBlock[1] !== condition) {
      this.api.caret.setToPreviousBlock('end', 0);
      index = this.api.blocks.getCurrentBlockIndex();

      const block = this.api.blocks.getBlockByIndex(index);
      const { holder } = block;
      const blockCover = holder.firstChild;
      const blockContent = blockCover.firstChild;
      currentBlock = blockContent.children;
    }

    const items = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);
    const destiny = index + items.length;

    this.api.caret.setToBlock(entryIndex);

    if (items.length > 1) {
      this.api.blocks.move(destiny);
    }

    setTimeout(() => this.removeAttributesFromNewBlock(destiny), 200);
    this.api.toolbar.close();
  }

  /**
   * If the condition root is empty and the key event received is 'backspace'
   * or 'enter', its content is cleared so that the visible placeholder
   * is set through the css.
   *
   * @param {KeyboardEvent} e - key up event
   */
  setPlaceHolder(e) {
    if (e.code === 'Backspace' || e.code === 'Enter') {
      const { children } = this.wrapper;
      const { length } = children[1].textContent;

      if (length === 0) children[1].textContent = '';
    }
  }

  /**
   * Renders Tool's view.
   * First renders the condition root, and immediately
   * renders its items as new blocks under the root.
   *
   * @returns {HTMLDivElement}
   */
  render() {
    this.createCondition();

    // Renders the nested blocks after the condition root is rendered
    setTimeout(() => this.renderItems());

    // Adds initial transition for the icon

    return this.wrapper;
  }

  /**
   * Adds the initial status for the icon, and establishes
   * the delay for the transition displayed when the icon
   * is clicked.
   */
  

  /**
   * Renders the items view and assigns the properties required to look
   * like a block inside the condition.
   */
  renderItems() {
    const blocksInEditor = this.api.blocks.getBlocksCount();
    const icon = this.wrapper.firstChild;
    let conditionRoot;

    if (this.readOnly) {
      const redactor = document.getElementsByClassName('codex-editor__redactor')[0];
      const { children } = redactor;
      const { length } = children;

      for (let i = 0; i < length; i += 1) {
        const blockCover = children[i].firstChild;
        const blockContainer = blockCover.firstChild;
        const { id } = blockContainer;

        if (id === this.wrapper.id) {
          conditionRoot = i;
          break;
        }
      }
    } else {
      const condition = this.wrapper.children[1];
      let currentBlock = {};

      while (currentBlock[1] !== condition) {
        conditionRoot = this.api.blocks.getCurrentBlockIndex();
        const block = this.api.blocks.getBlockByIndex(conditionRoot);
        const { holder } = block;
        const blockCover = holder.firstChild;
        const blockContent = blockCover.firstChild;
        currentBlock = blockContent.children;

        this.api.caret.setToNextBlock('end', 0);
      }
    }

    if (conditionRoot + this.data.items < blocksInEditor) {
      for (let i = conditionRoot + 1, j = 0; i <= conditionRoot + this.data.items; i += 1) {
        const block = this.api.blocks.getBlockByIndex(i);
        const { holder } = block;
        const cover = holder.firstChild;
        const content = cover.firstChild;

        if (!this.isPartOfACondition(content)) {
          this.setAttributesToNewBlock(i);
          j += 1;
        } else {
          this.data.items = j;
          break;
        }
      }
    } else {
      this.data.items = 0;
    }

   

  }

  

  /**
   * Hides and shows the condition paragraphs or the default content.
   * If the condition status is closed, the added value to the hidden attribute
   * in the container paragraph is 'true', otherwise is 'false'.
   *
   * @param {number} index - condition index
   */
 

  /**
   * Extracts Tool's data from the view
   * @param {HTMLDivElement} blockContent - Condition tools rendered view
   * @returns {ConditionBlockData} - saved data
   */
  save(blockContent) {
    const { children } = blockContent;
    const caption = children[1].innerHTML;
    const blocks = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);

    return Object.assign(this.data, {
      text: caption,
      items: blocks.length,
    });
  }

  /**
   * Adds an event in a existent button to destroy the nested blocks
   * when the condition root is removed.
   */
  renderSettings() {
    const settingsBar = document.getElementsByClassName('ce-settings--opened');
    const optionsContainer = settingsBar[0];
    const options = optionsContainer.lastChild;
    const conditionIndex = this.api.blocks.getCurrentBlockIndex();
    const listChildren = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);

    for (let i = 0; i < listChildren.length; i += 1) {
      listChildren[i].classList.add('ce-block--selected');
    }

    setTimeout(() => {
      const deleteButton = options.getElementsByClassName('ce-settings__button--delete')[0];
      deleteButton.addEventListener('click', () => {
        const classesList = deleteButton.classList;
        const classes = Object.values(classesList);

        if (classes.indexOf('clicked-to-destroy-condition') === -1) {
          deleteButton.classList.add('clicked-to-destroy-condition');
        } else {
          this.removeFullCondition(conditionIndex);
        }
      });
    });
  }

  /**
   * Removes a condition root and its nested blocks.
   *
   * @param {number} conditionIndex - condition index
   */
  removeFullCondition(conditionIndex) {
    const children = document.querySelectorAll(`div[foreignKey="${this.wrapper.id}"]`);
    const { length } = children;

    for (let i = conditionIndex; i < conditionIndex + length; i += 1) {
      this.api.blocks.delete(conditionIndex);
    }
  }

  /**
   * Adds the required listeners to call the condition shortcuts
   * on the editor.
   */
  addListeners() {
    if (!this.readOnly) {
      const redactor = document.activeElement;
      redactor.addEventListener('keyup', (e) => {
        const blockContainer = document.activeElement;
        const currentBlock = this.api.blocks.getCurrentBlockIndex();

        const blockCover = blockContainer.parentElement;
        const block = blockCover.parentElement;

        if (e.code === 'Space') {
          this.createConditionWithShortcut(blockContainer);
        } else if (currentBlock > 0 && !(this.isPartOfACondition(blockContainer) || this.isPartOfACondition(block)) && e.code === 'Tab') {
          this.nestBlock(blockContainer);
        }
      });
    }
  }

  /**
   * Adds mutation observer to restore the item attributes
   * when the undo action is executed and they're lost.
   */
  addSupportForUndoAndRedoActions() {
    if (!this.readOnly) {
      const target = document.querySelector('div.codex-editor__redactor');

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            setTimeout(this.restoreItemAttributes.bind(this, mutation));
          }
        });
      });

      const config = { attributes: true, childList: true, characterData: true };

      observer.observe(target, config);
    }
  }

  getIndex = (target) => Array.from(target.parentNode.children).indexOf(target);

  /**
   * Adds drop listener to move the childs item
   * when the drag and drop action is executed.
   */
  addSupportForDragAndDropActions() {
    if (!this.readOnly) {
      if (this.wrapper === undefined) {
        setTimeout(() => this.addSupportForDragAndDropActions(), 250);
        return;
      }

      // Set status in attribute to a proper hide and show
      const conditionBlock = document.querySelector(`#${this.wrapper.id}`).parentNode.parentNode;

      const settingsButton = document.querySelector('.ce-toolbar__settings-btn');
      settingsButton.setAttribute('draggable', 'true');
      settingsButton.addEventListener('dragstart', () => {
        this.startBlock = this.api.blocks.getCurrentBlockIndex();
        this.nameDragged = this.api.blocks.getBlockByIndex(this.startBlock).name;
        this.holderDragged = this.api.blocks.getBlockByIndex(this.startBlock).holder;
      });

      document.addEventListener('drop', (event) => {
        // Get the position when item was dropped
        const { target } = event;
        if (document.contains(target)) {
          const dropTarget = target.classList.contains('ce-block') ? target : target.closest('.ce-block');
          if (dropTarget && dropTarget !== this.holderDragged) {
            let endBlock = this.getIndex(dropTarget);

            // Control the condition's children will be positioned down of the parent
            endBlock = this.startBlock < endBlock ? endBlock + 1 : endBlock;

            // Check if the item dropped is another condition
            const isTargetACondition = dropTarget.querySelectorAll('.condition-block__selector').length > 0
              || dropTarget.getAttribute('foreignKey') !== null;

            // If is a condition we have to add the attributes to make it a part of the condition
            if (isTargetACondition) {
              const foreignKey = dropTarget.getAttribute('foreignKey') !== null
                ? dropTarget.getAttribute('foreignKey')
                : dropTarget.querySelector('.condition-block__selector').getAttribute('id');

              const newConditionIndex = this.getIndex(this.holderDragged);
              this.setAttributesToNewBlock(newConditionIndex, foreignKey);
            }

            setTimeout(() => {
              // Verify if the item droped is the condition
              if (this.nameDragged === 'condition') {
                // Verify if the condition dropped is the same of this eventListener
                const isCurrentConditionDropped = this.holderDragged.querySelector(`#${this.wrapper.id}`) !== null;
                if (isCurrentConditionDropped) {
                  this.moveChildren(endBlock);
                }
              }

              // If we are dropping out of a condition we have to remove the attributes
              if (!isTargetACondition) {
                const newConditionIndex = this.getIndex(this.holderDragged);
                this.removeAttributesFromNewBlock(newConditionIndex);
              }
            });
          }
        }
      });
    }
  }

  moveChildren(endBlock, fk = this.wrapper.id) {
    // Get the children of the dropped condition
    let children = document.querySelectorAll(`div[foreignKey="${fk}"]`);

    // Move all the children to the parent position
    children = this.startBlock >= endBlock ? [...children].reverse() : children;
    children.forEach((child) => {
      const childIndex = this.getIndex(child);
      this.api.blocks.move(endBlock, childIndex);

      // If this child is a condition we have to move his children too
      const conditions = child.querySelectorAll('.condition-block__selector');
      const isCondition = conditions.length > 0;
      if (isCondition) {
        const conditionIndex = this.getIndex(child);
        const fix = this.startBlock < endBlock ? 0 : 1;
        conditions.forEach((condition) => this.moveChildren(conditionIndex + fix, condition.getAttribute('id')));

        const dif = Math.abs(endBlock - conditionIndex);
        endBlock = this.startBlock < endBlock ? endBlock + dif : endBlock - dif;
      }
    });
  }

  /**
   * Restores the item attributes to nested blocks.
   *
   * @param {HTMLDivElement} mutation - Html element removed or inserted
   */
  restoreItemAttributes(mutation) {
    if (this.wrapper !== undefined) {
      const index = this.api.blocks.getCurrentBlockIndex();
      const block = this.api.blocks.getBlockByIndex(index);
      const { holder } = block;
      const currentBlockValidation = !this.isPartOfACondition(holder);
      const mutatedBlock = mutation.removedNodes[0];

      if (this.itemsId.includes(block.id) && currentBlockValidation) {
        this.setAttributesToNewBlock(index);
      } else if (mutatedBlock && this.isPartOfACondition(mutatedBlock) && currentBlockValidation) {
        const blockCover = holder.firstChild;
        const blockContainer = blockCover.firstChild;

        if (!this.isPartOfACondition(blockContainer)) {
          this.setAttributesToNewBlock(index);
          this.itemsId[index] = block.id;
        }
      }
    }
  }

  /**
   * Creates a condition through the '>' char and the 'Space' key
   */
  createConditionWithShortcut(blockContainer) {
    const content = blockContainer.textContent;

    if ((content[0] === '>') && !this.isPartOfACondition(blockContainer)) {
      const blockCaller = this.api.blocks.getCurrentBlockIndex();

      this.api.blocks.insert('condition', { text: content.slice(2) }, this.api, blockCaller, true);
      this.api.blocks.delete(blockCaller + 1);
      this.api.caret.setToBlock(blockCaller);
    }
  }

  /**
   * Nests a block inside a condition through the 'Tab' key
   */
  nestBlock(blockContainer) {
    const blockCover = blockContainer.parentElement;
    const block = blockCover.parentElement;

    const previousBlock = block.previousElementSibling;
    const previousCover = previousBlock.firstChild;
    const previousContainer = previousCover.firstChild;

    if (this.isPartOfACondition(previousContainer) || this.isPartOfACondition(previousBlock)) {
      const foreignId = previousBlock.getAttribute('foreignKey');
      const conditionId = previousContainer.getAttribute('id');
      const foreignKey = foreignId || conditionId;

      block.setAttribute('will-be-a-nested-block', true);

      const conditionRoot = document.getElementById(foreignKey);
      conditionRoot.children[1].focus();
    }
  }

  /**
  * Sets the required attributes to convert an external block
  * of the condition into a block inside the condition.
   */
  setNestedBlockAttributes() {
    const blockIndex = this.api.blocks.getCurrentBlockIndex();
    const block = this.api.blocks.getBlockByIndex(blockIndex);
    const { holder } = block;
    const willBeABlock = holder.getAttribute('will-be-a-nested-block');

    if (willBeABlock) {
      holder.removeAttribute('will-be-a-nested-block');
      this.setAttributesToNewBlock(blockIndex);
      this.api.toolbar.close();
    }
  }

  /**
   * Validates if a block contains one of the classes to be
   * part of a condition. If It has it returns 'true' (It's part
   * of a condition), otherwise returns 'false' (It's another
   * type of block)
   *
   * @param {HTMLDivElement} block - Block to be validated
   * @returns {boolean}
   */
  isPartOfACondition(block) {
    const classes = Array.from(block.classList);
    const answer = classes.includes('condition-block__item') || (classes.includes('condition-block__input') || classes.includes('condition-block__selector'));

    return answer;
  }
}