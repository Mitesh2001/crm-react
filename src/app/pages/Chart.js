import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';


const Chart = ({className,data1}) => {
  const rand = () => Math.round(Math.random() * 20 - 10);
  var theMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  var aMonth = today.getMonth()+1;
  var i;
  var months=[];
  for (i=0; i<12; i++) {
      months.push(theMonths[aMonth]); //here you can do whatever you want...
      aMonth++;
      if (aMonth > 11) {
          aMonth = 0;
      }
  }
  const data = {
    labels: months,
    datasets: [
      {
        type: 'line',
        label: 'Line Chart',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        fill: false,
        data: data1,
      },
      {
        type: 'bar',
        label: 'Bar Chart',
        backgroundColor: 'rgb(255, 99, 132)',
        data: data1,
        borderColor: 'white',
        borderWidth: 2,
      },
      // {
      //   type: 'bar',
      //   label: 'Dataset 3',
      //   backgroundColor: 'rgb(75, 192, 192)',
      //   data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
      // },
    ],
  };
  if(data1.length>0){
    return (
      <>
       <div
            className={`card card-custom ${className}`}
            style={{ border: "2px solid #C0C0C0", borderRadius: "5px" }}
          >
            <div className="card-header border-0">
              <h3 className="card-title font-weight-bolder text-dark" >
                MonthWise Lead Data
              </h3>
            </div>
      
            <Bar data={data} />
          </div>
      
      </>
    );
  }else{
    return null;
  }

};

export default Chart;