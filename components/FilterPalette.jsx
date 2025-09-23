import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Calendar as CalendarIcon, MapPin as ZoneIcon } from 'lucide-react';

const FilterPalette = ({ zones, onFilter }) => {
  const form = useForm({
    defaultValues: {
      week: '',
      zone: '',
    },
  });

  const onSubmit = (data) => {
    const { week, zone } = data;

    if (!week || !zone) {
      alert('Veuillez sélectionner une semaine et une zone.');
      return;
    }

    console.log('Filtres soumis :', { week, zone });

    if (onFilter) {
      onFilter({ week, zone });
    }
  };

  return (
    <div className="flex justify-center items-start p-4">
      <div className="bg-white shadow-md rounded-md p-4 flex items-center space-x-6 w-full max-w-6xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center space-x-6 w-full">
            {/* Semaine */}
            <FormField control={form.control} name="week" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-700 flex items-center space-x-2 mb-2">
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

            {/* Zone */}
            <FormField control={form.control} name="zone" render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gray-700 flex items-center space-x-2 mb-2">
                  <ZoneIcon className="w-4 h-4 text-gray-500" />
                  <span>Zone</span>
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionnez une zone</option>
                    {zones.map((zone, index) => (
                      <option key={index} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )} />

            {/* Bouton de soumission */}
            <div className="flex items-center">
              <Button
                type="submit"
                variant="outline"
                className="bg-sky-950 text-white px-6 py-[10px] h-[42px]"
              >
                Appliquer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FilterPalette;
