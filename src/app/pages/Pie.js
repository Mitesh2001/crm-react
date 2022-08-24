import React from 'react';
import { Pie } from 'react-chartjs-2';


const PieChart = ({className,data1,data2,title}) => {
  const data = {
    labels: ['conversions'],
    datasets: [
      {
        data: [data2,data1-data2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(240, 87, 132, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(240, 87, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
 return(
  <>
      <div
            className={`card card-custom ${className}`}
            style={{ border: "2px solid #C0C0C0", borderRadius: "5px",paddingBottom:"5px"}}
      > 
        <div className="card-header border-0">
          <h3 className="card-title font-weight-bolder text-dark">
            {title}
          </h3>
        </div>
        <Pie data={data} />
      </div>
  </>

 ) 
 };

export default PieChart;