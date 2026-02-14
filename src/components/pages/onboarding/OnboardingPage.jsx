import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import FunnelProgressBar from "../../shared/FunnelProgressBar";
import OnboardingStep1 from "./steps/OnboardingStep1";
import OnboardingStep2 from "./steps/OnboardingStep2";
import OnboardingStep3 from "./steps/OnboardingStep3";
import OnboardingStep4 from "./steps/OnboardingStep4";

const STEPS = [OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4];

const OnboardingPage = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const stepIndex = parseInt(step, 10);
  const StepComponent = STEPS[stepIndex - 1];

  // Redirect authenticated users straight to the app
  useEffect(() => {
    if (!loading && user) {
      navigate("/chat");
    }
  }, [user, loading, navigate]);

  const handleNext = () => {
    if (stepIndex < STEPS.length) {
      navigate(`/onboarding/${stepIndex + 1}`);
    } else {
      navigate("/trial/1");
    }
  };

  const handleBack = () => {
    if (stepIndex > 1) {
      navigate(`/onboarding/${stepIndex - 1}`);
    } else {
      navigate("/");
    }
  };

  if (!StepComponent) {
    navigate("/onboarding/1");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0A1828] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <FunnelProgressBar
          currentStep={stepIndex}
          totalSteps={4}
          label="Tell us about your codebase"
        />
        <StepComponent onNext={handleNext} onBack={handleBack} />
      </div>
    </main>
  );
};

export default OnboardingPage;
