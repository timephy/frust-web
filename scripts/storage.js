class Storage {
    constructor(localStorage) {
        this.localStorage = localStorage;
    }
}

function addGetSet(obj, attr) {
    Object.defineProperties(obj, {
        [attr]: {
            get: function () {
                if (!this["_" + attr])
                    this["_" + attr] = this.localStorage.getItem(attr);
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
addGetSet(Storage.prototype, "vibration");

let storage = new Storage(localStorage);
