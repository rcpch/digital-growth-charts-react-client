import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import MeasurementForm from '../components/MeasurementForm';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Home extends Component {
  state = {
    formData: {}
  }

  handleFormData = async(formData) => {
    this.setState({
      formData: formData
    });

    let payload = {
      "birth_date": formData.birth_date,
      "observation_date": formData.observation_date,
      "sex": formData.sex,
      "gestation_weeks": 0, //int(form.gestation_weeks.data),
      "gestation_days": 0, //int(form.gestation_days.data)
      "measurement_method": formData.measurement_type,
      "observation_value": formData.observation_value
    }
    
    axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    // collect user form entries and perform date and SDS/Centile calculations
    let response = await axios('http://localhost:5000/api/v1/json/calculation', {
      params: payload
    })
    this.props.history.push({pathname: '/results', data:{calculations: response.data}});
  }

  render() {
    return (
      <Container>
        <div>
          <h2>RCPCH Growth Charts</h2>
        </div>
        <Container>
          <MeasurementForm onSubmitMeasurement={this.handleFormData}/>
        </Container>
      </Container>
    );
  }
}

export default withRouter(Home);