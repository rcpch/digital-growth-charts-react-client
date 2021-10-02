import React, { useState } from 'react';

import {
  Container,
  Form,
  Input,
  Button
} from 'semantic-ui-react';

const UtilitiesForm = (props) => {

    const [maternalHeight, setMaternalHeight] = useState(null);
    const [paternalHeight, setPaternalHeight] = useState(null);

    const handleSubmitUtilities = ({utilitiesFormData}) => {
        const values = {
            sex: props.globalState.sex,
            height_maternal: maternalHeight,
            height_paternal: paternalHeight
        }
        props.utilitiesFormDataSubmit(values)
    }

    

    const handleRemoveMPH = () => {
        props.updateGlobalState('mid-parental-height', 'reset');
    }

    const handleUpdateMaternalHeight = (e, { name, value }) => {
        setMaternalHeight(value);
    }
    
    const handleUpdatePaternalHeight = (e, { name, value }) => {
        setPaternalHeight(value);
    }

    return (
        <Container>
            <Form onSubmit={handleSubmitUtilities}>
                <Form.Group>
                    <Form.Field>
                        <label>
                            Maternal height (cm)
                        </label>
                        <Input
                            onChange={handleUpdateMaternalHeight}
                            placeholder="e.g. 167"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>
                        Paternal height (cm)
                        </label>
                        <Input
                            placeholder="e.g. 179"
                            onChange={handleUpdatePaternalHeight}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <Button 
                        type="submit"
                    >Calculate Mid-parental Height
                    </Button>
                </Form.Field>
                { props.globalState.midparentalHeightData.mid_parental_height &&
                    <Form.Field>
                        <Button 
                            type="submit"
                            onClick={handleRemoveMPH}
                        >Remove Mid-parental Height
                        </Button>
                    </Form.Field>
                }
            </Form>
        </Container>
    )
}

export default UtilitiesForm;