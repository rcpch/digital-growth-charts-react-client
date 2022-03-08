export const units = (measurementMethod) => {
    if (measurementMethod === 'height') {
        return 'cm';
    }
    if (measurementMethod === 'weight') {
        return 'kg';
    }
    if (measurementMethod === 'bmi') {
        return 'kg/m²';
    }
    if (measurementMethod === 'ofc') {
        return 'cm';
    }
};
