const fictionalAPICall = (ageType, conditionType) => {
  // This function simulates an API call to fetch fictional data based on age and condition
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        age: ageType,
        condition: conditionType,
        data: `Fictional data for ${ageType} with ${conditionType} condition`,
      });
    }, 1000);
  });
};
