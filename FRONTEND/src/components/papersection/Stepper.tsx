import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4 sm:px-0 select-none">
      <div
        className="flex items-center justify-between
        rounded-2xl
        bg-white
        border border-slate-200
        shadow-sm
        px-4 py-5 sm:px-8 sm:py-6"
      >
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div className="flex items-center justify-center">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 group">
                  {/* Status Circle */}
                  <div
                    className={`flex items-center justify-center
                    w-8 h-8 sm:w-10 sm:h-10
                    rounded-full text-sm font-bold transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : isActive
                        ? "border-2 border-emerald-600 text-emerald-700 bg-emerald-50 ring-2 ring-emerald-100 ring-offset-2"
                        : "border border-slate-200 text-slate-400 bg-slate-50"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-300" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  {/* Desktop Label */}
                  <span
                    className={`hidden sm:block text-xs font-bold uppercase tracking-wider transition-colors duration-300
                    ${
                      isCompleted || isActive
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div className="flex-1 px-2 sm:px-4">
                  <div className="h-[2px] w-full rounded-full bg-slate-100 relative overflow-hidden">
                    <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out ${
                            step.id < currentStep ? "w-full bg-emerald-500" : "w-0"
                        }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile-only Progress Indicator */}
      <div className="mt-4 text-center sm:hidden animate-in fade-in slide-in-from-top-2">
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">
          Step {currentStep} of {steps.length}
        </p>
        <p className="text-sm font-semibold text-slate-600 mt-2">
          {steps.find((s) => s.id === currentStep)?.title}
        </p>
      </div>
    </div>
  );
}