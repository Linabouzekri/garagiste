import React, { useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useStatistiquesClientContext } from '../hooks/useStatistiquesClientContext';
import { API_BACKEND } from '../API/api';
import { GiAutoRepair } from 'react-icons/gi';
import { Pie } from 'react-chartjs-2';
import CalendarComponent from '../components/CalendarComponent';

const Client = () => {
  const { user } = useAuthContext();
  const { statistiques, dispatch } = useStatistiquesClientContext();

  useEffect(() => {
    const fetchTotalStatistic = async () => {
      const response = await fetch(API_BACKEND + '/api/client/statistique/' + user.id);
      const json = await response.json();

      if (response.ok) {
        dispatch({
          type: 'SET_STATISTIQUE',
          payload: json.data,
        });
      }
    };

    fetchTotalStatistic();
  }, [dispatch]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700">
          {/* ----- 1 ------ */}
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
            <div className="flex flex-col items-center justify-center h-24 rounded bg-blue-500 dark:bg-blue-800">
              <GiAutoRepair className="text-4xl text-white mb-2" />
              <p className="text-2xl text-white">En Attente: {statistiques.totatReparation.en_attente}</p>
            </div>

            <div className="flex flex-col items-center justify-center h-24 rounded bg-yellow-400 dark:bg-yellow-600">
              <GiAutoRepair className="text-4xl text-white mb-2" />
              <p className="text-2xl text-white">En cours : {statistiques.totatReparation.en_cours}</p>
            </div>

            <div className="flex flex-col items-center justify-center h-24 rounded bg-green-400 dark:bg-green-600">
              <GiAutoRepair className="text-4xl text-white mb-2" />
              <p className="text-2xl text-white">Termine: {statistiques.totatReparation.termine}</p>
            </div>
          </div>
          {/* ----- end 1 ------ */}

          {/* -------  2 ----- */}
          <div className="grid grid-cols-1 gap-4 mb-4 mt-14 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
              <Pie
                data={{
                  labels: statistiques.reparationClient.map(data => data.label),
                  datasets: [
                    {
                      label: 'Count',
                      data: statistiques.reparationClient.map(data => data.value),
                      backgroundColor: [
                        'rgba(255, 152, 0, 0.8)',
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(43, 63, 229, 0.8)',
                        'rgba(250, 192, 135, 0.8)',
                        'rgba(156, 39, 176, 0.8)',
                        'rgba(33, 150, 243, 0.8)',
                        'rgba(255, 87, 34, 0.8)',
                        'rgba(63, 81, 181, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(233, 30, 99, 0.8)',
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Nombre Reparations Par Vehicule' },
                  },
                }}
              />
            </div>

            <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
              <CalendarComponent />
            </div>
          </div>
          {/* ------- end 2 ----- */}

      </div>
    </div>
  );
};

export default Client;
