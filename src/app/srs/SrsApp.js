var EventEmitter = require('events');

class SrsApp extends EventEmitter {

    constructor() {
        super();

        this._selectedControl = 'deck-list';
    }

    set selectedControl(newSelectedControl) {
        this._selectedControl = newSelectedControl;
        this._emitChange();
    }

    get selectedControl() {
        return this._selectedControl;
    }

    _emitChange() {
        this.emit('change', {
            selectedControl: this.selectedControl
        });
    }
}

module.exports = SrsApp;