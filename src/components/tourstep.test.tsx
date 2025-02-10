import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import { TourContext } from '../contexts/TourContext';
import TourStep from './tourstep';

const createWrapper = (value: {
  currentStep: number;
  isActive: boolean;
  tourSteps: Array<{ step: number; element: string; description: string; }>;
  setCurrentStep: (step: number) => void;
  completeTour: () => void;
}) => {
  return ({ children }: { children: ReactNode }) => (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

describe('TourStep', () => {
  const mockTourStep = {
    step: 1,
    element: "Test Element",
    description: "Test Description"
  };

  it('renders children without tooltip when tour is not active', () => {
    const wrapper = createWrapper({
      currentStep: 1,
      isActive: false,
      tourSteps: [mockTourStep],
      setCurrentStep: jest.fn(),
      completeTour: jest.fn()
    });

    render(<TourStep step={1}><div>Test Content</div></TourStep>, { wrapper });
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders tooltip when tour is active and step matches', () => {
    const wrapper = createWrapper({
      currentStep: 1,
      isActive: true,
      tourSteps: [mockTourStep],
      setCurrentStep: jest.fn(),
      completeTour: jest.fn()
    });

    render(<TourStep step={1}><div>Test Content</div></TourStep>, { wrapper });
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls setCurrentStep when next is clicked and there is a next step', () => {
    const setCurrentStep = jest.fn();
    const wrapper = createWrapper({
      currentStep: 1,
      isActive: true,
      tourSteps: [
        mockTourStep,
        { step: 2, element: "Next Element", description: "Next Description" }
      ],
      setCurrentStep,
      completeTour: jest.fn()
    });

    render(<TourStep step={1}><div>Test Content</div></TourStep>, { wrapper });
    
    fireEvent.click(screen.getByText('Next'));
    expect(setCurrentStep).toHaveBeenCalledWith(2);
  });

  it('calls completeTour when skip is clicked', () => {
    const completeTour = jest.fn();
    const wrapper = createWrapper({
      currentStep: 1,
      isActive: true,
      tourSteps: [mockTourStep],
      setCurrentStep: jest.fn(),
      completeTour
    });

    render(<TourStep step={1}><div>Test Content</div></TourStep>, { wrapper });
    
    fireEvent.click(screen.getByText('Skip'));
    expect(completeTour).toHaveBeenCalled();
  });

  it('calls completeTour when next is clicked on last step', () => {
    const completeTour = jest.fn();
    const wrapper = createWrapper({
      currentStep: 1,
      isActive: true,
      tourSteps: [mockTourStep],
      setCurrentStep: jest.fn(),
      completeTour
    });

    render(<TourStep step={1}><div>Test Content</div></TourStep>, { wrapper });
    
    fireEvent.click(screen.getByText('Next'));
    expect(completeTour).toHaveBeenCalled();
  });
});
