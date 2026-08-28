import MeasurementSegment from "../components/MeasurementSegment";
import packageJson from "../../package.json";

const Home = () => {
  return (
    <main>
      <h1>RCPCH Digital Growth Charts demo</h1>
      <MeasurementSegment />
      <footer>
        <small>
          <i>
            RCPCH Digital Growth Charts - Client: v{packageJson.version},
            Charts: v
            {
              packageJson.dependencies[
                "@rcpch/digital-growth-charts-react-component-library"
              ]
            }
            .
          </i>
        </small>
      </footer>
    </main>
  );
};

export default Home;
