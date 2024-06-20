import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');

// used for custom ask cards
function TaskCardForm() {
    
    // general hooks
    const [reg, setReg] = useState('');
    const [msn, setMSN] = useState('');
    const [airType, setAirType] = useState('');
    const [jobName, setJobName] = useState('');
    const [employeeAssigned, setEmployeeAssigned] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [approvedBy, setApprovedBy] = useState(global.user);
    const [approvalId, setApprovalId] = useState(0);
    const [phase, setPhase] = useState('');

    // description hooks
    const [workDesc, setWorkDesc] = useState('');
    const [toolsNeeded, setToolsNeeded] = useState('');

    // time hook
    const [estTime, setEstTime] = useState('');

    // tech hooks
    const [techCount, setTechCount] = useState('');
    const [laborCount, setLaborCount] = useState('');
    
    // material hooks
    const [materialNeeded, setMaterialNeeded] = useState('');
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [materials, setMaterials] = useState([]);

    // get id of user who approved the task
    function getApprovalID() {
        let id = 0;

        fetch(`${global.route}/approvedBy/${approvedBy}`)
            .then(response => response.json())
            .then(values => {
                id = values.id;
                setApprovalId(id);
            })
    }

    // post the new task card to database
    async function postForm(url = '', data={}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(data)
        });
        return response.text();
    }

    // add material to the database
    const addMaterial = (name, quantity, amount) => {
        let materialsCopy = materials;

        let entry = {
            name: name, 
            quantity: quantity, 
            amount: amount
        }

        materialsCopy.push(entry);
        setMaterials(materialsCopy);

        setMaterialNeeded('');
        setQuantity('');
        setAmount('');
    }

    /* Handle submit */
    const onSubmit = (event) => {
        event.preventDefault();

        /* Get the approver's ID */
        getApprovalID();

        /* Call the postForm function to handle the submission */
        postForm(`${global.route}/taskcard`, {registration: reg, msn: msn, aircraft_type: airType, jobName: jobName, employeeAssigned: employeeAssigned, jobLocation: jobLocation, desc: workDesc, toolsNeeded: toolsNeeded, phase: phase, estTime: estTime, technicians: techCount, labor: laborCount, materials: materials, approvalId: approvalId})

        alert('Submitted new task card');
    }

    /* Get date data */
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1; // month is off for some reason
    var year = new Date().getFullYear();

    return (
        
        {/* Render the task card form */}
        <KeyboardAwareScrollView style={{height: '90%', backgroundColor: 'white'}}>
            {/* Date and approval */}
            <Text style={styles.dateHeader}>Date: {month}/{date}/{year}</Text>
            <Text style={styles.approvedHeader}>Approved By: {approvedBy}</Text>

            {/* General info */}
            <Text style={styles.header}>GENERAL INFO</Text>

            <Input placeholder='Registration' 
                name="reg"
                value={reg}
                onChangeText={setReg}
                autoCorrect={false}
            />
            <Input placeholder='MSN'
                name="msn"
                value={msn}
                onChangeText={setMSN}
                autoCorrect={false}
            />
            <Input placeholder='Aircraft Type'
                name="airType"
                value={airType}
                onChangeText={setAirType}
                autoCorrect={false}
            />
            <Input placeholder='Job Name' 
                name="jobName"
                value={jobName}
                onChangeText={setJobName}
            />

            <Input placeholder='Employee(s) Assigned' 
                name="employeeAssigned"
                value={employeeAssigned}
                onChangeText={setEmployeeAssigned}
            />

            <Input placeholder='Job Location' 
                name="jobLocation"
                value={jobLocation}
                onChangeText={setJobLocation}
            />

            <Input placeholder='Description of work'
                name='workDesc'
                value={workDesc}
                onChangeText={setWorkDesc}
            />

            <Input placeholder='Tools needed' 
                name='toolsNeeded'
                value={toolsNeeded}
                onChangeText={setToolsNeeded}
            />

            <Input placeholder='Disassembly Phase' 
                name='dissPhase'
                value={phase}
                onChangeText={setPhase}
            />

            {/* Time info */}
            <Text style={styles.header}>TIME INFO</Text>
            <Input placeholder='Estimated Time for Completion' 
                name='estTime'
                value={estTime}
                onChangeText={setEstTime}
            />

            {/* Technician info */}
            <Text style={styles.header}>TECHNICIAN INFO</Text>
            <Input placeholder='Total Technicians' 
                name='techCount'
                value={techCount}
                onChangeText={setTechCount}
            />
            <Input placeholder='Total Labor' 
                name='laborCount'
                value={laborCount}
                onChangeText={setLaborCount}
            />

            {/* Material info */}
            <Text style={styles.header}>MATERIAL INFO</Text>
            <Input placeholder='Material Needed' 
                name='materialNeeded'
                value={materialNeeded}
                onChangeText={setMaterialNeeded}
            />
            <Input placeholder='Quantity' 
                name='quantity'
                value={quantity}
                onChangeText={setQuantity}
            />
            <Input placeholder='Amount' 
                name='amount'
                value={amount}
                onChangeText={setAmount}
            />

            {/* Add Material Button */}
            <Button title="Add Material" style={styles.materialButton} onPress={() => addMaterial(materialNeeded, quantity, amount)}/>

            {/* Submit new task card */}
            <Button title="Submit" onPress={onSubmit} />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: "400",
        fontSize: 25
    },
    dateHeader: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: "400",
        fontSize: 25,
        padding: 20
    },
    approvedHeader: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: "400",
        fontSize: 25,
        padding: 10
    },
    materialButton: {
        marginLeft: 50,
        marginRight: 50,
        paddingBottom: 20
    }
});

export default TaskCardForm;
