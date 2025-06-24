import ProposalEditor from "./ProposalEditor";

const jsonData = {
  title: "AI in Agriculture",
  organization: "GovTech India",
  deadline: "2025-08-01",
  summary: "Proposal to use AI/ML in improving crop yield predictions across India..."
};

export default function ProposalPage() {
    
  return <ProposalEditor proposalData={jsonData} />;
}
