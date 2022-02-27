import React from 'react';

import {
  Form,
  Input,
  Header,
  Button,
  Container
} from 'semantic-ui-react';

const UtilitiesForm = (props) => {

    return (
        <Container>
            <Header 
                as="h5" 
                textAlign="left"
                style={{
                    paddingTop: 20
                }}
            >
                Midparental Height
            </Header>
            <Form onSubmit={props.utilitiesFormDataSubmit}>
                <Form.Group>
                    <Form.Field
                        width={8}
                        required
                    >
                        <label
                            style={{textAlign: 'left'}}
                        >
                            Maternal height
                        </label>
                        <Input
                            name="height_maternal"
                            onChange={props.changeMaternalHeight}
                            placeholder="e.g. 167"
                            value={props.maternalHeight ? props.maternalHeight : ''}
                            label={"cm"}
                            labelPosition="right"
                        />
                    </Form.Field>
                    <Form.Field
                        width={8}
                        required
                    >
                        <label
                            style={{textAlign: 'left'}}
                        >
                        Paternal height
                        </label>
                        <Input
                            name="height_maternal"
                            placeholder="e.g. 179"
                            onChange={props.changePaternalHeight}
                            value={props.paternalHeight ? props.paternalHeight : ''}
                            label={"cm"}
                            labelPosition="right"
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <Button 
                        disabled={props.maternalHeight && props.paternalHeight ? false : true}
                        color={'pink'}
                        fluid={true}
                        type={"submit"}
                    >Calculate Mid-parental Height
                    </Button>
                </Form.Field>
                { props.midParentalHeightDataPresent &&
                    <Form.Field>
                        <Button 
                            type="submit"
                            onClick={props.removeMidParentalHeight}
                        >Remove Mid-parental Height
                        </Button>
                    </Form.Field>
                }
            </Form>
        </Container>
    )
}

export default UtilitiesForm;