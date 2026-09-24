import MeasurementSegment from "../components/MeasurementSegment";
import packageJson from "../../package.json";

const Home = () => {
  // In local dev the component is aliased to a local checkout that can be a
  // different version from the pinned npm dependency below; vite.config.js
  // injects the checkout's real version so this reflects what actually runs.
  const componentLibraryVersion =
    import.meta.env.VITE_APP_COMPONENT_LIBRARY_VERSION ||
    packageJson.dependencies[
      "@rcpch/digital-growth-charts-react-component-library"
    ];
  const clientCommit = import.meta.env.VITE_APP_CLIENT_COMMIT_SHA || "unknown";
  const shortClientCommit = clientCommit.slice(0, 7);

  return (
    <main>
      <h1>RCPCH Digital Growth Charts demo</h1>
      <MeasurementSegment />
      <footer>
        <small>
          <i>
            RCPCH Digital Growth Charts - Client: v{packageJson.version},
            Charts: v{componentLibraryVersion}, Build:{" "}
            <span
              data-testid="client-build"
              title={`Client commit ${clientCommit}`}
            >
              {shortClientCommit}
            </span>
            .
          </i>
        </small>
      </footer>
    </main>
  );
};

export default Home;
