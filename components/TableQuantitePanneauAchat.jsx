"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import axios from "axios";
import { baseURL } from "@/utils/baseURL";
import { getDateWithFormatAPI } from "@/utils/formatNumber";
import Alert from "@/components/Alert";
import LoaderTable from "@/components/LoaderTable";

const QuantitePanneauAchatTable = () => {
    const methods = useForm({
        defaultValues: {
            startDate: "",
            endDate: "",
        },
    });

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [justReset, setJustReset] = useState(false);
    const [loading, setLoading] = useState(false);
    const fetchData = async (formData) => {
        if (justReset) {
            setJustReset(false);
            return;
        }
        const { startDate, endDate } = formData;
        if (!startDate || !endDate) {
            setError({
                code: "INVALID_INPUT",
                message: "Veuillez sélectionner une date de début et une date de fin.",
            });
            setSuccess(null);
            return;
        }
        setError(null);
        setSuccess(null);
        setLoading(true); // Début du chargement
        try {
            const formattedStartDate = getDateWithFormatAPI(startDate);
            const formattedEndDate = getDateWithFormatAPI(endDate);
            const url = `${baseURL}/api/panels/quantity?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
            const response = await axios.get(url);
            setData(response.data);
        } catch (e) {
            setError({
                code: e.response?.status || "ERROR",
                message: e.response?.data?.error || "Une erreur s'est produite.",
            });
            setSuccess(null);
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    const onSubmit = (formData) => {
        fetchData(formData);
    };

    const resetFilters = () => {
        methods.reset();
        setData([]);
        setError(null);
        setSuccess(null);
        setJustReset(true);
    };

    const exportToCSV = () => {
        setError(null);
        setSuccess(null);
        try {
            if (!data.length) {
                setError({ code: "NO_DATA", message: "Aucune donnée à exporter !" });
                return;
            }
            const { startDate, endDate } = methods.getValues();
            const dateLine = `"Date de debut";${startDate || ""}\n"Date de fin";${endDate || ""
                }\n`;
            const header = Object.keys(data[0]).join(";") + "\n";
            const rows = data
                .map((row) => [row.code, row.description, row.quantite].join(";"))
                .join("\n");
            const csvContent = dateLine + header + rows;
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const filename = `quantite_panneau_achat_${startDate?.replaceAll("-", "") || "xx"
                }_${endDate?.replaceAll("-", "") || "xx"}.csv`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError({ code: "EXPORT_FAIL", message: "L'export du CSV a échoué." });
        }
    };

    return (
        <FormProvider {...methods}>
            {error && <Alert codeError={error.code}>{error.message}</Alert>}
            {success && <Alert codeError={success.code}>{success.message}</Alert>}

            <form onSubmit={methods.handleSubmit(onSubmit)} className="mb-4">
                <div className="flex flex-row items-end space-x-4">
                    <FormField
                        control={methods.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Date de début</FormLabel>
                                <FormControl>
                                    <input
                                        type="date"
                                        {...field}
                                        className="border border-gray-300 rounded p-2 bg-white text-black"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={methods.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Date de fin</FormLabel>
                                <FormControl>
                                    <input
                                        type="date"
                                        {...field}
                                        className="border border-gray-300 rounded p-2 bg-white text-black"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="h-10">
                        Rechercher
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={resetFilters}
                        className="h-10"
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        type="button"
                        onClick={exportToCSV}
                        className="h-10 bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                        Exporter
                    </Button>
                </div>
            </form>

            <table className="min-w-full border-collapse border border-gray-200 bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border border-gray-300 text-center">
                            Code
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-center">
                            Description
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-center">
                            Quantité Panneaux
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={3} className="text-center p-4 bg-white">
                                <LoaderTable />
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2 bg-white text-center hover:bg-gray-200">
                                    {item.code}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 bg-white text-center hover:bg-gray-200">
                                    {item.description}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 bg-white text-center hover:bg-gray-200">
                                    {item.quantite}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center p-4 bg-white">
                                Aucune donnée disponible
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </FormProvider>
    );
};

export default QuantitePanneauAchatTable;
