"use client";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormLabel, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "./ui/button";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { baseURL } from "@/utils/baseURL";
import { getDateWithFormatAPI } from "@/utils/formatNumber";

const FournisseurFilter = ({ setData, setOrderData }) => {
  const currentDate = Date.now();
  const [date, setDate] = useState({
    from: addDays(new Date(currentDate), -7),
    to: new Date(currentDate),
  });

  const form = useForm({
    defaultValues: {
      from: date.from,
      to: date.to,
      nCommande: "",
      serie: ""
    }
  });

  const onSubmit = async (event) => {
    const { from, to, nCommande, serie } = event;
    setData("Chargement en cours");
    setOrderData("Chargement en cours");
  
    try {
      // Construction de l'URL avec les paramètres optionnels
      let url = `${baseURL}/commande/achat?from=${getDateWithFormatAPI(from)}&to=${getDateWithFormatAPI(to)}`;
      if (nCommande) url += `&nCommande=${encodeURIComponent(nCommande)}`;
      if (serie) url += `&serie=${encodeURIComponent(serie)}`;
  
      // Requête vers l'API
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
  
      const responseOrder = await response.json();
      setData(responseOrder);
      setOrderData(responseOrder);
    } catch (error) {
      console.error(error);
      setData("Erreur lors de la récupération des données");
      setOrderData([]);
    }
  };  

  return (
    <div className='flex px-2 pt-2 pb-4 bg-sky-800 space-x-2'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full space-x-5 justify-center max-[730px]:flex-wrap">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="flex flex-col max-[730px]:my-2">
                <FormLabel className='text-sky-50 my-2' >Du</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal max-xl:max-w-40 max-[860px]:max-w-32",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/y")
                        ) : (
                          format(date.from, "dd/MM/y")
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("2021-01-01")
                      }
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="flex flex-col max-[730px]:my-2">
                <FormLabel className='text-sky-50 my-2' >{"Jusqu'au"}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal max-xl:max-w-40 max-[860px]:max-w-32",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/y")
                        ) : (
                          format(date.to, "dd/MM/y")
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("2021-01-01")
                      }
                      initialFocus
                      defaultMonth={date?.to}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nCommande"
            render={({ field }) => (
              <FormItem className="flex flex-col max-[730px]:my-2">
                <FormLabel className='text-sky-50 my-2' >N° commande d&apos;achat</FormLabel>
                <FormControl>
                  <Input className='w-36 max-xl:max-w-40 max-[860px]:max-w-32' placeholder='N°commande' {...field} />
                </FormControl> 
              </FormItem>
            )}
          />

          <div className="flex items-end max-[730px]:my-2">
            <Button type='submit' variant="outline" >Rechercher</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FournisseurFilter;
