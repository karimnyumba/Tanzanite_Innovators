import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    DoughnutController,
    ArcElement,
    Legend,
    ChartOptions

  } from "chart.js";

  ChartJS.register(
    DoughnutController,
    ArcElement,
    Legend
  );




export function DoughnutChart(data:any) {


    const chartData = {
        labels: data["data"]["labels"],
        datasets: [{
        
          data: data["data"]["data"],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#4CAF50'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#4CAF50']
        }]
      };
    
      // Options for the pie chart
      const chartOptions:ChartOptions<'doughnut'> = {
        layout: {
          padding: {
            bottom: 0 // Set bottom padding to 0
          }
        },
        plugins: {
          legend: {
            
            display: true, // Display the legend
            position: 'right', // Position the legend at the right side
            align: 'center', // Align the legend items to the start of the column
            labels: {
              boxWidth: 20, // Adjust the width of the legend box
           // Use point style for legend markers
            },
        
          }
        }
      };
    
      return (
        <>
          <Doughnut  data={chartData} options={chartOptions} />
        </>
      );
}

