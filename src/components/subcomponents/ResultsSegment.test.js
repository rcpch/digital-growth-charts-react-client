import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResultsSegment } from "./ResultsSegment";
import { mockDataAllMeasurements23Weeks } from './__test_components__/mockData';

describe('results table measurement menu panes render correct data', () => {
    describe('when all 4 measurement data provided', () => {
        test('when Heights clicked (default)', () => {
            // 75.7 cm
            // 9.6 kg
            // 16.8 kg/m²
            // 46.1 cm
            render(<ResultsSegment apiResult={mockDataAllMeasurements23Weeks} reference={'uk-who'} />)

            console.log(screen.queryAllByTestId('value_td_test')[0].textContent)

        })
    })
})