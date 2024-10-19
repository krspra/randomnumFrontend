import React, { useEffect, useState, useRef } from "react";
import Dropdown from "./components/dropdown";
import io from "socket.io-client";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function Dashboard() {
  const socket = useRef(null);
  const chartInstance = useRef(null);
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(100);

  useEffect(() => {
    // Establish socket connection only once
    socket.current = io.connect("http://localhost:3000/");

    socket.current.on("connect_error", (err) => {
      console.error("Connection failed: ", err);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Set up the chart
    const ctx = document.getElementById("myChart").getContext("2d");
    
    // Initialize chart instance
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Random Number",
            data: [],
            borderColor: "#f51b07",
            borderWidth: 1,
            fill: true,
            backgroundColor: "#fabab4",
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    let counter = 0;
    socket.current.on("randomNumber", (number) => {
      counter++;
      // Update chart data
      chartInstance.current.data.labels.push(counter);
      chartInstance.current.data.datasets[0].data.push(number);
      chartInstance.current.update();
    });

    return () => {
      // Clean up socket connection
      socket.current.disconnect();
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(()=>{

    return chartInstance.current.destroy();
  },[minVal,maxVal])

  const handleNewMinValue = (val) => {
    setMinVal(val);
    socket.current.emit('minVal', val); // Emit the new min value
  };

  const handleNewMaxValue = (val) => {
    setMaxVal(val);
    socket.current.emit('maxVal', val); // Emit the new max value
  };

  return (
    <main className="flex gap-5 flex-col pt-4 h-400px items-center">
      <div className="flex justify-around w-full">
        <Dropdown onNewDropvalue={handleNewMinValue} name="Minimum " initialVal={1} />
        <Dropdown onNewDropvalue={handleNewMaxValue} name="Maximum " initialVal={100} />
      </div>
      <div className="w-2/3">
        <canvas id="myChart"></canvas>
      </div>
    </main>
  );
}

export default Dashboard;
