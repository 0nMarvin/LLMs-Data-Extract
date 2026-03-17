import React, { useState } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import StepTheme from './components/Steps/StepTheme';
import StepSetup from './components/Steps/StepSetup';
import StepExtraction from './components/Steps/StepExtraction';
import { useTags } from './viewmodels/useTags';

const App = () => {
  const escopo = useTags(["Apenas residentes em Londrina"]);
  const exclusao = useTags([]);

  const [step, setStep] = useState(1);
  const [tema, setTema] = useState("");
  const [qtdObjetos, setQtdObjetos] = useState(10);
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleThemeConfirm = (novoTema) => {
    setTema(novoTema);
    setStep(2);
  };

  const handleGerar = async (qtd) => {
    setQtdObjetos(qtd);
    setResultado(null);
    setIsLoading(true);
    setStep(3);

    // substituir pela chamada real à IA
    await new Promise((r) => setTimeout(r, 2000));
    setResultado(`1. Miles Davis — Pioneiro do cool jazz e jazz fusion.\n\n2. John Coltrane — "A Love Supreme" é um marco do jazz moderno.\n\n3. Ella Fitzgerald — Mestre do scat singing.\n\n4. Duke Ellington — Compôs mais de 1.000 obras.\n\n5. Herbie Hancock — Jazz acústico, fusion e funk.`);
    setIsLoading(false);
  };

  const handleNovaLista = () => {
    setResultado(null);
    setIsLoading(false);
    setStep(1);
  };

  return (
    <div className="bg-page-bg min-h-screen">
      <Header />
      <SideBar />

      {step === 1 && (
        <StepTheme onConfirm={handleThemeConfirm} />
      )}

      <main className="p-8 max-w-5xl mx-auto pt-24">

        {step >= 2 && (
          <StepSetup
            tema={tema}
            escopo={escopo}
            exclusao={exclusao}
            onBack={() => setStep(1)}
            onNext={handleGerar}
          />
        )}

        {step === 3 && (
          <StepExtraction
            tema={tema}
            quantidade={qtdObjetos}
            resultado={resultado}
            isLoading={isLoading}
            onBack={() => setStep(2)}
            onNewList={handleNovaLista}
          />
        )}

      </main>
    </div>
  );
};

export default App;