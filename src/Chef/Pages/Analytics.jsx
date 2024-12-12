import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getOrderApi } from "../../Services/allApis";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

function Analytics() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${sessionStorage.getItem("token")}`,
    };

    try {
      const res = await getOrderApi(headers);
      if (res.status === 200) {
        const orders = res.data;
        

        const cancelledOrders = orders.filter(order => order.cancelled === true);
        const deliveredOrders = orders.filter(order => order.orderStatus === "Delivered");
        const progressingOrders = orders.filter(order => order.orderStatus !== "Delivered" && !order.cancelled);

        const data = [
          { name: "Cancelled Orders", value: cancelledOrders.length },
          { name: "Delivered Orders", value: deliveredOrders.length },
          { name: "Progressing Orders", value: progressingOrders.length },
        ];

        setChartData(data);
      } else {
        console.error("Error fetching data:", res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#DFF2EB" }}>
        <h2 className="text-center pt-4">Total Orders</h2>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </div>
      </div>
    </>
  );
}

export default Analytics;
