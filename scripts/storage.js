class Storage {
    constructor(localStorage) {
        this.localStorage = localStorage;
    }
    get color() {
        if (!this._color) {
            this._color = this.localStorage.getItem("color");
        }
        return this._color;
    }
    set color(value) {
        this._color = value;
        this.localStorage.setItem("color", value);
    }
}

function addGetSet(obj, attr) {
    Object.defineProperties(obj, {
        [attr]: {
            get: function () {
                if (!this["_" + attr]) {
                    this["_" + attr] = this.localStorage.getItem(attr);
                }
                return this["_" + attr];
            },
            set: function (value) {
                if (typeof value !== "string")
                    console.error(`Storage.${attr} = ${value} is not of type string.`)
                this["_" + attr] = value;
                this.localStorage.setItem(attr, value);
            }
        }
    })
}

addGetSet(Storage.prototype, "name");
addGetSet(Storage.prototype, "comment");
addGetSet(Storage.prototype, "color");
addGetSet(Storage.prototype, "underlineType");
addGetSet(Storage.prototype, "vibration");

let storage = new Storage(localStorage);
