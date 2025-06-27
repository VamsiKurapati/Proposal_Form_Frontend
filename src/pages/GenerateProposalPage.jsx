import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProposalEditor from "../pages/ProposalEditor";

export default function GenerateProposalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const rfpData = location.state?.proposalData;

  const [proposalData, setProposalData] = useState(null);

  useEffect(() => {
    if (!rfpData) {
      navigate("/rfp_discovery");
      return;
    }

    const generateInitialProposal = async () => {
      try {
        setProposalData({
          coverLetter: {
            recipient: "",
            organization: rfpData.organization || "",
            sender: {
              name: "",
              title: "",
              company: "",
              email: "",
              phone: "",
              address: ""
            },
            date: new Date().toISOString().split("T")[0],
            body: `This is a draft cover letter in response to the RFP titled '${rfpData.title}'.`
          },
          executiveSummary: {
            objective: "THadkn",
            keyOutcomes: "",
          },
          projectPlan: [
            { phase: "", timeline: "", deliverable: "" }
          ],
          partnership: {
            budgetRange: "",
            optionalAddOns: [],
            contact: ""
          },
          references: [
            { project: "", client: "", outcome: "" }
          ]
        });
      } catch (err) {
        console.error("Failed to generate proposal:", err);
      }
    };

    generateInitialProposal();
  }, [rfpData, navigate]);

  if (!proposalData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading proposal editor...
      </div>
    );
  }

  return <ProposalEditor proposalData={proposalData} />;
}
