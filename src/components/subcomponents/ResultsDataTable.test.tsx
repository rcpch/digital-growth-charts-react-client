import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from 'react';
import { ResultsDataTable } from "./ResultsDataTable";
import mockDataHeights23Weeks from './__test_components__/mockData'

describe("assert display option buttons interactions for datatable render correct data", () => {
    test('for decimal age checkbox', () => {
        render(<ResultsDataTable data={mockDataHeights23Weeks} chronologicalStyles={{}} />)

        // first check stringified age shown by default
        expect(screen.getByText('8 months and 2 days')).toBeVisible()

        // toggle decimal age
        const decimalAgeCheckbox = screen.getByRole('checkbox');
        fireEvent.click(decimalAgeCheckbox)

        // check age is decimal
        expect(screen.getByText('0.674')).toBeVisible()
    });

    test('for age toggle as Corrected (default), Chronological, and Both', () => {

        render(<ResultsDataTable data={mockDataHeights23Weeks} chronologicalStyles={{}} />)

        const ageToggleChronological = screen.getByRole('button', { name: /chronological/i });
        const ageToggleBoth = screen.getByRole('button', { name: /both/i });

        // default should be corrected age
        const measurementAge = screen.queryAllByTestId('age_td_test')[0];
        const measurementCentile = screen.queryAllByTestId('centile_td_test')[0];
        const measurementSds = screen.queryAllByTestId('sds_td_test')[0];

        const allElements = [measurementAge, measurementCentile, measurementSds];

        function assertAllChildrenLenIsN(elements, n) {
            elements.forEach(element => {
                expect(element.childElementCount).toBe(n)
            });
        }

        assertAllChildrenLenIsN(allElements, 1)

        fireEvent.click(ageToggleChronological);
        assertAllChildrenLenIsN(allElements, 1);

        fireEvent.click(ageToggleBoth);
        assertAllChildrenLenIsN(allElements, 2);
    })
})


