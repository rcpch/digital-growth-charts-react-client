// React
import * as ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Semantic UI React
import "semantic-ui-less/semantic.less";

// CSS
import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
