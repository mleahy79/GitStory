import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import FunnelProgressBar from "../../shared/FunnelProgressBar";
import TrialStep1 from "./steps/TrialStep1";
import TrialStep2 from "./steps/TrialStep2";
import TrialStep3 from "./steps/TrialStep3";

const STEPS = [TrialStep1, TrialStep2, TrialStep3];

const TrialPage = () => {
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
      navigate(`/trial/${stepIndex + 1}`);
    }
  };

  if (!StepComponent) {
    navigate("/trial/1");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0A1828] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <FunnelProgressBar
          currentStep={stepIndex}
          totalSteps={3}
          label="Almost there"
        />
        <StepComponent onNext={handleNext} />
      </div>
    </main>
  );
};

export default TrialPage;
