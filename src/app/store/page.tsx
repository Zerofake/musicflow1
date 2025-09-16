"use client";

import { useMusic } from "@/hooks/useMusic";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const coinPackages = [
    { name: "100 Coins", price: "$0.99" },
    { name: "250 Coins", price: "$1.99" },
];

export default function StorePage() {
    const { coins, spendCoins } = useMusic();
    const { toast } = useToast();
    const [minutes, setMinutes] = useState(10);
    const coinsToSpend = minutes / 10;

    const handleUseCoins = () => {
        if (spendCoins(coinsToSpend)) {
            toast({
                title: "Anúncios Removidos!",
                description: `Você está livre de anúncios por ${minutes} minutos.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Moedas Insuficientes",
                description: "Você não tem moedas suficientes para remover os anúncios.",
            });
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Loja</h1>
                <p className="text-muted-foreground mt-2">Adquira moedas ou assine para remover anúncios.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Suas Moedas</CardTitle>
                        <div className="flex items-center gap-2 font-bold text-lg text-primary">
                            <Coins className="h-5 w-5" />
                            <span>{coins}</span>
                        </div>
                    </div>
                    <CardDescription>Use suas moedas para ter uma experiência sem anúncios.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-muted/50 p-4">
                        <div className="text-center sm:text-left">
                           <p className="font-semibold">Remover anúncios temporariamente</p>
                           <p className="text-sm text-muted-foreground">Custo: 1 moeda a cada 10 minutos.</p>
                        </div>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Usar Moedas
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Remover Anúncios</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Você tem {coins} moedas. Cada 10 minutos sem anúncios custam 1 moeda.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex items-center gap-4 my-4">
                                     <input 
                                        type="range" 
                                        min="10" 
                                        max={coins * 10} 
                                        step="10" 
                                        value={minutes}
                                        onChange={(e) => setMinutes(Number(e.target.value))}
                                        className="w-full"
                                        disabled={coins === 0}
                                    />
                                    <span className="font-bold text-lg">{minutes} min</span>
                                </div>
                                <p className="text-center font-semibold text-primary">Custo: {coinsToSpend} moeda(s)</p>

                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleUseCoins} disabled={coins < coinsToSpend || coins === 0}>Confirmar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Comprar Moedas</CardTitle>
                     <CardDescription>Adquira moedas para usar na loja do aplicativo.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {coinPackages.map((pkg) => (
                        <Button key={pkg.name} variant="outline" className="h-auto py-4 flex-col" disabled>
                            <span className="text-lg font-bold flex items-center gap-2"><Coins className="h-5 w-5" />{pkg.name}</span>
                            <span className="text-sm text-muted-foreground">{pkg.price}</span>
                        </Button>
                    ))}
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground text-center w-full">Em breve.</p>
                </CardFooter>
            </Card>
            
            <Card className="bg-primary/10 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck /> Assinatura Premium</CardTitle>
                     <CardDescription>Uma experiência totalmente livre de interrupções.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">✓ Remoção de todos os anúncios.</li>
                        <li className="flex items-center gap-2">✓ Remoção da seção de doação.</li>
                    </ul>
                </CardContent>
                <CardFooter className="flex-col gap-2 items-stretch">
                     <Button className="w-full" disabled>
                        Assine por $1.99/mês (Em Breve)
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
