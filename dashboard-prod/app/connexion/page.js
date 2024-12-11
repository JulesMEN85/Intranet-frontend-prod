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
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { baseURL } from "@/utils/baseURL";

const Connexion = () => {
  const form = useForm({
    defaultValues: {
      mail: "",
      mdp: "",
    },
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const userState = useUserStore();

  const router = useRouter();

  useEffect(() => {
    // si déjà connecté on redirige vers l'index
    if (localStorage.getItem("token") && localStorage.getItem("userLevel")) {
      router.push("/");
    }
  }, [router]); // Ajout de 'router' dans les dépendances

  const onSubmit = async (event) => {
    const { mail, mdp } = event;

    try {
      const user = await fetch(`${baseURL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mail, password: mdp }),
      });

      if (!user.ok) {
        const errorResponse = await user.text();
        setError(true);
        setErrorMessage("Erreur lors de la connexion. Vérifiez vos identifiants.");
        return;
      }

      const responseUser = await user.json();

      // Si réponse valide, stocke les données en local
      const { token, userLevel } = responseUser;
      userState.setUser({ token: token, userLevel: userLevel });
      localStorage.setItem("token", token);
      localStorage.setItem("userLevel", parseInt(userLevel));

      router.push("/");
    } catch (err) {
      setError(true);
      setErrorMessage("Impossible de se connecter au serveur. Vérifiez votre réseau.");
    }
  };

  return (
    <main className="flex items-center flex-col p-24 max-xl:p-10 bg-sky-950 min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Connectez-vous</CardTitle>
          <CardDescription>Afin d’accéder aux différentes parties du site</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Votre email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mdp"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Votre mot de passe" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="reset" variant="outline">
                  Annuler
                </Button>
                <Button type="submit" className="bg-sky-950 hover:bg-sky-700">
                  Connexion
                </Button>
              </div>
              {error && <div className="text-red-600">{errorMessage}</div>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Connexion;
