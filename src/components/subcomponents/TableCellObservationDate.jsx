import { Table } from "semantic-ui-react";
import PropTypes from "prop-types";

export default function TableCellObservationDate({ measurement }) {
  const observationDate = new Date(
    measurement.measurement_dates.observation_date
  ).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return <Table.Cell>{observationDate}</Table.Cell>;
}

TableCellObservationDate.propTypes = {
  measurement: PropTypes.shape({
    measurement_dates: PropTypes.shape({
      observation_date: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
