import { createContext, useState, ReactNode } from "react";

interface TourStep {
  step: number;
  description: string;
}

interface TourContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  tourSteps: TourStep[];
  isActive: boolean;
  completeTour: () => void;
}

export const TourContext = createContext<TourContextType>({
  currentStep: 1,
  setCurrentStep: () => {},
  tourSteps: [],
  isActive: false,
  completeTour: () => {},
});

const initialTourSteps: TourStep[] = [
  {
    step: 1,
    description: "Clears the existing workflow and starts a new one",
  },
  {
    step: 2,
    description: "Save the Current workflow into a file on your computer.",
  },
  {
    step: 3,
    description: "Import a previously exported workflow file into the editor.",
  },
  {
    step: 4,
    description: "Save the Current workflow as an image on your computer"
  },
];

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const completeTour = () => {
    setIsActive(false);
    setCurrentStep(1);
  };

  const value = {
    currentStep,
    setCurrentStep,
    tourSteps: initialTourSteps,
    isActive,
    completeTour,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};
