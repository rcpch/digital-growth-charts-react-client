// deep copy variables
// note: this is only copies enumerable properties

const deepCopyArray = (oldArray) => {
    const copyArray = [];
    oldArray.forEach((element) => {
        if (Array.isArray(element)) {
            copyArray.push(deepCopyArray(element));
        } else {
            if (typeof element === 'object' && element !== null) {
                copyArray.push(deepCopyObject(element));
            } else {
                copyArray.push(element);
            }
        }
    });
    return copyArray;
};

const deepCopyObject = (oldObject) => {
    const tempObject = {};
    for (const key in oldObject) {
        const value = oldObject[key];
        if (Array.isArray(value)) {
            tempObject[key] = deepCopyArray(value);
        } else {
            if (typeof value === 'object' && value !== null) {
                tempObject[key] = deepCopyObject(value);
            } else {
                tempObject[key] = value;
            }
        }
    }
    return tempObject;
};

const deepCopy = (input) => {
    if (Array.isArray(input)) {
        return deepCopyArray(input);
    } else if (typeof input === 'object' && input !== null) {
        return deepCopyObject(input);
    } else {
        return input;
    }
};

export default deepCopy;
