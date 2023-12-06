// import deepCopy from "../deepCopy";

// const handleResults = (latestResult) => {
//     // delegate function from MeasurementForm
//     // receives form data and stores in the correct measurement array
//     // checks for duplicates, mismatching dobs, sexes and gestations
//     if (!isLoading) {
//       const existingResults = deepCopy(
//         measurements[reference][measurementMethod]
//       );
//       let errorString = "";
//       if (existingResults.length > 0) {
//         const newGestation =
//           latestResult.gestation_weeks * 7 + latestResult.gestation_days;
//         const newErrors = [];
//         for (const oldResult of existingResults) {
//           if (JSON.stringify(oldResult) === JSON.stringify(latestResult)) {
//             errorString = "duplicate";
//             break;
//           }
//           const oldGestation =
//             oldResult.gestation_weeks * 7 + oldResult.gestation_days;
//           if (oldResult.sex !== latestResult.sex) {
//             newErrors.push("differing sexes");
//           }
//           if (oldResult.birth_date !== latestResult.birth_date) {
//             newErrors.push("differing date of births");
//           }
//           if (oldGestation !== newGestation) {
//             newErrors.push("differing gestations");
//           }
//           if (newErrors.length > 0) {
//             errorString = newErrors[0];
//             if (newErrors.length === 2) {
//               errorString = newErrors.join(" and ");
//             } else if (newErrors.length === 3) {
//               errorString = `${newErrors[0]}, ${newErrors[1]} and ${newErrors[2]}`;
//             }
//             break;
//           }
//         }
//       }
//       if (errorString) {
//         if (errorString === "duplicate") {
//           setErrorModal({
//             visible: true,
//             title: "Duplicate entries",
//             body: `Please check the last measurement entry as it appears to be identical to a measurement already entered.`,
//             handleClose: () => setErrorModal(InitalErrorModalState()),
//           });
//         } else {
//           setErrorModal({
//             visible: true,
//             title: "Please check entries",
//             body: `Each chart can only display measurements from one patient at a time: ${errorString} were detected.`,
//             handleClose: () => setErrorModal(InitalErrorModalState()),
//           });
//         }
//         return false;
//       } else {
//         fetchResult(latestResult);
//         return true;
//       }
//     }
//   };

//   export default handleResults