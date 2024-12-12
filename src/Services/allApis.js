import base_url from "./base_url";
import commonApi from "./commonApi";


export const registerApi=async(data)=>{
    return await commonApi(`${base_url}/reg`,"POST","" ,data)
}

export const loginApi=async(data)=>{
    return await commonApi(`${base_url}/log`,"POST","",data)
}

export const chefRegisterApi=async(data)=>{
    return await commonApi(`${base_url}/chefreg`,"POST","",data)
}

export const chefLoginApi=async(data)=>{
    return await commonApi(`${base_url}/cheflog`,"POST","",data)
}

export const addItemApi=async(data,header)=>{
    return await commonApi(`${base_url}/additem`,"POST",header,data)
}

export const getItemlistApi=async(header)=>{
    return await commonApi(`${base_url}/itemlist`,"GET",header,"")
}

export const deleteItemApi=async(id,header)=>{
    return await commonApi(`${base_url}/delitem/${id}`,"DELETE",header,{})
}

export const editItemApi=async(id,header,data)=>{
    return await commonApi(`${base_url}/edititem/${id}`,"PUT",header,data)
}

export const editChefApi=async(data,header)=>{
    return await commonApi(`${base_url}/editchef`,"PUT",header,data)
}

export const allItemsApi = async (header) => {
    return await commonApi(`${base_url}/allitems`, "GET", header,"");
};

export const itemViewApi = async (header, id) => {
    return await commonApi(`${base_url}/item/${id}`, "GET", header,"");
};

export const editUserApi=async(data,header)=>{
    return await commonApi(`${base_url}/edituser`,"PUT",header,data)
}

export const addtocartApi=async(data,header)=>{
    return await commonApi(`${base_url}/addtocart`,"POST",header,data)
}

export const getCartApi=async(header)=>{
    return await commonApi(`${base_url}/mycart`,"GET",header,"")
}

export const deleteCartApi=async(id,header)=>{
    return await commonApi(`${base_url}/delcart/${id}`,"DELETE",header,{})
}

export const editCartApi=async(header,data)=>{
    return await commonApi(`${base_url}/editcart`,"PUT",header,data)
}

export const newOrderApi=async(data,header)=>{
    return await commonApi(`${base_url}/neworder`,"POST",header,data)
}

export const razorPayApi=async(data,header)=>{
    return await commonApi(`${base_url}/create-order`,"POST",header,data)
}

export const deleteOrderApi=async(id,header)=>{
    return await commonApi(`${base_url}/removeorder/${id}`,"DELETE",header,{})
}

export const getOrderApi=async(header)=>{
    return await commonApi(`${base_url}/orderlist`,"GET",header,"")
}

export const getUserOrderApi=async(header)=>{
    return await commonApi(`${base_url}/getuserorder`,"GET",header,"")
}


export const cancelOrderApi = async (id, header) => {
    return await commonApi(`${base_url}/cancelOrder/${id}`,"PATCH",header,{});
};


export const updateStatusApi=async(id, newStatus, header)=>{
    return await commonApi(`${base_url}/updateOrderStatus/${id}`,"PATCH", header, { newStatus });
}

export const deleteUserOrderApi=async(id,header)=>{
    return await commonApi(`${base_url}/delorder/${id}`,"DELETE",header,{})

}

export const addRatingApi = async (id, data, header) => {
    return await commonApi(`${base_url}/addRating/${id}`, "POST", header, data);
};

export const getChefsApi=async()=>{
return await commonApi(`${base_url}/getchefs`,"GET","","")
}