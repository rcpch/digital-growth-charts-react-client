// import RCPCHChartComponent from '/Users/SimonChapman/Development/react/component-libraries/digital-growth-charts-react-chart-component/dist/index'
// import 'digital-growth-charts-react-chart-component/dist/index.css'
import React, { Component } from 'react'
import axios from 'axios';

class ChartData extends Component {

    constructor(props){
        super(props);

        const girl = 'rgba(217, 49, 155, 1.0)';
        const boy = 'rgba(0, 126, 198, 1.0)';

        this.state = {
            childData: props.childData,
            sex: props.childData[0].birth_data.sex,
            sexColor: (props.childData[0].birth_data.sex === 'male' ? boy : girl),
            heights: [],
            height_SDS: [],
            weights: [],
            weight_SDS: [],
            bmis: [],
            bmi_SDS: [],
            ofcs: [],
            ofc_SDS: [],
            isLoading: true
        }
        this.fetchCentileData.bind(this);
    }

    async fetchCentileData(childData) {
        
        let formData = {
          results: childData,
          unique_child: "true",
        };
    
        const response = await axios({
        //   url: `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/plottable-child-data`,
          url: `http://localhost:5000/uk-who/plottable-child-data`,
          data: formData,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data;
    }

    componentDidMount(){
        const results = this.fetchCentileData(this.state.childData);
        results.then(result => {
            if (result.childData.heights.length > 0){
                this.setState(
                    {
                        heights: result.childData.heights,
                        height_SDS: result.childData.height_SDS
                    }
                )
            }
            if (result.childData.weights.length > 0){
                this.setState(
                    {
                        weights: result.childData.heights,
                        weight_SDS: result.childData.height_SDS
                    }
                )
            }
            if (result.childData.ofcs.length > 0){
                this.setState(
                    {
                        weights: result.childData.ofcs,
                        weight_SDS: result.childData.ofc_SDS
                    }
                )
            }
            if (result.childData.bmis.length > 0){
                this.setState(
                    {
                        bmis: result.childData.bmis,
                        bmi_SDS: result.childData.bmi_SDS
                    }
                )
            }
            this.setState({isLoading: false})
        })
    }

    render(){
        return <h1>results go here</h1>
    //     if (this.state.heights.length > 0){
    //         return (
    //             <RCPCHChartComponent 
    //                     measurementMethod='height' 
    //                     sex={this.state.sex} 
    //                     centilesColour='#0d0c0a' 
    //                     width={700} 
    //                     height={600}
    //                     measurementsArray = {this.state.heights}
    //                     measurementsSDSArray = {this.state.height_SDS}
    //                     measurementDataPointColour = 'red'
    //                 />
    //         )
    //     }
    //     if (this.state.weights.length > 0){
    //         return (
    //             <RCPCHChartComponent 
    //                     measurementMethod='weight' 
    //                     sex={this.state.sex}
    //                     centilesColour='#0d0c0a' 
    //                     width={700} 
    //                     height={600}
    //                     measurementsArray = {this.state.weights}
    //                     measurementsSDSArray = {this.state.weight_SDS}
    //                     measurementDataPointColour = 'red'
    //                 />
    //         )
    //     }
    //     if (this.state.ofcs.length > 0){
    //         return (
    //             <RCPCHChartComponent 
    //                     measurementMethod='ofc' 
    //                     sex={this.state.sex} 
    //                     centilesColour='#0d0c0a' 
    //                     width={700} 
    //                     height={600}
    //                     measurementsArray = {this.state.ofcs}
    //                     measurementsSDSArray = {this.state.ofc_SDS}
    //                     measurementDataPointColour = 'red'
    //                 />
    //         )
    //     }
    //     if (this.state.bmis.length > 0){
    //         return (
    //             <RCPCHChartComponent 
    //                     measurementMethod='bmi' 
    //                     sex={this.state.sex} 
    //                     centilesColour='#0d0c0a' 
    //                     width={700} 
    //                     height={600}
    //                     measurementsArray = {this.state.bmis}
    //                     measurementsSDSArray = {this.state.bmi_SDS}
    //                     measurementDataPointColour = 'red'
    //                 />
    //         )
    //     }
        
    }
        
}


export default ChartData

// [
//     {
//       "birth_data": {
//         "birth_date": "Fri, 03 Feb 2017 00:00:00 GMT",
//         "estimated_date_delivery": null,
//         "estimated_date_delivery_string": null,
//         "gestation_days": 0,
//         "gestation_weeks": 40,
//         "sex": "male"
//       },
//       "child_observation_value": {
//         "measurement_method": "height",
//         "measurement_value": 125
//       },
//       "measurement_calculated_values": {
//         "centile": 100,
//         "centile_band": "This height measurement is above the normal range.",
//         "measurement_method": "height",
//         "sds": 5.804194100332083
//       },
//       "measurement_dates": {
//         "chronological_calendar_age": "3 years, 8 months, 2 weeks and 6 days",
//         "chronological_decimal_age": 3.7180013689253935,
//         "clinician_decimal_age_comment": "Born Term. No correction necessary.",
//         "corrected_calendar_age": null,
//         "corrected_decimal_age": 3.7180013689253935,
//         "corrected_gestational_age": {
//           "corrected_gestation_days": null,
//           "corrected_gestation_weeks": null
//         },
//         "lay_decimal_age_comment": "At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",
//         "observation_date": "Fri, 23 Oct 2020 00:00:00 GMT"
//       }
//     },
//     {
//       "birth_data": {
//         "birth_date": "Fri, 03 Feb 2017 00:00:00 GMT",
//         "estimated_date_delivery": null,
//         "estimated_date_delivery_string": null,
//         "gestation_days": 0,
//         "gestation_weeks": 40,
//         "sex": "male"
//       },
//       "child_observation_value": {
//         "measurement_method": "weight",
//         "measurement_value": 14
//       },
//       "measurement_calculated_values": {
//         "centile": 16,
//         "centile_band": "This weight measurement is between the 9th and 25th centiles.",
//         "measurement_method": "weight",
//         "sds": -0.9612466040715206
//       },
//       "measurement_dates": {
//         "chronological_calendar_age": "3 years, 8 months, 2 weeks and 6 days",
//         "chronological_decimal_age": 3.7180013689253935,
//         "clinician_decimal_age_comment": "Born Term. No correction necessary.",
//         "corrected_calendar_age": null,
//         "corrected_decimal_age": 3.7180013689253935,
//         "corrected_gestational_age": {
//           "corrected_gestation_days": null,
//           "corrected_gestation_weeks": null
//         },
//         "lay_decimal_age_comment": "At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",
//         "observation_date": "Fri, 23 Oct 2020 00:00:00 GMT"
//       }
//     },
//     {
//       "birth_data": {
//         "birth_date": "Fri, 03 Feb 2017 00:00:00 GMT",
//         "estimated_date_delivery": null,
//         "estimated_date_delivery_string": null,
//         "gestation_days": 0,
//         "gestation_weeks": 40,
//         "sex": "male"
//       },
//       "child_observation_value": {
//         "measurement_method": "bmi",
//         "measurement_value": 11.2
//       },
//       "measurement_calculated_values": {
//         "centile": 0,
//         "centile_band": "This body mass index measurement is on or near the 0.4th centile.",
//         "measurement_method": "bmi",
//         "sds": -4.108443657963778
//       },
//       "measurement_dates": {
//         "chronological_calendar_age": "3 years, 8 months, 2 weeks and 6 days",
//         "chronological_decimal_age": 3.7180013689253935,
//         "clinician_decimal_age_comment": "Born Term. No correction necessary.",
//         "corrected_calendar_age": null,
//         "corrected_decimal_age": 3.7180013689253935,
//         "corrected_gestational_age": {
//           "corrected_gestation_days": null,
//           "corrected_gestation_weeks": null
//         },
//         "lay_decimal_age_comment": "At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",
//         "observation_date": "Fri, 23 Oct 2020 00:00:00 GMT"
//       }
//     },
//     {
//       "birth_data": {
//         "birth_date": "Fri, 03 Feb 2017 00:00:00 GMT",
//         "estimated_date_delivery": null,
//         "estimated_date_delivery_string": null,
//         "gestation_days": 0,
//         "gestation_weeks": 40,
//         "sex": "male"
//       },
//       "child_observation_value": {
//         "measurement_method": "ofc",
//         "measurement_value": 54
//       },
//       "measurement_calculated_values": {
//         "centile": 99.7,
//         "centile_band": "This head circumference measurement is on or near the 99.6th centile.",
//         "measurement_method": "ofc",
//         "sds": 2.735252500663617
//       },
//       "measurement_dates": {
//         "chronological_calendar_age": "3 years, 8 months, 2 weeks and 6 days",
//         "chronological_decimal_age": 3.7180013689253935,
//         "clinician_decimal_age_comment": "Born Term. No correction necessary.",
//         "corrected_calendar_age": null,
//         "corrected_decimal_age": 3.7180013689253935,
//         "corrected_gestational_age": {
//           "corrected_gestation_days": null,
//           "corrected_gestation_weeks": null
//         },
//         "lay_decimal_age_comment": "At 40+0, your child is considered to have been born at term. No age adjustment is necessary.",
//         "observation_date": "Fri, 23 Oct 2020 00:00:00 GMT"
//       }
//     }
//   ]