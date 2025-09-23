"use client"

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
import { useRouter } from 'next/navigation'
import useUserStore from '@/store/userStore';
import { useEffect, useState } from "react";
import { baseURL } from "@/utils/baseURL";

const Connexion = () => {
  const form = useForm({
    defaultValues: {
      mail: "",
      mdp: ""
    }
  });
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const userState = useUserStore();

  const router = useRouter();

  useEffect(() => {
    // Si déjà connecté, on redirige vers l'index
    if (localStorage.getItem("token") && localStorage.getItem("userLevel")) {
      router.push('/');
    }
  }, []);

  const onSubmit = async (event) => {
    const { mail, mdp } = event;

    const user = await fetch(`${baseURL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: mail, password: mdp }),
    });

    const responseUser = await user.json();

    if (!user.ok) {
      console.log(responseUser);
      setError(true);
      throw new Error('Erreur lors de l\'appel API');
    }

    if (responseUser) {
      // Si token, on le stocke en local
      const { token, userLevel } = responseUser;
      userState.setUser({ token: token, userLevel: userLevel });
      localStorage.setItem("token", token);
      localStorage.setItem("userLevel", parseInt(userLevel));
      router.push('/');
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
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Votre mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <label htmlFor="showPassword" className="text-sm text-gray-600">
                        Afficher le mot de passe
                      </label>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="reset" variant="outline">Annuler</Button>
                <Button type="submit" className="bg-sky-950 hover:bg-sky-700">Connexion</Button>
              </div>
              {error && <div className="text-red-600">{"Le mdp ou l'email ne sont pas bon."}</div>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Connexion;
