import React, { Component } from "react";
import { Container, Header, Button, Icon, Segment } from "semantic-ui-react";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import Dropzone from 'react-dropzone';


class Spreadsheet extends Component{

    constructor(props){
        super(props);
        this.state = {
            uploadDisabled: true,
            acceptedFiles: null
        }
        this.uploadData = this.uploadData.bind(this);
    }

    uploadData(){
        console.log(this.state.acceptedFiles);
    }
    

    render(){
        return (
            <Container>
                <h1>Download Excel Spreadsheet</h1>
                <Dropzone onDrop={acceptedFiles => {
                        acceptedFiles.forEach(file => {
                            this.setState({acceptedFiles: file})
                        });
                        this.setState({uploadDisabled: false});
                    }
                }>
                        {({getRootProps, getInputProps}) => (
                            <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Segment placeholder>
                                    <Header icon>
                                        <Icon name='excel file outline' color='green'/>
                                    </Header>
                                    <h5>
                                        Drag 'n' drop .xls or .xlsx here, or click to select files
                                    </h5>
                                </Segment>
                            </div>
                            </section>
                        )}
                    </Dropzone>
                    <Container>
                        <Button color='green' disabled={this.state.uploadDisabled} onClick={this.uploadData}>Import Data</Button>
                    </Container>
                
            </Container>
        );
    }
}

export default withRouter(Spreadsheet);