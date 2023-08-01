import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResultsSegment } from "./ResultsSegment";
import { mockDataAllMeasurements23Weeks } from './__test_components__/mockData';

describe('results table measurement menu panes render correct data', () => {
    describe('when all 4 measurement data provided', () => {
        // 75.7 cm
        // 9.6 kg
        // 16.8 kg/m²
        // 46.1 cm
        test('when Heights clicked (default)', () => {
            render(<ResultsSegment apiResult={mockDataAllMeasurements23Weeks} reference={'uk-who'} />)

            const valueText = screen.queryAllByTestId('value_td_test')[0].textContent

            expect(valueText).toBe('75.7 cm');
        });
        test('when Weights clicked', () => {
            render(<ResultsSegment apiResult={mockDataAllMeasurements23Weeks} reference={'uk-who'} />)

            fireEvent.click(screen.getByText("Weights"))

            const valueText = screen.queryAllByTestId('value_td_test')[0].textContent
            
            expect(valueText).toBe('9.6 kg');
        });
        test('when BMIs clicked', () => {
            render(<ResultsSegment apiResult={mockDataAllMeasurements23Weeks} reference={'uk-who'} />)

            fireEvent.click(screen.getByText("BMIs"))

            const valueText = screen.queryAllByTestId('value_td_test')[0].textContent
            
            expect(valueText).toBe('16.8 kg/m²');
        });
        test('when Head Circumferences clicked', () => {
            render(<ResultsSegment apiResult={mockDataAllMeasurements23Weeks} reference={'uk-who'} />)

            fireEvent.click(screen.getByText("Head Circumferences"))

            const valueText = screen.queryAllByTestId('value_td_test')[0].textContent
            
            expect(valueText).toBe('46.1 cm');
        });
    })
})