import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TableCellObservationValue from "./TableCellObservationValue";

describe("assert measurement values and units correct", () => {
  test("for height", () => {
    const measurement = {
      child_observation_value: {
        measurement_method: "height",
        observation_value: 75.7,
        observation_value_error: null,
      },
    };

    render(
      <table>
        <tbody>
          <tr>
            <TableCellObservationValue measurement={measurement} />
          </tr>
        </tbody>
      </table>
    );

    const measurementValue = screen.getByText("75.7 cm");

    expect(measurementValue).toBeVisible();
  });
  test("for weight", () => {
    const measurement = {
      child_observation_value: {
        measurement_method: "weight",
        observation_value: 9.6,
        observation_value_error: null,
      },
    };

    render(
      <table>
        <tbody>
          <tr>
            <TableCellObservationValue measurement={measurement} />
          </tr>
        </tbody>
      </table>
    );

    const measurementValue = screen.getByText("9.6 kg");

    expect(measurementValue).toBeVisible();
  });
  test("for bmi", () => {
    const measurement = {
      child_observation_value: {
        measurement_method: "bmi",
        observation_value: 16.8,
        observation_value_error: null,
      },
    };

    render(
      <table>
        <tbody>
          <tr>
            <TableCellObservationValue measurement={measurement} />
          </tr>
        </tbody>
      </table>
    );

    const measurementValue = screen.getByText("16.8 kg/m²");

    expect(measurementValue).toBeVisible();
  });
  test("for ofc", () => {
    const measurement = {
      child_observation_value: {
        measurement_method: "ofc",
        observation_value: 46.1,
        observation_value_error: null,
      },
    };

    render(
      <table>
        <tbody>
          <tr>
            <TableCellObservationValue measurement={measurement} />
          </tr>
        </tbody>
      </table>
    );

    const measurementValue = screen.getByText("46.1 cm");

    expect(measurementValue).toBeVisible();
  });
});
