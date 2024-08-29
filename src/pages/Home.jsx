import  React, { useEffect, useRef } from "react";
import MeasurementSegment from "../components/MeasurementSegment";

const Home = () => {
  const measurementSegmentRef = useRef(null);
  useEffect(() => {
    console.log(measurementSegmentRef.current);
  }),[];
  return (
    <div ref={measurementSegmentRef}>
      <MeasurementSegment />
    </div>
  );
};

export default Home;
