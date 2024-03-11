import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Container, Header, List } from 'semantic-ui-react';
import StationCard from '../components/StationCard'; // Adjust the path as necessary

const StationList = () => {
    const [stations, setStations] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const stateOptions = [
        { key: '1', value: '1', text: 'Rajasthan' },
        { key: '2', value: '2', text: 'Tamil Nadu' },
        { key: '9', value: '9', text: 'Andhra Pradesh' },
        { key: '10', value: '10', text: 'Karnataka' },
        { key: '12', value: '12', text: 'Kerala' }
        // Add other states as needed
    ];

    const districtOptions = {
        '1': [ // Rajasthan
            { value: '251', name: 'Barmer' },
            { value: '354', name: 'Jodhpur' },
            // Add more Rajasthan districts here
        ],
        '2': [ // Tamil Nadu
            { value: '598', name: 'Chengalpattu' },
            { value: '16', name: 'Kancheepuram' },
            { value: '9', name: 'Ramanathapuram' },
            { value: '70', name: 'Vellore' },
            // Add more Tamil Nadu districts here
        ],
        '9': [ // Andhra Pradesh
            { value: '138', name: 'Anantapur' },
            { value: '62', name: 'Chittoor' },
            { value: '595', name: 'Kadapa' },
            { value: '484', name: 'Nellore' },
            // Add more Andhra Pradesh districts here
        ],
        '10': [ // Karnataka
            { value: '201', name: 'Bagalkot' },
            { value: '388', name: 'Chamarajanagar' },
            { value: '363', name: 'Chikkamagaluru' },
            { value: '89', name: 'Hassan' },
            { value: '265', name: 'Haveri' },
            { value: '593', name: 'Kalaburagi' },
            { value: '481', name: 'Kodagu' },
            { value: '217', name: 'Kolar' },
            { value: '591', name: 'Koppal' },
            { value: '544', name: 'Mandya' },
            { value: '269', name: 'Mysore' },
            { value: '437', name: 'Raichur' },
            { value: '597', name: 'Shivamogga' },
            { value: '112', name: 'Uttara Kannada' },
            { value: '594', name: 'Vijayapura' },
            // Add more Karnataka districts here
        ],
        '12': [ // Kerala
            { value: '73', name: 'Alappuzha' },
            { value: '542', name: 'Kollam' },
            { value: '590', name: 'Thiruvananthapuram' },
            // Add more Kerala districts here
        ],
        // Define other states' districts similarly
    };
    

    const fetchStations = async (state, district) => {
        try {
            const apiUrl = `http://localhost/tank-topper/backend/fetchStations.php?search_state=${state}&search_district=${district}`;
            const response = await axios.get(apiUrl);
            console.log("response",response)
            setStations(response.data);
        } catch (error) {
            console.error("There was an error fetching stations:", error);
        }
    };

    const handleStateChange = (_, { value }) => {
        setSelectedState(value);
        setSelectedDistrict('');
    };

    const handleDistrictChange = (_, { value }) => {
        setSelectedDistrict(value);
        fetchStations(selectedState, value);
    };

    useEffect(() => {
        if (selectedState && selectedDistrict) {
            fetchStations(selectedState, selectedDistrict);
        }
    }, [selectedState, selectedDistrict]);

    return (
        <Container>
            <Header as='h2'>Stations</Header>
            <Dropdown
                placeholder='Select State'
                fluid
                selection
                options={stateOptions}
                value={selectedState}
                onChange={handleStateChange}
            />
            <Dropdown
                placeholder='Select District/City'
                fluid
                selection
                options={districtOptions[selectedState]?.map(({ value, name }) => ({
                    key: value,
                    value,
                    text: name,
                })) || []}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedState}
            />
            {stations.length > 0 && (
                <List>
                    {stations.map((station, index) => (
                        <List.Item key={index}>
                            <List.Content>
                                <List.Header>{station.NAME_OF_STATION}</List.Header>
                                <List.Description>{station.ADDRESS}</List.Description>
                                <List.Description>{station.DISTRICT}</List.Description>
                                <List.Description>{`${station.LONGITUDE}, ${station.LATITUDE}`}</List.Description>
                                <List.Description>{station.STATE}</List.Description>
                                <List.Description>{`Price: ${station.CNG_PRICE_IN_KG}`}</List.Description>
                                <List.Description>{station.GA_NAME}</List.Description>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default StationList;
