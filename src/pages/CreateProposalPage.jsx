// src/pages/CreateProposalPage.jsx
import ProposalForm from '../pages/ProposalForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addProposal } from '../features/proposalSlice';

const CreateProposalPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreate = async (formData) => {
    try {
      formData.append('name', 'Jane Doe');
      formData.append('email', 'test@gmail.com');

      const res = await axios.post('https://proposal-form-backend.vercel.app/api/proposals/createProposal', formData);
      dispatch(addProposal(res.data));
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