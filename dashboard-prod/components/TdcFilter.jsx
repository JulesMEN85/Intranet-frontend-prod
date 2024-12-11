"use client";
import { Form, FormControl, FormField, FormLabel, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { format, getWeek, startOfWeek, endOfWeek, addWeeks } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
const TdcFilter = ({ setData, setSelectedWeek }) => {
  const [date, setDate] = useState({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }), // Lundi de la semaine actuelle
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),    // Dimanche de la semaine actuelle
  });
  const [weekRange, setWeekRange] = useState("");

  const form = useForm({
    defaultValues: {
      from: date.from,
      to: date.to,
      selectOption: "",
    },
  });

  // Calcul de la semaine quand les dates changent
  useEffect(() => {
    if (date.from && date.to) {
      const startWeek = getWeek(date.from, { locale: fr });
      const endWeek = getWeek(date.to, { locale: fr });
      setWeekRange(
        startWeek === endWeek
          ? `Semaine ${startWeek}`
          : `Semaines ${startWeek} - ${endWeek}`
      );

      // Met à jour la semaine sélectionnée pour le parent si setSelectedWeek est défini
      if (typeof setSelectedWeek === "function") {
        setSelectedWeek(
          startWeek === endWeek
            ? `2024-W${startWeek}`
            : `2024-W${startWeek}-W${endWeek}`
        );
      } else {
        console.error("setSelectedWeek n'est pas défini ou n'est pas une fonction");
      }
    }
  }, [date, setSelectedWeek]);

  // Fonction pour obtenir la semaine actuelle
  const getCurrentWeek = () => {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
  };

  // Calcul de la semaine actuelle et mise à jour de la sélection
  useEffect(() => {
    const currentWeek = getWeek(new Date(), { locale: fr });
    setWeekRange(`Semaine ${currentWeek}`);
    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`2024-W${currentWeek}`);
    }
  }, [setSelectedWeek]);

    // Fonction de soumission du formulaire
    const onSubmit = async (event) => {
      const { from, to } = event;
  
      try {
        const url = `${baseURL}/api/planning?startDate=${getDateWithFormatAPI(
          from
        )}&endDate=${getDateWithFormatAPI(to)}`;
  
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Erreur lors de l'appel API");
        }
  
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setData([]); // Réinitialisez les données en cas d'erreur
      }
    };

  // Met à jour la semaine et les dates lorsque la navigation change
  const updateWeek = (weeksToAdd) => {
    const newFrom = addWeeks(date.from, weeksToAdd);
    const newTo = endOfWeek(newFrom, { weekStartsOn: 1 });

    setDate({ from: newFrom, to: newTo });

    const newWeek = getWeek(newFrom, { locale: fr });
    setWeekRange(`Semaine ${newWeek}`);

    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`2024-W${newWeek}`);
    }
  };

  // Initialisation de la semaine actuelle
  useEffect(() => {
    const currentWeek = getWeek(new Date(), { locale: fr });
    setWeekRange(`Semaine ${currentWeek}`);
    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`2024-W${currentWeek}`);
    }
  }, [setSelectedWeek]);


    // Gestion des changements manuels de date
    const handleDateChange = (field, selectedDate) => {
      setDate((prevDate) => ({
        ...prevDate,
        [field]: selectedDate,
      }));
  
      const newWeek = getWeek(selectedDate, { locale: fr });
      setWeekRange(`Semaine ${newWeek}`);
  
      if (typeof setSelectedWeek === "function") {
        setSelectedWeek(`2024-W${newWeek}`);
      }
    };




    
    return (
      <div className="flex px-2 pt-2 pb-4 bg-sky-800 space-x-2 items-center justify-center">
        <Form {...form}>
          <form
            className="flex w-full space-x-2 justify-center max-[730px]:flex-wrap items-center"
          >
            {/* Bouton "Pré" */}
            <div className="flex flex-col items-center">
              <p className="text-sky-50 text-sm mb-1">pré</p>
              <Button
                type="button" 
                variant="outline"
                onClick={() => updateWeek(-1)} // Passe à la semaine précédente
                className="text-black border-none bg-white p-2 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            {/* Champ "Du" */}
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center max-[730px]:my-2">
                  <FormLabel className="text-sky-50 my-1">Du</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          className="text-black text-sm w-[120px] text-center"
                          value={format(date.from, "dd/MM/yyyy")}
                          readOnly
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date.from}
                        onSelect={(selectedDate) => handleDateChange("from", selectedDate)}
                        disabled={(date) => date < new Date("2021-01-01")}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Champ "Jusqu'au" */}
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center max-[730px]:my-2">
                  <FormLabel className="text-sky-50 my-1">{"Jusqu'au"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Input
                          className="text-black text-sm w-[120px] text-center"
                          value={format(date.to, "dd/MM/yyyy")}
                          readOnly
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date.to}
                        onSelect={(selectedDate) => handleDateChange("to", selectedDate)}
                        disabled={(date) => date < new Date("2021-01-01")}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Champ "Semaine" */}
            <FormItem className="flex flex-col items-center max-[730px]:my-2">
              <FormLabel className="text-sky-50 my-1">Semaine</FormLabel>
              <FormControl>
                <Input
                  className="text-black text-sm w-[120px] text-center"
                  value={weekRange}
                  readOnly
                />
              </FormControl>
            </FormItem>

            {/* Bouton "Suiv" */}
            <div className="flex flex-col items-center justify-center max-[730px]:my-2">
              <p className="text-sky-50 text-sm mb-1">suiv</p>
              <Button
                type="button" 
                variant="outline"
                onClick={() => updateWeek(1)} // Passe à la semaine suivante
                className="text-black border-none bg-white p-2 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );               
};

export default TdcFilter;
