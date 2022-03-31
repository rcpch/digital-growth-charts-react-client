export const formatDate = (inputDate) => {
    let date;
    let month;
    let day;
    let year;
    try {
        inputDate.getTime();
        date = new Date(inputDate);
        month = '' + (date.getMonth() + 1);
        day = '' + date.getDate();
        year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    } catch (error) {
        throw new Error('Input date for formatDate not recognised');
    }
};

export const parseDate = (inputDate) => {
    const isDaysInMonthValid = (parsedArray) => {
        const [jsYear, jsMonth, jsDay] = parsedArray;
        if (jsMonth === 1 && jsDay === 29) {
            if (jsYear % 4 === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            const daysInMonthLookup = [
                31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
            ];
            const validMaxDaysInMonth = daysInMonthLookup[jsMonth];
            if (
                validMaxDaysInMonth !== undefined &&
                jsDay <= validMaxDaysInMonth
            ) {
                return true;
            } else {
                return false;
            }
        }
    };
    try {
        const dateArray = inputDate.split('-');
        const workingArray = dateArray.map((element, index) => {
            if (element !== '') {
                const madeNumber = Number(element);
                if (Number.isNaN(madeNumber)) {
                    throw new Error();
                } else {
                    return index === 1 ? madeNumber - 1 : madeNumber;
                }
            } else {
                throw new Error();
            }
        });
        if (
            workingArray.length !== 3 ||
            workingArray[1] < 0 ||
            workingArray[1] > 11 ||
            workingArray[2] < 1 ||
            workingArray[2] > 31
        ) {
            throw new Error();
        }
        if (isDaysInMonthValid(workingArray)) {
            return new Date(...workingArray);
        } else {
            throw new Error();
        }
    } catch (error) {
        return null;
    }
};
