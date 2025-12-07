import React, { useState } from 'react';
import { X, Home, MapPin } from 'lucide-react';

interface AddHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHouseholdAdded: () => void;
}

const AddHouseholdModal: React.FC<AddHouseholdModalProps> = ({ isOpen, onClose, onHouseholdAdded }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 10,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const householdData = {
        name: formData.name,
        description: formData.description,
        maxMembers: parseInt(formData.maxMembers.toString()),
        address: {
          street: formData.street || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: formData.zipCode || null,
          country: formData.country || null,
        },
        rules: [],
      };

      const response = await fetch('http://localhost:8080/api/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(householdData),
      });

      if (response.ok) {
        alert('Household created successfully!');
        onHouseholdAdded();
        resetForm();
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed to create household: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating household:', error);
      alert('Error creating household. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      maxMembers: 10,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
              <Home className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gradient-heading">Create New Household</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Household Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="e.g., Downtown Apartment"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              rows={3}
              placeholder="Brief description of your household..."
              maxLength={500}
            />
          </div>

          {/* Max Members */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Members
            </label>
            <input
              type="number"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleInputChange}
              min="1"
              max="50"
              className="input-field"
              aria-label="Maximum number of members"
            />
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold">Address (Optional)</h3>
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="input-field"
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="NY"
                />
              </div>
            </div>

            {/* ZIP and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Household'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHouseholdModal;
