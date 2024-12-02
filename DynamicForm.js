import React, { useState } from "react";

const DynamicForm = () => {
  const [formType, setFormType] = useState(""); // Selected form type
  const [fields, setFields] = useState([]); // Dynamic fields for the selected form
  const [formData, setFormData] = useState({}); // Captured form data
  const [submittedData, setSubmittedData] = useState({}); // Submitted data grouped by form type
  const [editMode, setEditMode] = useState({ isEditing: false, formType: "", index: -1 }); // Edit state

  // Mock API response based on form type
  const formTemplates = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  // Handle form type change
  const handleFormTypeChange = (e) => {
    const selectedForm = e.target.value;
    setFormType(selectedForm);
    setFields(formTemplates[selectedForm]?.fields || []);
    setFormData({});
    setEditMode({ isEditing: false, formType: "", index: -1 });
  };

  // Handle input change
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode.isEditing) {
      // Update existing record
      setSubmittedData((prev) => {
        const updatedData = { ...prev };
        updatedData[editMode.formType][editMode.index] = formData;
        return updatedData;
      });
      setEditMode({ isEditing: false, formType: "", index: -1 });
      alert("Changes saved successfully!");
    } else {
      // Add new record
      if (formType) {
        setSubmittedData((prev) => ({
          ...prev,
          [formType]: [...(prev[formType] || []), formData],
        }));
        alert("Form submitted successfully!");
      }
    }
    setFormData({});
  };

  // Handle delete action
  const handleDelete = (formType, index) => {
    setSubmittedData((prev) => {
      const updatedFormTypeData = [...(prev[formType] || [])];
      updatedFormTypeData.splice(index, 1);
      return {
        ...prev,
        [formType]: updatedFormTypeData,
      };
    });
    alert("Entry deleted successfully!");
  };

  // Handle edit action
  const handleEdit = (formType, index) => {
    setEditMode({ isEditing: true, formType, index });
    setFormType(formType);
    setFields(formTemplates[formType]?.fields || []);
    setFormData(submittedData[formType][index]);
  };

  return (
    <div className="dynamic-form-container">
      <h1>Dynamic Form</h1>

      {/* Form Type Selector */}
      <div className="form-selection">
        <label htmlFor="form-type">Select Form Type: </label>
        <select id="form-type" value={formType} onChange={handleFormTypeChange}>
          <option value="">-- Select --</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>
      </div>

      {/* Dynamic Form */}
      {fields.length > 0 && (
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div className="form-field" key={index}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, field.name)}
                  required={field.required}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(e, field.name)}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button type="submit">{editMode.isEditing ? "Save Changes" : "Submit"}</button>
        </form>
      )}

      {/* Submitted Data Tables */}
      {Object.keys(submittedData).map((type) => {
        // Only show table if there's data for the current form type
        if (submittedData[type]?.length === 0) return null;
        return (
          <div key={type}>
            <h2>{type} Submissions</h2>
            <table>
              <thead>
                <tr>
                  {formTemplates[type]?.fields.map((field) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData[type]?.map((entry, index) => (
                  <tr key={index}>
                    {formTemplates[type]?.fields.map((field) => (
                      <td key={field.name}>{entry[field.name] || "-"}</td>
                    ))}
                    <td>
                      <button onClick={() => handleEdit(type, index)}>Edit</button>
                      <button onClick={() => handleDelete(type, index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
