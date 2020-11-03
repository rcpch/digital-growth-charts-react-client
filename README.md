# RCPCH Growth Charts - React Demo Client

This is now the main focus of development for our RCPCH Digital Growth Charts Demo Client. We previously built a [Flask-based client](https://github.com/rcpch/digital-growth-charts-flask-client) (which used Flask only because that client actually split off from the original API development). The Flask client code is still available as an educational tool, however it is considered deprecated and updating it may not be a high priority.

## Documentation

- Documentation relating to the React client will be maintained in this repository.
- API documentation is available via the links in the [live React client](growth.rcpch.ac.uk), and deeper-dive docs are in the [API server repository's](https://github.com/rcpch/digital-growth-charts-server) `/docs/` folder.
- If you spot errors or inconsistencies in any documentation, please do point them out to us either by creating an Issue in the relevant repository, or by making a pull request with a fix. We will [acknowledge](https://github.com/rcpch/digital-growth-charts-server/blob/alpha/docs/clinical-documentation/acknowledgements.md) all contributors.

## Technical Notes

Built in React 16.13.1, using the Semantic UI (React) 0.88.2 styling library.

It differs from the Flask client in that the measurement form accepts only one measurement at a time.
In the Flask client, if height and weight are both entered, a BMI is automatically calculated.
This does not happen on the React Client.

## Set Up

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. Install React [here](https://reactjs.org/docs/getting-started.html)
1. Clone the repo
1. Navigate to the root of the folder
1. `npm login --registry=https://npm.pkg.github.com` and
1. `npm install`
1. `npm start`

## Other documentation

- [Development documentation](docs/development.md)
- [Clinical documentation](docs/clinical.md)
- Official API documentation
