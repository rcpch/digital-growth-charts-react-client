import {render, screen} from '@testing-library/react'
import TableCellObservationDate from './TableCellObservationDate'

test('should show observation date',()=> {
    render(<TableCellObservationDate measurement={{measurement_dates:{observation_date:"1760-04-10"}}}/>);

    const observationDate = screen.getByText("1760-04-10")
})