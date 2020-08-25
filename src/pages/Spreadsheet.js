import React, { Component } from "react";
import { Container, Header, Button, Icon, Segment, Grid, Label } from "semantic-ui-react";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import Dropzone from 'react-dropzone';
// import XLSX from 'xlsx'; DEPRECATED - SEND THE FILE DIRECT TO THE SERVER - DATA PARSED SERVER-SIDE


class Spreadsheet extends Component{

    constructor(props){
        super(props);
        this.state = {
            uploadDisabled: true,
            excelFile: null
        }
        this.uploadData = this.uploadData.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }

    async uploadData(){
        let fileData = new FormData()
        fileData.append("excel_file", this.state.excelFile)
        await axios({
            url:`${process.env.REACT_APP_GROWTH_API_BASEURL}/api/v1/json/spreadsheet`, 
            data: fileData,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            /*
            The response object from the server is:
                {
                    data: [an array of Measurement class objects]
                    unique: boolean - refers to whether data is from one child or many children
                    valid: boolean - refers to whether imported data was valid for calculation
                    error: string  - error message if invalid file
                }
            */
            if(response.data['valid']) {
                this.props.history.push({pathname: '/serial_results', data:response.data});
            } else {
                // TODO #7 implement popup in the event of failed validation of uploaded data as well as catch statement
                console.log(response.data['error']);
            }
        })
    }

    removeFile(event){
        event.preventDefault();
        console.log('remove');
        this.setState({excelFile: null});
        this.setState({uploadDisabled: true});
    }

    // excelToJson(reader){
    //     var fileData = reader.result;
    //     var wb = XLSX.read(fileData, {type : 'binary'});
    //     var data = {};
    //     wb.SheetNames.forEach(function(sheetName){
    //          var rowObj =XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
    //         //  var rowString = JSON.stringify(rowObj);
    //          data[sheetName] = rowObj   //rowString;
    //     });
    //     this.setState({excelData: data});
    // }
    

    render(){
        return (
            <Container>
                <Grid centered>
                    <Grid.Column width={12}>
                        <Grid.Row style={{textAlign:"center"  }}>
                            <h1>Download Excel Spreadsheet</h1>
                        </Grid.Row>
                        <Grid.Row centered>
                            <Dropzone 
                                onDrop={acceptedFiles => {
                                        this.setState({uploadDisabled: false});
                                        // var reader = new FileReader();
                                        // reader.readAsBinaryString(acceptedFiles[0]);
                                        // reader.onload = this.excelToJson.bind(this,reader);
                                        this.setState({excelFile: acceptedFiles[0]})
                                    }
                                }
                                accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                minSize={0}
                                maxSize={5242880}
                            >
                                    {({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles}) => (
                                        <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Segment placeholder color='green'>
                                                <Header icon>
                                                    {this.state.excelFile === null ? <Icon name='excel file outline' color='green'/> : <Icon name='excel file' color='green'/>}
                                                </Header>
                                                <h5 style={{textAlign:"center"  }}>
                                                    {!isDragActive && this.state.excelFile === null && "Drag 'n' drop .xls or .xlsx here, or click to select files"}
                                                    {isDragActive && this.state.excelFile === null && !isDragReject  && "Drop .xls or .xlsx here "}
                                                    {isDragReject && this.state.excelFile === null && "Only .xls and .xlsx files accepted" }
                                                    {this.state.excelFile !== null && <Label><Icon name="file excel" color='green'></Icon>{acceptedFiles[0].name}</Label>}
                                                </h5>
                                                
                                            </Segment>
                                        </div>
                                        </section>
                                    )}
                            </Dropzone>
                        </Grid.Row>
                        <Grid.Row style={{textAlign:"center", padding: 10 }}>
                            { !this.state.uploadDisabled &&
                                <Button.Group>
                                    <Button color='green' onClick={this.uploadData}>Import Data</Button>
                                    <Button.Or></Button.Or>
                                    <Button color="red" onClick={this.removeFile}>Remove</Button>
                                </Button.Group>
                            }
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export default withRouter(Spreadsheet);