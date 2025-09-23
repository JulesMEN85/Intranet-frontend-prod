"use client";
import { useState } from "react";
import { useForm } from "react-hook-form"; // Ajout de l'importation
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const FilterForm = ({ onFilterSubmit }) => {
  const currentDate = Date.now();
  const [date, setDate] = useState({
    from: addDays(new Date(currentDate), -30),
    to: new Date(currentDate),
  });

  const form = useForm({
    defaultValues: {
      filterType: "categorie", // Par défaut, le filtre est sur la catégorie
      filterValue: "",
      from: date.from,
      to: date.to,
    },
  });

  const [open, setOpen] = useState(false); // Gère l'état ouvert/fermé du dropdown
  const [selected, setSelected] = useState("categorie"); // Valeur sélectionnée

  const handleSelect = (value) => {
    setSelected(value); // Met à jour l'état local pour l'affichage
    form.setValue("filterType", value); // Met à jour le champ "filterType" du formulaire
    setOpen(false); // Ferme la liste déroulante
  };
  

  const onSubmit = (data) => {
    const { from, to, filterType, filterValue } = data;
  
    if (!filterType || !filterValue) {
      alert("Veuillez sélectionner un type de filtre et entrer une valeur.");
      console.log("Données invalides :", data);
      return;
    }
  
    const payload = {
      startDate: format(from, "yyyy-MM-dd"),
      endDate: format(to, "yyyy-MM-dd"),
      filterType, // Ajoutez le type de filtre
      filterValue, // Ajoutez la valeur associée
    };
  
    console.log("Données envoyées :", payload);
  
    // Envoi des données via le callback
    if (onFilterSubmit) {
      onFilterSubmit(payload);
    }
  };
  

  return (
    <div className="flex justify-center items-center py-6 px-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap space-x-4 justify-center">
            {/* Filtre type */}
            <FormField control={form.control} name="filterType" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700 pb-2">Type de filtre</FormLabel>
                <FormControl>
                    <div className="relative">
                    <button
                      type="button"
                      className="w-full p-2 rounded-lg bg-white border border-gray-300 text-gray-700 flex items-center justify-between hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                      onClick={() => setOpen(!open)}
                    >
                      {selected === "categorie" ? "Catégorie" 
                        : selected === "client" ? "Client"
                        : "Représentant"}
                      <span className="text-sm ml-2">&#x25BC;</span>
                    </button>

                        {open && (
                          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <div
                              className="py-1 px-3 hover:bg-sky-100 rounded-md cursor-pointer"
                              onClick={() => {
                                handleSelect("categorie");
                                field.onChange("categorie"); // Assurez-vous que la valeur change
                              }}
                            >
                              Catégorie
                            </div>
                            <div
                              className="py-1 px-3 hover:bg-sky-100 rounded-md cursor-pointer"
                              onClick={() => {
                                handleSelect("client");
                                field.onChange("client"); // Assurez-vous que la valeur change
                              }}
                            >
                              Client
                            </div>                            
                            <div
                              className="py-1 px-3 hover:bg-sky-100 rounded-md cursor-pointer"
                              onClick={() => {
                              handleSelect("representant");
                              field.onChange("representant");
                              }}
                            >
                              Représentant
                            </div>
                          </div>
                        )}
                    </div>
                </FormControl>
              </FormItem>
            )} />


            {/* Filtre valeur */}
            <FormField control={form.control} name="filterValue" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700 pb-2">Valeur</FormLabel>
                <FormControl>
                  <Input className="w-36 border border-gray-300 rounded-md p-2" placeholder="Valeur" {...field} />
                </FormControl>
              </FormItem>
            )} />

            {/* Date de début */}
            <FormField control={form.control} name="from" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700 pb-2">Du</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-[240px] pl-3 text-left font-normal border-gray-300 rounded-md", !field.value && "text-gray-400")}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : format(date.from, "dd/MM/yyyy")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )} />

            {/* Date de fin */}
            <FormField control={form.control} name="to" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700 pb-2">Jusqu&apos;au</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-[240px] pl-3 text-left font-normal border-gray-300 rounded-md", !field.value && "text-gray-400")}
                      >
                        {field.value ? format(field.value, "dd/MM/yyyy") : format(date.to, "dd/MM/yyyy")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )} />

            {/* Bouton Rechercher */}
            <div className="flex items-end p-2.5">
              <Button type="submit" variant="outline" className="bg-sky-950 text-white rounded-md">
                Rechercher
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FilterForm;
