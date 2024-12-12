import React, { useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import EditItems from './EditItems';
import { getItemResponseContext } from '../../../Contextapi/ContextApi';
import base_url from '../../../Services/base_url';
import { deleteItemApi } from '../../../Services/allApis';
import toast from 'react-hot-toast';



function ItemsTable() {
    const { getResponse, setGetResponse } = useContext(getItemResponseContext);
    

    const handleDelete = async (id) => {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${sessionStorage.getItem('token')}`,
        };
        try {
            const res = await deleteItemApi(id, header);
            if (res.status === 200) {
                toast.success('Item Deleted!!');
                // Update state locally
                setGetResponse((prevItems) => prevItems.filter((item) => item._id !== id));
            } else {
                toast.warning('Something went Wrong !!');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error occurred while deleting the project.');
        }
    };
    
    return (
        <div className="container my-4">
            <Table striped bordered hover responsive className="table-primary text-center">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Time to Make (minutes)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(getResponse) && getResponse.length > 0 ? (
                        getResponse.map(item => (
                            <tr key={item._id}>
                                <td>
                                    <img
                                        src={`${base_url}/uploads/${item.image}`}
                                        alt={item.itemname}
                                        width="50"
                                        height="50"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                                    />
                                </td>
                                <td>{item.itemname}</td>
                                <td>{item.price}</td>
                                <td>{item.category}</td>
                                <td>{item.time}</td>
                                <td >
                                    <EditItems item={item} />
                                    <Button variant="danger" size="sm" className="mt-2 mt-md-0 ms-md-2" onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No items found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default ItemsTable