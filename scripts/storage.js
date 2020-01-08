class Storage {
    constructor(localStorage) {
        this.localStorage = localStorage;
    }
}

function addGetSet(obj, attr, def) {
    Object.defineProperties(obj, {
        [attr]: {
            get: function () {
                if (!this["_" + attr])
                    this["_" + attr] = this.localStorage.getItem(attr) || def;
                return this["_" + attr];
            },
            set: function (value) {
                if (value === false) value = "";
                this["_" + attr] = value;
                this.localStorage.setItem(attr, value);
            }
        }
    })
}

addGetSet(Storage.prototype, "name", "");
addGetSet(Storage.prototype, "comment", "");
addGetSet(Storage.prototype, "color", "");
addGetSet(Storage.prototype, "vibration", "");
addGetSet(Storage.prototype, "underlineType", "");

let storage = new Storage(localStorage);
