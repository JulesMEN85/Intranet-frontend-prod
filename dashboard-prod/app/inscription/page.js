"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { baseURL } from "@/utils/baseURL";

const Inscription = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      roleId: "",
    },
  });

  const router = useRouter();

  const onSubmitUser = async (event) => {
    const { email, password, roleId } = event;

    try {
      const user = await fetch(`${baseURL}/api/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, roleId }),
      });

      // Vérifie si l'appel à l'API a échoué
      if (!user.ok) {
        const errorText = await user.text();
        throw new Error(`Erreur API : ${user.status} - ${errorText}`);
      }

      const responseUser = await user.json();

      // Si tout est correct, redirige l'utilisateur
      if (responseUser) {
        router.push("/"); // Changez "/success" par la route souhaitée
      }
    } catch (err) {
      alert("Une erreur s'est produite lors de l'inscription. Vérifiez les données et réessayez."); // Notification utilisateur
    }
  };

  return (
    <main className="flex items-center flex-col p-24 max-xl:p-10 bg-sky-950 min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Créer compte</CardTitle>
          <CardDescription>Permet de créer un compte utilisateur</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitUser)} className="space-y-5">
              {/* Champ Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Un email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Champ Mot de passe */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Un mot de passe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Champ Role */}
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>{"Niveau d'autorisation"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1- accès total</SelectItem>
                        <SelectItem value="2">2- accès comptabilité</SelectItem>
                        <SelectItem value="3">3- accès vente</SelectItem>
                        <SelectItem value="4">4- accès achat</SelectItem>
                        <SelectItem value="5">5- accès atelier</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Boutons */}
              <div className="flex justify-between">
                <Button type="reset" variant="outline">
                  Annuler
                </Button>
                <Button type="submit" className="bg-sky-950 hover:bg-sky-700">
                  Inscription
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Inscription;
