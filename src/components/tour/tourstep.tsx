import { ReactNode, useContext, MouseEvent } from "react";
import { TourContext } from "../../contexts/TourContext";
import Tooltip from "./tooltip";
import "./tourstep.css";

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
    <div className="tourstep-container">
      {children}
      <div 
        className="tourstep-tooltip-wrapper"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Tooltip>
          <div 
            className="tourstep-content"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {currentTourStep.description}
            <div className="tourstep-buttons">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="tourstep-button"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="tourstep-button"
              >
                Next
              </button>
              <button
                onClick={handleSkip}
                className="tourstep-button"
              >
                Skip
              </button>
            </div>
            <div className="tourstep-progress">
              Step {step} of {tourSteps.length}
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default TourStep;
