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

const baseURL = "http://192.168.1.18:4000"; // Remplacez par l'URL de votre API

const getDateWithFormatAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;  // Format YYYY-MM-DD
};


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
      const startWeek = getWeek(date.from, { locale: fr, weekStartsOn: 1 });
      const endWeek = getWeek(date.to, { locale: fr, weekStartsOn: 1 });
      const startYear = date.from.getFullYear();
      const endYear = date.to.getFullYear();
  
      const formatWeek = (year, week) => `${year}-W${week.toString().padStart(2, "0")}`;
  
      setWeekRange(
        startWeek === endWeek && startYear === endYear
          ? `Semaine ${startWeek} (${startYear})`
          : `Semaines ${startWeek} (${startYear}) - ${endWeek} (${endYear})`
      );
  
      if (typeof setSelectedWeek === "function") {
        setSelectedWeek(
          startWeek === endWeek && startYear === endYear
            ? formatWeek(startYear, startWeek)
            : `${formatWeek(startYear, startWeek)}-${formatWeek(endYear, endWeek)}`
        );
      }
    }
  }, [date, setSelectedWeek]);
  

  // Fonction pour obtenir la semaine actuelle
  const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
    const week = getWeek(now, { locale: fr, weekStartsOn: 1 }); // Utilise le lundi comme début de semaine
    return { year, week };
  };

  // Calcul de la semaine actuelle et mise à jour de la sélection
  useEffect(() => {
    const { year, week } = getCurrentWeek();
    setWeekRange(`Semaine ${week} (${year})`);
    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`${year}-W${week}`);
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
      setData(data); // ✅ Assurez-vous que setData est passé en prop
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setData([]); // ✅ Réinitialisation des données en cas d'erreur
    }
  };

  // Met à jour la semaine et les dates lorsque la navigation change
  const updateWeek = (weeksToAdd) => {
    const newFrom = addWeeks(date.from, weeksToAdd);
    const newTo = endOfWeek(newFrom, { weekStartsOn: 1 });

    setDate({ from: newFrom, to: newTo });

    const newWeek = getWeek(newFrom, { locale: fr, weekStartsOn: 1 });
    const year = newFrom.getFullYear(); // Année dynamique
    setWeekRange(`Semaine ${newWeek} (${year})`);

    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`${year}-W${newWeek}`);
    }
  };

  // Initialisation de la semaine actuelle
  useEffect(() => {
    const { year, week } = getCurrentWeek();
    setWeekRange(`Semaine ${week} (${year})`);
    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`${year}-W${week}`);
    }
  }, [setSelectedWeek]);

  // Gestion des changements manuels de date
  const handleDateChange = (field, selectedDate) => {
    const newWeek = getWeek(selectedDate, { locale: fr, weekStartsOn: 1 });
    const year = selectedDate.getFullYear(); // Année dynamique

    setDate((prevDate) => ({
      ...prevDate,
      [field]: selectedDate,
    }));

    setWeekRange(`Semaine ${newWeek} (${year})`);

    if (typeof setSelectedWeek === "function") {
      setSelectedWeek(`${year}-W${newWeek}`);
    }
  };

  useEffect(() => {
    onSubmit({ from: date.from, to: date.to });
  }, [date.from, date.to]);
  


    
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
