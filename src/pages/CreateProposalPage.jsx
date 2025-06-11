// src/pages/CreateProposalPage.jsx
import ProposalForm from '../pages/ProposalForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addProposal } from '../features/proposalSlice';
import { useDispatch } from 'react-redux';

const CreateProposalPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreate = async (data) => {
    try {
      const finalData = {
        name: 'Jane Doe', // Replace with actual user data
        email: 'test@gmail.com', // Replace with actual user data
        ...data,
      };
      await axios.post('http://localhost:5000/api/proposals/createProposal', finalData);
      // Optionally dispatch an action to update the Redux store
      dispatch(addProposal(finalData));
      navigate('/profile');
    } catch (err) {
      console.error('Failed to create proposal:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Proposal</h2>
      <ProposalForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProposalPage;
