import { ReactNode, useContext, MouseEvent } from "react";
import { TourContext } from "../contexts/TourContext";
import Tooltip from "./tooltip";

interface TourStepProps {
  step: number;
  children?: ReactNode;
}

const TourStep = ({ step, children }: TourStepProps) => {
  const { currentStep, setCurrentStep, tourSteps, isActive, completeTour } =
    useContext(TourContext);

  if (!isActive || currentStep !== step) {
    return null;
  }

  const currentTourStep = tourSteps.find((t) => t.step === step);
  if (!currentTourStep) {
    return null;
  }

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const nextStep = tourSteps.find((t) => t.step > step);
    if (nextStep) {
      setCurrentStep(nextStep.step);
    } else {
      completeTour();
    }
  };

  const handlePrev = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const prevStep = [...tourSteps].reverse().find((t) => t.step < step);
    if (prevStep) {
      setCurrentStep(prevStep.step);
    }
  };

  const handleSkip = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    completeTour();
  }

  return (
    <div style={{ position: "relative" }}>
      {children}
      <div 
        style={{ position: "relative" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Tooltip>
          <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            {currentTourStep.description}
            <div
              style={{
                paddingTop: "10px",
                left: "50%",
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.9em",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                  }}
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                style={{
                  padding: "4px 8px",
                  fontSize: "0.9em",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                Next
              </button>
              <button
                onClick={handleSkip}
                style={{
                  padding: "4px 8px",
                  fontSize: "0.9em",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                Skip
              </button>
            </div>
            <div style={{ marginTop: "8px", fontSize: "0.9em", color: "#666" }}>
              Step {step} of {tourSteps.length}
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default TourStep;
