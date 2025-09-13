"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Básico",
        price: 9,
        storage: "100 MB",
        features: ["~ 20 músicas", "Acesso de qualquer lugar"],
    },
    {
        name: "Padrão",
        price: 15,
        storage: "250 MB",
        features: ["~ 50 músicas", "Acesso de qualquer lugar"],
        popular: true,
    },
    {
        name: "Plus",
        price: 29,
        storage: "500 MB",
        features: ["~ 100 músicas", "Acesso de qualquer lugar", "Suporte prioritário"],
    },
    {
        name: "Premium",
        price: 45,
        storage: "1 GB",
        features: ["~ 200 músicas", "Acesso de qualquer lugar", "Suporte prioritário"],
    },
];

export default function CloudPage() {
    return (
        <div className="p-4 sm:p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Armazenamento na Nuvem</h1>
                <p className="text-muted-foreground mt-2">Salve suas músicas e ouça de qualquer dispositivo. Escolha o plano ideal para você.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.name} className={plan.popular ? "border-primary" : ""}>
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>
                                <span className="text-3xl font-bold">R$ {plan.price}</span>
                                <span className="text-muted-foreground"> / mês</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center bg-muted/50 font-bold p-3 rounded-lg">
                                {plan.storage} de Armazenamento
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled>
                                Escolher Plano (Em Breve)
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-8">
                Para usuários gratuitos, as músicas ficam salvas apenas no dispositivo atual (armazenamento local).
            </p>
        </div>
    );
}
