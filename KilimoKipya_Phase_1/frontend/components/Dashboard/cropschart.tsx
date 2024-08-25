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

  );




export function CropsChart(data: any) {

    console.log("heree")
    console.log(data["data"])
    if (!data["data"] || Object.keys(data["data"]).length === 0) {
      return <div>No data available for the selected date range and commodities.</div>;
    }

    const chartData = {
        type:'line',
        
        datasets: [{
            label:"Beans",
        
          data:data["data"]["Beans"]?.data || []
      ,
        
        //    [
        //     {x:300,y:500},
        //         {x:50,y:20},
        //     {x:100,y:29}].sort((a, b) => a.x - b.x),
          backgroundColor: '#36A2EB',
          pointRadius: 0.8,
          borderColor: '#36A2EB',
          hoverBackgroundColor:'#FF6384',
          borderWidth:1,
          pointBackgroundColor: 'red',
        
     
        },
        {
        label:"Maize",
        
        data:data["data"]["Maize"]?.data || []
    ,
    
        //    [
        //     {x:300,y:500},
        //         {x:50,y:20},
        //     {x:100,y:29}].sort((a, b) => a.x - b.x),
          pointRadius: 0.8 ,
          borderColor: 'green',
          borderWidth:1,
          pointHoverRadius: 5,
          hoverBackgroundColor:'#36A2EB',
          pointBackgroundColor: 'orange',
          
          fill: false  // Area will be red above the origin
                // And blue below the origin
          
        },

    {
      label: "Millet (bulrush)",
        
      data:data["data"][ "Millet (bulrush)"]?.data || []
  ,
    //    [
    //     {x:300,y:500},
    //         {x:50,y:20},
    //     {x:100,y:29}].sort((a, b) => a.x - b.x),
      pointRadius: 0.8 ,
      borderColor: 'brown',
      borderWidth:1,
      pointHoverRadius: 5,
      hoverBackgroundColor:'#36A2EB',
      pointBackgroundColor: 'orange',
      
      fill: false  // Area will be red above the origin
            // And blue below the origin
      
    },
        {
            label:'Rice',
            data:data["data"][ "Rice"]?.data || []
        
        ,
          //    [
          //     {x:300,y:500},
          //         {x:50,y:20},
          //     {x:100,y:29}].sort((a, b) => a.x - b.x),
            pointRadius: 0.8 ,
            borderColor: '#FFCE56',
            borderWidth:1,
            pointHoverRadius: 5,
            hoverBackgroundColor:'#36A2EB',
            pointBackgroundColor: 'orange',
            
            fill: false  // Area will be red above the origin
                  // And blue below the origin
            
          },
          {
            label:"Sorghum",
            data:data["data"]["Sorghum"]?.data || []
        
        ,
          //    [
          //     {x:300,y:500},
          //         {x:50,y:20},
          //     {x:100,y:29}].sort((a, b) => a.x - b.x),
            pointRadius: 0.8 ,
            borderColor: '#FFAEEE',
            borderWidth:1,
            pointHoverRadius: 5,
            hoverBackgroundColor:'#36B2BB',
            pointBackgroundColor: 'blue',
            
            fill: false  // Area will be red above the origin
                  // And blue below the origin
            
          }]
      };
    
      const chartOptions: ChartOptions<'line'> = {
        plugins: {
            legend: {
                display: true, // Set to false if you don't want to display the legend
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
                  display: false // Disabling grid lines for the x-axis
              },
            },
            y: {
                type:"linear",
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'TZS per 100 kg'
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
        <div style={{ height: '400px', width:'100%'}}>
          <Line data={chartData} options={chartOptions} />
          </div>
        </>
      );
}

