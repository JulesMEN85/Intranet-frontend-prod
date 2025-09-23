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
import { baseURL } from "@/utils/baseURL";
import { useState } from "react";

const Inscription = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      roleId: [], // Tableau pour gérer plusieurs rôles
    },
  });

  const [selectedRoles, setSelectedRoles] = useState([]); // État pour gérer les rôles sélectionnés
  const router = useRouter();

  const handleRoleChange = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const onSubmitUser = async (event) => {
    const { email, password } = event;
    const roleId = selectedRoles; // Utilise l'état des rôles sélectionnés

    try {
      const user = await fetch(`${baseURL}/api/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, roleId }),
      });

      if (!user.ok) {
        throw new Error("Erreur lors de l'appel API");
      }

      const responseUser = await user.json();

      if (responseUser) {
        console.log("Réponse de l'utilisateur :", responseUser);
        router.push("/"); // Rediriger après inscription
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Un mot de passe"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormItem className="flex flex-col space-y-2">
                <FormLabel>{"Niveaux d'autorisation"}</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-1">
                    {[
                      { id: 1, label: "1- accès total" },
                      { id: 2, label: "2- accès comptabilité" },
                      { id: 3, label: "3- accès vente" },
                      { id: 4, label: "4- accès achat" },
                      { id: 5, label: "5- accès atelier" },
                      { id: 6, label: "6- achat / comptabilité" },
                    ].map((role) => (
                      <label key={role.id} className="flex items-center">
                        <input
                          type="checkbox"
                          value={role.id}
                          onChange={() => handleRoleChange(role.id)}
                          checked={selectedRoles.includes(role.id)}
                          className="mr-2"
                        />
                        {role.label}
                      </label>
                    ))}
                  </div>
                </FormControl>
              </FormItem>

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
