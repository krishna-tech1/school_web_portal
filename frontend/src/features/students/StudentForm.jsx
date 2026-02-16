import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Select, Button } from '../../components/ui';
import { createStudent, updateStudent } from './studentSlice';

const StudentForm = ({ mode = 'create', student = null, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        class: '',
        section: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        guardianName: '',
        guardianPhone: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (student && (mode === 'edit' || mode === 'view')) {
            setFormData({
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                email: student.email || '',
                phone: student.phone || '',
                class: student.class || '',
                section: student.section || '',
                dateOfBirth: student.dateOfBirth || '',
                gender: student.gender || '',
                address: student.address || '',
                guardianName: student.guardianName || '',
                guardianPhone: student.guardianPhone || '',
            });
        }
    }, [student, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.class) newErrors.class = 'Class is required';
        if (!formData.section) newErrors.section = 'Section is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required';
        if (!formData.guardianPhone.trim()) newErrors.guardianPhone = 'Guardian phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (mode === 'create') {
                await dispatch(createStudent(formData)).unwrap();
            } else if (mode === 'edit') {
                await dispatch(updateStudent({ id: student.id, data: formData })).unwrap();
            }
            onClose();
        } catch (error) {
            console.error('Failed to save student:', error);
        }
    };

    const classOptions = [
        { value: '1st Grade', label: '1st Grade' },
        { value: '2nd Grade', label: '2nd Grade' },
        { value: '3rd Grade', label: '3rd Grade' },
        { value: '4th Grade', label: '4th Grade' },
        { value: '5th Grade', label: '5th Grade' },
        { value: '6th Grade', label: '6th Grade' },
        { value: '7th Grade', label: '7th Grade' },
        { value: '8th Grade', label: '8th Grade' },
        { value: '9th Grade', label: '9th Grade' },
        { value: '10th Grade', label: '10th Grade' },
        { value: '11th Grade', label: '11th Grade' },
        { value: '12th Grade', label: '12th Grade' },
    ];

    const sectionOptions = [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' },
    ];

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    const isViewMode = mode === 'view';

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h4>
                </div>

                <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    required
                    disabled={isViewMode}
                />

                <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    required
                    disabled={isViewMode}
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    disabled={isViewMode}
                />

                <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    disabled={isViewMode}
                />

                <Input
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                    required
                    disabled={isViewMode}
                />

                <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={genderOptions}
                    error={errors.gender}
                    required
                    disabled={isViewMode}
                />

                {/* Academic Information */}
                <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Academic Information</h4>
                </div>

                <Select
                    label="Class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    options={classOptions}
                    error={errors.class}
                    required
                    disabled={isViewMode}
                />

                <Select
                    label="Section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    options={sectionOptions}
                    error={errors.section}
                    required
                    disabled={isViewMode}
                />

                {/* Address */}
                <div className="md:col-span-2">
                    <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                        disabled={isViewMode}
                    />
                </div>

                {/* Guardian Information */}
                <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Guardian Information</h4>
                </div>

                <Input
                    label="Guardian Name"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    error={errors.guardianName}
                    required
                    disabled={isViewMode}
                />

                <Input
                    label="Guardian Phone"
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    error={errors.guardianPhone}
                    required
                    disabled={isViewMode}
                />
            </div>

            {/* Form Actions */}
            {!isViewMode && (
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {mode === 'create' ? 'Create Student' : 'Update Student'}
                    </Button>
                </div>
            )}

            {isViewMode && (
                <div className="mt-6 flex justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            )}
        </form>
    );
};

export default StudentForm;
