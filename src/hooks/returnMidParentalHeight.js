import axios from 'axios';

const fetchFromApi = async (inputParameters) => {
    const url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/utilities/mid-parental-height`;

    const headers = process.env.REACT_APP_API_KEY
        ? {
              'Content-Type': 'application/json',
              'Subscription-Key': process.env.REACT_APP_API_KEY,
          }
        : { 'Content-Type': 'application/json' };
    const response = await axios({
        url: url,
        data: inputParameters,
        method: 'POST',
        headers,
    });
    return response.data;
};

const returnMidParentalHeight = (formData) => {
    return fetchFromApi(formData).then((result) => {
        return result;
    });
};

export default returnMidParentalHeight;
