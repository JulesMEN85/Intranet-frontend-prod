import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';

const TablePsl = () => {
  const form = useForm({
    defaultValues: {
      week: '',
      startDate: '',
      endDate: '',
    },
  });

  const [orders, setOrders] = useState([]);

  const getWeekDates = (week) => {
    const [year, weekNumber] = week.split('-W');
  
    // Trouver le 4 janvier (premier jeudi possible de l'année ISO-8601)
    const january4 = new Date(Date.UTC(year, 0, 4));
  
    // Trouver le lundi de cette semaine
    const firstMonday = new Date(january4);
    const dayOffset = january4.getUTCDay() === 0 ? -6 : 1 - january4.getUTCDay(); // Si dimanche, revient à lundi
    firstMonday.setUTCDate(january4.getUTCDate() + dayOffset);
  
    // Calcul du lundi de la semaine demandée
    const startDate = new Date(firstMonday);
    startDate.setUTCDate(firstMonday.getUTCDate() + (weekNumber - 1) * 7);
  
    // Calcul du dimanche de la semaine demandée
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 6);
  
    // Formatage en YYYYMMDD
    return {
      startDate: `${startDate.getUTCFullYear()}${String(startDate.getUTCMonth() + 1).padStart(2, '0')}${String(startDate.getUTCDate()).padStart(2, '0')}`,
      endDate: `${endDate.getUTCFullYear()}${String(endDate.getUTCMonth() + 1).padStart(2, '0')}${String(endDate.getUTCDate()).padStart(2, '0')}`,
    };
  };
  
  
  

  const fetchOrders = async (data) => {
    const { week, startDate, endDate } = data;

    if (!week && (!startDate || !endDate)) {
      alert('Veuillez sélectionner une semaine ou une plage de dates.');
      return;
    }

    try {
      const params = week
        ? getWeekDates(week)
        : {
            startDate: startDate.replace(/-/g, ''),
            endDate: endDate.replace(/-/g, ''),
          };

      console.log('Paramètres envoyés :', params); // Ajout du log
      const response = await axios.get('/api/psl/orders', { params });
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes PSL :', error.response || error);
      alert(`Erreur : ${error.response?.data?.error || 'Une erreur s’est produite.'}`);
    }
  };

  const onSubmit = (data) => {
    fetchOrders(data);
  };

  const resetFilters = () => {
    form.reset({
      week: '',
      startDate: '',
      endDate: '',
    });
    setOrders([]);
  };

  return (
    <div className="container mx-auto mt-4">
      {/* Card pour les filtres */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Commandes PSL</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Filtre Semaine */}
            <FormField control={form.control} name="week" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2 mb-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span>Semaine</span>
                </FormLabel>
                <FormControl>
                  <input
                    type="week"
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </FormControl>
              </FormItem>
            )} />

            {/* Plage de Dates */}
            <div className="flex gap-4">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="mb-2">Date de début</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="mb-2">Date de fin</FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            <div className="flex gap-4">
                {/* Bouton Appliquer */}
                <Button
                    type="submit"
                    variant="outline"
                    className="bg-sky-950 text-white px-6 py-[10px] h-[42px]"
                >
                    Appliquer
                </Button>

                {/* Bouton Réinitialiser */}
                <Button
                    type="button"
                    onClick={resetFilters}
                    variant="outline"
                    className="bg-gray-500 text-white px-6 py-[10px] h-[42px]"
                >
                    Effacer les filtres
                </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Card pour le tableau */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Saisie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Livraison
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                    <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date_saisie
                            ? new Date(order.date_saisie).toLocaleDateString('fr-CA') // Format YYYY-MM-DD
                            : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date_livraison
                        ? new Date(order.date_livraison).toLocaleDateString('fr-CA') // Format YYYY-MM-DD
                        : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.etat}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Aucune commande trouvée pour les critères sélectionnés.</p>
        )}
      </div>
    </div>
  );
};

export default TablePsl;