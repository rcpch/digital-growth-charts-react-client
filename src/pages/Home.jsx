import MeasurementSegment from "../components/MeasurementSegment";
import packageJson from "../../package.json";

const Home = () => {

  return (
    <div>
      <MeasurementSegment />
      <small><i>RCPCH digital Growth Charts - Client : v{packageJson.version}, Charts: v{packageJson.dependencies["@rcpch/digital-growth-charts-react-component-library"]}.</i></small>
    </div>
  );
};

export default Home;
