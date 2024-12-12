import React, { useState, useEffect, useContext } from 'react';
import AddItems from '../Components/ChefItems/AddItems';
import ItemsTable from '../Components/ChefItems/ItemsTable';
import { getItemlistApi } from '../../Services/allApis';
import { getItemResponseContext } from '../../Contextapi/ContextApi';

function ChefItems() {
    const { setGetResponse } = useContext(getItemResponseContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
     
        
    }, []);

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Token ${sessionStorage.getItem('token')}`,
        };

        try {
            const res = await getItemlistApi(headers);
            if (res.status === 200) {
                console.log(res.data);
                
                setGetResponse(res.data);
            } else {
                console.error('Error fetching data:', res);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid" style={{ height: '120vh', backgroundColor: '#DFF2EB' }}>
            <h1 className="text-center py-4" style={{ color: '#041e47' }}>My Items</h1>
            <div className="d-flex justify-content-center my-4">
                <AddItems />
            </div>
            {loading ? (
                <div className="text-center">
                    <span>Loading...</span>
                </div>
            ) : (
                <ItemsTable />
            )}
        </div>
    );
}

export default ChefItems;
