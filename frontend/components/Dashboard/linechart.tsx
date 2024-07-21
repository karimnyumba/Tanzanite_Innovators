import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarController,
    BarElement,
    CategoryScale,
     LinearScale,
    Legend,
    ChartOptions ,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
  
  } from "chart.js";
import { useMediaQuery } from '@mantine/hooks';
 
  const horizontalLinePlugin = {
    id: 'horizontalLineOnHover',
    afterDraw: (chart:any) => {
      if (chart.tooltip && chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        const tooltip = chart.tooltip._active[0];
        const x = tooltip.element.x;
  
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x,chart.height);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 99, 132, 0.5)'; // Customize line color and width
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  ChartJS.register(
    BarController,
    BarElement,
    CategoryScale,
     LinearScale,
    Legend,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    horizontalLinePlugin,
    Filler
  );




export function LineChart(data: any) {

    console.log(data["data"]["rain"])
    const isLargeScreen = useMediaQuery(`(min-width: 644px)`);
    const chartData = {
      type: 'line',
      datasets: [
        {
          label: 'Temperature',
          data: data["data"]["temperature"],
          pointRadius: 0.8,
          borderColor: '#FFCE56',
          borderWidth: 1,
          pointHoverRadius: 5,
          hoverBackgroundColor: '#36A2EB',
          pointBackgroundColor: 'orange',
          tension: 0.4,
          fill: {
            target: '1',
            above: "rgba(255,206,86, 0.3)"
          }
        },
        {
          label: 'Rain',
          data: data["data"]["rain"],
          backgroundColor: '#36A2EB',
          pointRadius: 0.8,
          borderColor: '#36A2EB',
          hoverBackgroundColor: '#FF6384',
          borderWidth: 1,
          tension: 0.4,
          fill: {
            target: 'origin',
            above: "rgb(54,162,235, 0.4)"
          }
        }
      ]
    };
    
    const chartOptions: ChartOptions<'line'> = {
      plugins: {
        legend: {
          display: true,
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Time'
          },
          grid: {
            display: false
          },
        },
        y: {
          type: "linear",
          beginAtZero: true,
          title: {
            display: true,
            text: 'Rainfall (mm), Temperature (°C)'
          },
          grid: {
            display: false
          },
        }
      },
      maintainAspectRatio: false
    };
    
      return (
        <>
        <div style={{ height:'400px', width:'100%'}}>
          <Line data={chartData} options={chartOptions} />
          </div>
        </>
      );
}

