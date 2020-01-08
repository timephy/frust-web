/** Returns whether the given string if "on" or "off". */
const stringIsBool = (str) => str == "on" || str == "off";

/** String corrections for input fields. */
const sanitizeInput = (input) => input.trim();

/** Adds hide class to element after specified time. */
function hideDelay(element, time) {
    setTimeout(() => element.classList.add("hide"), time);
}

/** Removes the element from its parent after specified time. */
function destroyDelay(element, time) {
    setTimeout(() => element.remove(), time);
}

/**adds the class to element and then removes it after a delay  */
function addTemporaryClass(targetElem, cssClass, time) {
    if (!!resetableTimers[cssClass]) {
        clearTimeout(resetableTimers[cssClass])
    }
    targetElem.classList.add(cssClass);
    resetableTimers[cssClass] = setTimeout(() => targetElem.classList.remove(cssClass), time);
    console.log(cssClass + ": timer " + resetableTimers[cssClass])
}
