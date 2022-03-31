import React from 'react';

// Semantic UI React
import { Select } from 'semantic-ui-react';

function GestationSelect(props) {
    let gestationWeeksOptions = [];
    let gestWeeks = 23;
    while (gestWeeks <= 42) {
        gestationWeeksOptions.push({
            key: gestWeeks.toString(10),
            value: gestWeeks,
            text: gestWeeks.toString(10),
        });
        gestWeeks++;
    }

    const gestationDaysOptions = [
        { key: '0', value: 0, text: '0' },
        { key: '1', value: 1, text: '1' },
        { key: '2', value: 2, text: '2' },
        { key: '3', value: 3, text: '3' },
        { key: '4', value: 4, text: '4' },
        { key: '5', value: 5, text: '5' },
        { key: '6', value: 6, text: '6' },
    ];

    return (
        <span>
            <Select
                compact
                name="gestation_weeks"
                value={props.weeks}
                options={gestationWeeksOptions}
                onChange={(e, val) => props.handleGestationChange(val)}
            />
            &nbsp;+
            <Select
                compact
                name="gestation_days"
                value={props.days}
                options={gestationDaysOptions}
                onChange={(e, val) => props.handleGestationChange(val)}
            />
            &nbsp; weeks
        </span>
    );
}

export default GestationSelect;
