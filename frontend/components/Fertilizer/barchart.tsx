import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarController,
    BarElement,
    CategoryScale,
     LinearScale,
    Legend,
    ChartOptions ,
    ElementChartOptions

  } from "chart.js";

  ChartJS.register(
    BarController,
    BarElement,
    CategoryScale,
     LinearScale,
    Legend
  );




export function BarChart(data:any) {
    console.log("data here")
    console.log(data)

    const chartData = {
        labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'pH'],
        datasets: [
            {
                label: 'Real Value',
                data: data["data"]["actual values"], // Add values for pairs 3, 4, and 5
                backgroundColor: 'brown',
            },
            {
                label: 'Required Value',
                data: data["data"]["required values"], // Add values for pairs 3, 4, and 5
                backgroundColor: 'orange',
            },
        ],
    };

      const chartOptions: ChartOptions<'bar'> = {
    
        plugins: {
            legend: {
                display: true, // Set to false if you don't want to display the legend
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Nutrients'
                },
                grid: {
                  display: false // Disabling grid lines for the x-axis
              },
            },
            y: {
                title: {
                    display: true,
                    text: 'Quantity'
                },
                grid: {
                  display: false // Disabling grid lines for the x-axis
              },
            }
        },
     
        maintainAspectRatio: false
    };
    
      return (
        <>
        <div style={{ height: '305px', width:'100%' }}>
          <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      );
}

