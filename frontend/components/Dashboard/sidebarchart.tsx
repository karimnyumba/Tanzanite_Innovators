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




export function SideBarChart(data:any) {

    const chartData = {
        labels: data["data"]["labels"],
        datasets: [{
        
          data:data["data"]["data"],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#4CAF50'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#4CAF50']
        }]
      };
    
      const chartOptions: ChartOptions<'bar'> = {
        indexAxis: 'y', // This changes the bar chart to horizontal
        plugins: {
            legend: {
                display: false, // Set to false if you don't want to display the legend
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Usage'
                },
                grid: {
                  display: false // Disabling grid lines for the x-axis
              },
            },
            y: {
                title: {
                    display: true,
                    text: 'Fertilizer'
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

