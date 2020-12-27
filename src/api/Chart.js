import React, { useEffect, useState } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';
import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library'

//symlink with local package "@rcpch/digital-growth-charts-react-component-library": "file:../component-libraries/digital-growth-charts-react-component-library",

function ChartData(props) {


        // These are the colours from the orginal paper charts now deprecated
        // const girl = 'rgba(217, 49, 155, 1.0)';
        // const boy = 'rgba(0, 126, 198, 1.0)';
        

        // state = {
        //     isLoading: false, // flag awaiting async fetchCentileData - could have spinner here
        //     centile_data: [], // an array to keep all of the cacluclated measurement
        //     sds_data: []
        // }

        const [isLoading, setLoading] = useState(true)
        const [loadingError, setLoadingError] = useState(null)
        const [centile_data, setCentile_data] = useState([])
        const [sds_data, setSDS_data] = useState([])
        

        const measurementsArray = props.measurementsArray

        const titles = setTitle(props);

        
        useEffect( () => {
            let ignore = false; // this prevents data being added to state if unmounted
            if (measurementsArray.length > 0){
                fetchCentileData(measurementsArray).then(result => {
                    if (!ignore){ // this prevents data being added to state if unmounted
                        setCentile_data(result.data.child_data.centile_data)
                        setSDS_data(result.data.child_data.sds_data)
                        setLoading(false)
                    }
                }).catch(error => {
                    console.log(error.message)
                    if (!ignore){
                        setLoading(false)
                        setLoadingError(error.message)
                    }
                })
            } else {
                if (!ignore){
                    setLoading(false)
                }
            }
            return (() => { ignore = true; }); // this prevents data being added to state if unmounted

        }, [measurementsArray])
    
        return (
          <div>
            { isLoading ? (
                <Dimmer active>
                    <Loader>Fetching Chart</Loader>
                </Dimmer>
              ) : (<div>
                    <RCPCHChart
                        // key={this.state.measurement_method + "-" + this.props.reference}
                        reference={props.reference}
                        measurementMethod={props.measurementMethod}
                        sex={props.sex}
                        title={titles.title}
                        subtitle={titles.subtitle}
                        centileColour={props.centileColour}
                        width={props.width} 
                        height={props.height}
                        measurementsArray = {centile_data} // this is the plottable child data
                        measurementsSDSArray = {sds_data} // this is plottable SDS data
                        measurementDataPointColour = {props.measurementDataPointColour}
                        chartBackground = {props.chartBackground}
                    />
                    </div>
                )
            }
        </div>)
    
}

function setTitle(props){
     // set the title of the chart
     let title=''
     let subTitle=''
     if (props.reference === "uk-who"){
         title = "UK-WHO"
     }
     else if (props.reference === "turner"){
         title="Turner's Syndrome"
     }
     else if (props.reference === "trisomy21"){
         title = "Trisomy 21 (Down's Syndrome)"
     }

     let sexText = ''
     let measurementText = ''
     if (props.sex === 'male') {
         sexText = 'Boys'
     } else {
         sexText = 'Girls'
     }

     switch(props.measurementMethod){
         case("height"):
             measurementText = "Length/Height"
             break;
         case("weight"):
             measurementText = "Weight"
             break;
         case("bmi"):
             measurementText = "Body Mass Index"
             break;
         case("ofc"):
             measurementText = "Head Circumference"
             break;
         default:
             measurementText = ""
             break;
     } 

     subTitle = measurementText + ' - ' + sexText
     
     return {subtitle: subTitle, title: title}
}

async function fetchCentileData(measurementsArray){
    const formData = {
        results: measurementsArray // measurements passed in from the form
    };
    
    const response = await axios({
          url: `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/plottable-child-data`,
          data: formData,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
    return response
}

export default ChartData