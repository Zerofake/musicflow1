"use client";

import { useMusic } from '@/hooks/useMusic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const creditOptions = [
    { amount: 100, price: 5, bonus: "" },
    { amount: 250, price: 10, bonus: "Popular" },
    { amount: 500, price: 18, bonus: "+5% Bônus" },
    { amount: 1000, price: 30, bonus: "+10% Bônus" },
]

export default function SettingsPage() {
    const { credits, addCredits } = useMusic();

    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Créditos</h1>
                <div className="flex items-center gap-2 border border-yellow-500/50 bg-yellow-500/10 rounded-full px-3 py-1.5 text-sm">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-yellow-400">{credits}</span>
                </div>
            </div>
            
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Para que servem os créditos?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Créditos são usados para desbloquear funcionalidades extras no aplicativo. Atualmente, eles permitem que você crie mais de 6 playlists, com cada nova playlist custando 25 créditos.
                    </p>
                </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Comprar Créditos</h2>

            <div className="grid grid-cols-2 gap-4">
                {creditOptions.map(opt => (
                    <Card key={opt.amount} className={opt.bonus.includes("Popular") ? "border-primary" : ""}>
                        <CardHeader className="p-4">
                           <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-2xl">{opt.amount}</CardTitle>
                                <CardDescription>Créditos</CardDescription>
                             </div>
                             {opt.bonus && <div className="text-xs bg-primary/20 text-primary font-bold px-2 py-1 rounded-full">{opt.bonus}</div>}
                           </div>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                            <Button onClick={() => addCredits(opt.amount)} className="w-full">
                                R$ {opt.price.toFixed(2)}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

             <p className="text-center text-xs text-muted-foreground mt-8">
                As compras são simuladas. Nenhum dinheiro real será cobrado.
            </p>

        </div>
    )
}
