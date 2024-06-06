import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { API_BACKEND } from '../API/api';
import { useStatistiquesContext } from "../hooks/useStatistiquesContext";
import { Bar, Pie } from "react-chartjs-2";
import { IoPerson } from "react-icons/io5";
import { GiAutoRepair } from 'react-icons/gi';
import { FaCarAlt } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Admin = () => {
  const { user } = useAuthContext();
  const { statistiques, dispatch } = useStatistiquesContext();

  useEffect(() => {
    const fetchTotalStatistic = async () => {
      const response = await fetch(API_BACKEND + '/api/admin/statistique/total');
      const json = await response.json();  

      if (response.ok) {
        dispatch({
          type: 'SET_STATISTIQUE',
          payload: {
            nbClient: json.data.nbClient,
            nbMequanicien: json.data.nbMequanicien,
            nbVehicule: json.data.nbVehicule,
            nbReparation: json.data.nbReparation,
          }
        });
      }
    };

    const fetchReparationPerMecaniqueStatistic = async () => {
      const response = await fetch(API_BACKEND + '/api/admin/statistique/reparation/mecanique');
      const json = await response.json();

      console.log(json.data);

      if (response.ok) {
        dispatch({
          type: 'SET_STATISTIQUE',
          payload: {
            repartionPerMecanique: json.data.reparationPerMecanique,
            reparationPerStatus: json.data.reparationPerStatus,
            reparations_en_cours : json.data.reparations_en_cours,
            reparations_termine : json.data.reparations_termine,
            reparations_clients : json.data.reparations_clients
          }
        });
      }
    };

    fetchTotalStatistic();
    fetchReparationPerMecaniqueStatistic();
  }, [dispatch]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
        {/* ----- 1 ------ */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center h-24 rounded bg-blue-500 dark:bg-blue-800">
            <IoPerson className="text-4xl text-white mb-2" />
            <p className="text-2xl text-white">
              Total Clients: {statistiques.nbClient}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center h-24 rounded bg-yellow-400 dark:bg-yellow-600">
            <IoPerson className="text-4xl text-white mb-2" />
            <p className="text-2xl text-white">
              Total Mecaniciens: {statistiques.nbMequanicien}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center h-24 rounded bg-red-400 dark:bg-red-600">
            <GiAutoRepair className="text-4xl text-white mb-2" />
            <p className="text-2xl text-white">
              Total Reparations: {statistiques.nbReparation}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center h-24 rounded bg-green-400 dark:bg-green-600">
            <FaCarAlt className="text-4xl text-white mb-2" />
            <p className="text-2xl text-white">
              Total Vehicules: {statistiques.nbVehicule}
            </p>
          </div>
        </div>
        {/* ----- end 1 ------ */}

        {/* -------  2 ----- */}
        <div className="grid grid-cols-3 gap-4 mb-4 mt-14">
          <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
            <Bar
              data={{
                labels: statistiques.reparationPerStatus.map((data) => data.label),
                datasets: [
                  {
                    label: "Count",
                    data: statistiques.reparationPerStatus.map((data) => data.value),
                    backgroundColor: "#3b82f6",
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Nombre Reparations Par Status' },
                },
                scales: {
                  x: {
                    ticks: {
                      callback: function (value) {
                        return this.getLabelForValue(value).split(' ').join('\n');
                      },
                      maxRotation: 90,
                      minRotation: 90,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
            <Pie
              data={{
                labels: statistiques.repartionPerMecanique.map((data) => data.label),
                datasets: [
                  {
                    label: "Count",
                    data: statistiques.repartionPerMecanique.map((data) => data.value),
                    backgroundColor: [
                      "rgba(255, 152, 0, 0.8)",
                      "rgba(76, 175, 80, 0.8)",
                      "rgba(43, 63, 229, 0.8)",
                      "rgba(250, 192, 135, 0.8)",
                      "rgba(156, 39, 176, 0.8)",
                      "rgba(33, 150, 243, 0.8)",
                      "rgba(255, 87, 34, 0.8)",
                      "rgba(63, 81, 181, 0.8)",
                      "rgba(255, 193, 7, 0.8)",
                      "rgba(233, 30, 99, 0.8)",
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Nombre Reparations Par Mecanicien' },
                },
              }}
            />
          </div>

          <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
              <Pie
                data={{
                  labels: statistiques.reparations_en_cours.map((data) => data.label),
                  datasets: [
                    {
                      label: "Count",
                      data: statistiques.reparations_en_cours.map((data) => data.value),
                      backgroundColor: [
                        "rgba(255, 152, 0, 0.8)",
                        "rgba(76, 175, 80, 0.8)",
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 135, 0.8)",
                        "rgba(156, 39, 176, 0.8)",
                        "rgba(33, 150, 243, 0.8)",
                        "rgba(255, 87, 34, 0.8)",
                        "rgba(63, 81, 181, 0.8)",
                        "rgba(255, 193, 7, 0.8)",
                        "rgba(233, 30, 99, 0.8)",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Nombre Reparations en cours Par Mecanicien' },
                  },
                }}
              />
            </div>

        </div>
        {/* ------- end 2 ----- */}

        {/* -------  3 ----- */}
        <div className="grid grid-cols-3 gap-4 mb-4 mt-14">

          

            <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
              <Pie
                data={{
                  labels: statistiques.reparations_termine.map((data) => data.label),
                  datasets: [
                    {
                      label: "Count",
                      data: statistiques.reparations_termine.map((data) => data.value),
                      backgroundColor: [
                        "rgba(255, 152, 0, 0.8)",
                        "rgba(76, 175, 80, 0.8)",
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 135, 0.8)",
                        "rgba(156, 39, 176, 0.8)",
                        "rgba(33, 150, 243, 0.8)",
                        "rgba(255, 87, 34, 0.8)",
                        "rgba(63, 81, 181, 0.8)",
                        "rgba(255, 193, 7, 0.8)",
                        "rgba(233, 30, 99, 0.8)",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Nombre Reparations Terminé Par Mecanicien' },
                  },
                }}
              />
            </div>

            <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800 col-span-2">
              <Bar
                data={{
                  labels: statistiques.reparations_clients.map((data) => data.label),
                  datasets: [
                    {
                      label: "Count",
                      data: statistiques.reparations_clients.map((data) => data.value),
                      backgroundColor: "#3b82f6",
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Nombre Reparations Par Client' },
                  },
                  scales: {
                    x: {
                      ticks: {
                        callback: function (value) {
                          return this.getLabelForValue(value).split(' ').join('\n');
                        },
                        maxRotation: 90,
                        minRotation: 90,
                      },
                    },
                  },
                }}
              />
          
            </div>

            
        </div>
        {/* ------- end 3 ----- */}
      </div>
    </div>
  );
}

export default Admin;
