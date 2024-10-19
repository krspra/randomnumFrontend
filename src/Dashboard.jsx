import React, { useEffect, useState, useRef } from "react";
import Dropdown from "./components/dropdown";
import io from "socket.io-client";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function Dashboard() {
  const socket = useRef(null); 
  const chartInstance = useRef(null);
  const [randomNumber, setRandomNumber] = useState(null);

  const handleNewMinValue = (val) => {
    if (socket.current) {
      socket.current.emit("minVal", val);
    }
  };

  const handleNewMaxValue = (val) => {
    if (socket.current) {
      socket.current.emit("maxVal", val);
    }
  };

  useEffect(() => {
    socket.current = io.connect("https://randomnumber-backend.onrender.com");

    socket.current.on("connect_error", (err) => {
      console.error("Connection failed: ", err);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    handleNewMaxValue(100);
    handleNewMinValue(1);
    const ctx = document.getElementById("myChart")?.getContext("2d");

    if (!ctx) {
      console.error("Canvas context not found.");
      return;
    }

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
            tension:0.5,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    let counter = 0;
    socket.current.on("randomNumber", (number) => {
      counter++;
      setRandomNumber(number);
      chartInstance.current.data.labels.push(counter);
      chartInstance.current.data.datasets[0].data.push(number);
      chartInstance.current.update();
      if(chartInstance.current.data.labels.length>20){
        chartInstance.current.data.labels.shift()
        chartInstance.current.data.datasets[0].data.shift();
      }
    });

    return () => {
      socket.current.disconnect();
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <main className="flex gap-5 flex-col pt-4 h-400px items-center">
      <div className="flex justify-around w-full">
        <Dropdown
          onNewDropvalue={handleNewMinValue}
          name="Minimum "
          initialVal={1}
        />
        <Dropdown
          onNewDropvalue={handleNewMaxValue}
          name="Maximum "
          initialVal={100}
        />
      </div>
      <div className="w-full flex justify-around items-center">
        <div className="w-2/3">
          <canvas id="myChart"></canvas>
        </div>
        <div className="h-24 w-24 bg-green-400 rounded-md flex items-center justify-center text-5xl text-white">{randomNumber}</div>
      </div>
    </main>
  );
}

export default Dashboard;
