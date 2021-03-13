import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import axios from "axios";
import { RCPCHChart } from "@rcpch/digital-growth-charts-react-component-library";

function ChartData(props) {
  const [isLoading, setLoading] = useState(true);
  const [centile_data, setCentile_data] = useState([]);
  // const [sds_data, setSDS_data] = useState([])

  const measurementsArray = props.measurementsArray;
  const reference = props.reference;
  const titles = setTitle(props);

  useEffect(() => {
    let ignore = false; // this prevents data being added to state if unmounted
    if (measurementsArray.length > 0) {
      try {
        setLoading(false)
        measurementsArray.forEach(measurement => {
          fetchCentilesForMeasurement(measurement, reference).then((result) => {
            if (!ignore) {
              // this prevents data being added to state if unmounted
              setCentile_data(result);
              setLoading(false);
            }
          });
        });
      } catch (error) {
        console.error("Failure!");
        console.error(error.response.status);
        alert("The server is not responding. Sorry.");
        if (!ignore) {
          setLoading(false);
        }
      }
    } else {
      if (!ignore) {
        setLoading(false);
      }
    }
    return () => {
      ignore = true;
    }; // this prevents data being added to state if unmounted
  }, [measurementsArray, reference]);

  return (
    <div>
      {isLoading ? (
        <Dimmer active>
          <Loader>Fetching Chart</Loader>
        </Dimmer>
      ) : (
        <div>
          <RCPCHChart
            // key={this.state.measurement_method + "-" + this.props.reference}
            reference={props.reference}
            measurementMethod={props.measurementMethod}
            sex={props.sex}
            title={titles.title}
            subtitle={titles.subtitle}
            measurementsArray={centile_data} // this is the plottable child data
            chartStyle={props.chartStyle}
            axisStyle={props.axisStyle}
            gridlineStyle={props.gridlineStyle}
            centileStyle={props.centileStyle}
            measurementStyle={props.measurementStyle}
          />
        </div>
      )}
    </div>
  );
}

function setTitle(props) {
  // set the title of the chart
  let title = "";
  let subTitle = "";
  if (props.reference === "uk-who") {
    title = "UK-WHO";
  } else if (props.reference === "turner") {
    title = "Turner's Syndrome";
  } else if (props.reference === "trisomy-21") {
    title = "Trisomy 21 (Down's Syndrome)";
  }

  let sexText = "";
  let measurementText = "";
  if (props.sex === "male") {
    sexText = "Boys";
  } else {
    sexText = "Girls";
  }

  switch (props.measurementMethod) {
    case "height":
      measurementText = "Length/Height";
      break;
    case "weight":
      measurementText = "Weight";
      break;
    case "bmi":
      measurementText = "Body Mass Index";
      break;
    case "ofc":
      measurementText = "Head Circumference";
      break;
    default:
      measurementText = "";
      break;
  }

  subTitle = measurementText + " - " + sexText;

  return { subtitle: subTitle, title: title };
}

const fetchCentilesForMeasurement = async  (payload, reference) =>{
    
    let url
    if (reference === "uk-who"){
      url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/uk-who/calculation`
    }
    if (reference === "turner"){
      url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/turner/calculation`
    }
    if (reference === "trisomy-21"){
      url = `${process.env.REACT_APP_GROWTH_API_BASEURL}/trisomy-21/calculation`
    }

    const response = await axios({
      url: url,
      data: payload,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }

export default ChartData;
