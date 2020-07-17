import React, { Component } from "react";
import { Container, Header, Grid } from "semantic-ui-react";
import MeasurementForm from '../components/MeasurementForm';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Home extends Component {
  state = {
    formData: {}
  }

  handleFormData = async(formDataArray) => {
    this.setState({
      formData: formDataArray
    });

    let resultsPromiseArray=[];

    formDataArray.forEach(formData => {
      let payload = {
        "birth_date": formData.birth_date,
        "observation_date": formData.observation_date,
        "sex": formData.sex,
        "gestation_weeks": 0, //int(form.gestation_weeks.data),
        "gestation_days": 0, //int(form.gestation_days.data)
        "measurement_method": formData.measurement_method,
        "observation_value": formData.observation_value
      }
      const centile = this.fetchCentilesForMeasurement(payload)
      resultsPromiseArray.push(centile);
    });
    Promise.all(resultsPromiseArray).then((result)=>{
      var mergedMeasurementArrays = [].concat.apply([], result);
      this.props.history.push({pathname: '/results', data:{calculations: mergedMeasurementArrays}});
    })
    // TODO #1 needs a catch statement
    
     
  }

  async fetchCentilesForMeasurement(payload){
    const response = await axios('http://localhost:5000/api/v1/json/calculation', {
      params: payload
    });
    return response.data;
  }

  render() {
    return (
      <Container>
        <Header as='h1'>
          RCPCH Growth Charts
        </Header>
        <Grid centered>
          <Grid.Column width={12}>
            <MeasurementForm onSubmitMeasurement={this.handleFormData}/>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(Home);