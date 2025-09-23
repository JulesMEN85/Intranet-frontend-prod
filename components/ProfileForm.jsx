'use client'

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfileForm = ({onSubmit, userLevel}) => {
  const form = useForm();
  userLevel = parseInt(userLevel);

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="entreprise"
          render={({ field }) => (
            <FormItem className="flex space-x-2">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Entreprise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CDE HT">CDE HT</SelectItem>
                  <SelectItem value="BL HT">BL HT</SelectItem>
                  <SelectItem value="FACT HT">FACT HT</SelectItem>
                </SelectContent>
              </Select>

              {field.value ? 
                <Button type="submit" variant='outline' onClick={() => console.log("Formulaire soumis")}>Valider</Button>
              :
                <Button type="button" variant="disabled">Valider</Button>
              }
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default ProfileForm;
