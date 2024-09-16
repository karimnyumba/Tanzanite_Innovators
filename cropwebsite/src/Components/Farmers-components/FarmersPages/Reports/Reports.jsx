import { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const getColor = (() => {
  const colors = {};
  let nextColorIndex = 0;
  const colorPalette = [
    'rgba(75, 192, 192, 0.6)', 'rgba(192, 75, 75, 0.6)', 'rgba(75, 75, 192, 0.6)',
    'rgba(192, 192, 75, 0.6)', 'rgba(192, 75, 192, 0.6)', 'rgba(75, 192, 75, 0.6)',
    // more colors .............
  ];
  
  return (crop) => {
    if (!colors[crop]) {
      colors[crop] = colorPalette[nextColorIndex % colorPalette.length];
      nextColorIndex += 1;
    }
    return colors[crop];
  };
})();

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await axios.get('https://tyktyk.pythonanywhere.com/orders/farmer/my_orders/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Compute the sum of total_cost
  const totalSum = useMemo(() => {
    return orders.reduce((sum, order) => sum + parseFloat(order.total_cost), 0).toFixed(2);
  }, [orders]);

  // Sort orders for table display
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders]);

  // Prepare data for the bar chart
  const data = {
    labels: orders.map(order => `${new Date(order.created_at).toLocaleDateString('en-GB')} - ${order.product_name}`),
    datasets: [
      {
        label: 'Quantity',
        data: orders.map(order => parseFloat(order.quantity)),
        backgroundColor: orders.map(order => getColor(order.product_name)),
      },
    ],
  };

  const farmerName = orders.length > 0 ? orders[0].farmer_name : 'Unknown Farmer';

  const styles = {
    body: {
      backgroundColor: '#fff',
      color: 'black',
      textAlign: 'center',
      fontSize: '1em',
      fontFamily: 'Poppins, sans-serif',
    },
    app: {
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      margin: '20px',
    },
    table: {
      margin: '20px auto',
      borderCollapse: 'collapse',
      width: '80%',
    },
    thTd: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
    th: {
      backgroundColor: '#f2f2f2',
    },
    h1: {
      marginBottom: '20px',
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={styles.app}>
      <h1 style={styles.h1}>My order report --  {farmerName} </h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>S/N</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Order Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Buyer Name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Crop</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Quantity</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Total cost</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order, index) => (
            <tr key={index}>
              <td style={styles.thTd}>{index + 1}</td>
              <td style={styles.thTd}>{new Date(order.created_at).toLocaleDateString('en-GB')}</td>
              <td style={styles.thTd}>{order.buyer_name}</td>
              <td style={styles.thTd}>{order.product_name}</td>
              <td style={styles.thTd}>{order.quantity}</td>
              <td style={styles.thTd}>{order.total_cost}</td>
              <td style={{ ...styles.thTd, color: order.processed ? 'green' : 'red' }}>
                {order.processed ? 'Delivered' : 'Pending'}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" style={{ ...styles.thTd, textAlign: 'right', fontWeight: 'bold' }}>Total Sum</td>
            <td style={{ ...styles.thTd, fontWeight: 'bold' }}>{totalSum}</td>
            <td style={styles.thTd}></td>
          </tr>
        </tbody>
      </table>
      <Bar data={data} />
    </div>
  );
};

export default Reports;
