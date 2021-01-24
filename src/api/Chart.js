import React, { useEffect, useState } from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';
import { RCPCHChart } from '@rcpch/digital-growth-charts-react-component-library'

//symlink with local package "@rcpch/digital-growth-charts-react-component-library": "file:../component-libraries/digital-growth-charts-react-component-library",

function ChartData(props) {

        const [isLoading, setLoading] = useState(true)
        const [centile_data, setCentile_data] = useState([])
        // const [sds_data, setSDS_data] = useState([])
        

        const measurementsArray = props.measurementsArray
        const reference = props.reference
        const titles = setTitle(props);

        useEffect( () => {
            let ignore = false; // this prevents data being added to state if unmounted
            if (measurementsArray.length > 0){
                try{
                    fetchCentileData(measurementsArray, reference).then(result => {
                        if (!ignore){ // this prevents data being added to state if unmounted
                            setCentile_data(result.data.child_data.centile_data)
                            // setSDS_data(result.data.child_data.sds_data)
                            setLoading(false)
                        }
                    });
                } catch(error) {
                    console.error('Failure!');
                    console.error(error.response.status);
                    alert("The server is not responding. Sorry.")
                    if (!ignore){
                        setLoading(false)
                    }
                }
            } else {
                if (!ignore){
                    setLoading(false)
                }
            }
            return (() => { ignore = true; }); // this prevents data being added to state if unmounted

        }, [measurementsArray, reference])
    
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
                        measurementsArray = {centile_data} // this is the plottable child data
                        chartBackground={props.chartBackground}
                        gridlineStroke={props.gridlineStroke}
                        gridlineStrokeWidth={props.gridlineStrokeWidth}
                        gridlineDashed={props.gridlineDashed}
                        gridlines={props.gridlines}
                        centileStroke={props.centileStroke}
                        centileStrokeWidth={props.centileStrokeWidth}
                        axisStroke={props.axisStroke}
                        axisLabelFont={props.axisLabelFont}
                        axisLabelColour={props.axisLabelColour}
                        measurementFill={props.measurementFill}
                        measurementSize={props.measurementSize}
                        measurementShape={props.measurementShape}
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
     else if (props.reference === "trisomy-21"){
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

async function fetchCentileData(measurementsArray, reference){
    const formData = {
        results: measurementsArray // measurements passed in from the form
    };
    
    const response = await axios({
          url: `${process.env.REACT_APP_GROWTH_API_BASEURL}/`+ reference + `/plottable-child-data`,
          data: formData,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
    
    return response
}

export default ChartData