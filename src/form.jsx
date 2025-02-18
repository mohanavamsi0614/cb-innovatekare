import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        teamname: '',
        type: '',
        room: '',
        teamMembers: Array(4).fill({ name: '', registrationNumber: '', type: '', room: '' })
    });
    const [errors, setErrors] = useState({});
    const nav = useNavigate();

    useEffect(() => {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTeamMemberChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeamMembers = formData.teamMembers.map((member, i) => 
            i === index ? { ...member, [name]: value } : member
        );
        setFormData({ ...formData, teamMembers: updatedTeamMembers });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration Number is required';
        if (!formData.teamname) newErrors.teamname = 'Team Name is required';
        if (!formData.type) newErrors.type = 'Type is required';
        if (!formData.room) newErrors.room = 'Room Number is required';
        formData.teamMembers.forEach((member, index) => {
            if (!member.name) newErrors[`teamMember${index}Name`] = `Team Member ${index + 1} Name is required`;
            if (!member.registrationNumber) newErrors[`teamMember${index}RegistrationNumber`] = `Team Member ${index + 1} Registration Number is required`;
            if (!member.type) newErrors[`teamMember${index}Type`] = `Team Member ${index + 1} Type is required`;
            if (!member.room) newErrors[`teamMember${index}Room`] = `Team Member ${index + 1} Room Number is required`;
        });
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        const leadRegNumberok=formData.registrationNumber[6]=="8"
        const membersok=formData.teamMembers.every((member)=>{
        return member.registrationNumber[6]=="8"
    })
    
    console.log(leadRegNumberok,membersok)
    if(membersok && leadRegNumberok){
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                nav("/payment", { state: formData });
                console.log(formData);
            } catch (error) {
                console.error('Error saving form data:', error);
            }
        }
    }
    else{
        alert("Only IT Students are allowed to register we will notify when we are having open registrations")
    }
    };

    return (
        <div className="home flex flex-col justify-center items-center h-full p-4 bg-white">
            <h1 className="text-4xl font-bold mb-6 text-center">Registration Form for Innovate Kare</h1>
            <form className="border rounded-2xl bg-white p-8 shadow-lg w-full max-w-lg" onSubmit={handleSubmit}>
                <label className="block mb-2 text-xl font-medium"><p>Team Name:</p></label>
                <input name="teamname" value={formData.teamname} onChange={handleChange} placeholder="Team Name" className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                {errors.teamname && <p className="text-red-500 text-sm">{errors.teamname}</p>}
                
                <label className="block mb-2 text-xl font-medium"><p>Lead Name:</p></label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                
                <label className="block mb-2 text-xl font-medium"><p>Lead Collage mail:</p></label>
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                
                <label className="block mb-2 text-xl font-medium"><p>Lead Registration Number:</p></label>
                <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Registration Number" className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}
                
                <label className="block mb-2 text-xl font-medium"><p>Lead Type:</p></label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full h-12 rounded-lg p-3 border mb-4 text-lg">
                    <option value="">Select Type</option>
                    <option value="Day's Scholar">Day's Scholar</option>
                    <option value="Mh-1">Mh-1</option>
                    <option value="Mh-2">Mh-2</option>
                    <option value="Mh-3">Mh-3</option>
                    <option value="Mh-4">Mh-4</option>
                    <option value="Mh-5">Mh-5</option>
                    <option value="Mh-6">Mh-6</option>
                    <option value="Mh-7">Mh-7</option>
                    <option value="Lh-1">Lh-1</option>
                    <option value="Lh-2">Lh-2</option>
                    <option value="Lh-3">Lh-3</option>
                    <option value="Lh-4">Lh-4</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}

                <label className="block mb-2 text-xl font-medium"><p>Room Number:</p></label>
                <input name="room" value={formData.room} onChange={handleChange} placeholder="Room Number" className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                {errors.room && <p className="text-red-500 text-sm">{errors.room}</p>}

                {formData.teamMembers.map((member, index) => (
                    <div key={index} className="mb-4">
                        <label className="block mb-2 text-xl font-medium"><p>Team Member {index + 1} Name</p></label>
                        <input name="name" value={member.name} onChange={(e) => handleTeamMemberChange(index, e)} placeholder={`Team member ${index + 1} name`} className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                        {errors[`teamMember${index}Name`] && <p className="text-red-500 text-sm">{errors[`teamMember${index}Name`]}</p>}
                        
                        <label className="block mb-2 text-xl font-medium"><p>Team Member {index + 1} Registration Number</p></label>
                        <input name="registrationNumber" value={member.registrationNumber} onChange={(e) => handleTeamMemberChange(index, e)} placeholder={`Team member ${index + 1} registration number`} className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                        {errors[`teamMember${index}RegistrationNumber`] && <p className="text-red-500 text-sm">{errors[`teamMember${index}RegistrationNumber`]}</p>}
                        
                        <label className="block mb-2 text-xl font-medium"><p>Team Member {index + 1} Type</p></label>
                        <select name="type" value={member.type} onChange={(e) => handleTeamMemberChange(index, e)} className="w-full h-12 rounded-lg p-3 border mb-4 text-lg">
                            <option value="">Select Type</option>
                            <option value="Day's Scholar">Day's Scholar</option>
                            <option value="Mh-1">Mh-1</option>
                            <option value="Mh-2">Mh-2</option>
                            <option value="Mh-3">Mh-3</option>
                            <option value="Mh-4">Mh-4</option>
                            <option value="Mh-5">Mh-5</option>
                            <option value="Mh-6">Mh-6</option>
                            <option value="Mh-7">Mh-7</option>
                            <option value="Lh-1">Lh-1</option>
                            <option value="Lh-2">Lh-2</option>
                            <option value="Lh-3">Lh-3</option>
                            <option value="Lh-4">Lh-4</option>
                        </select>
                        {errors[`teamMember${index}Type`] && <p className="text-red-500 text-sm">{errors[`teamMember${index}Type`]}</p>}

                        <label className="block mb-2 text-xl font-medium"><p>Team Member {index + 1} Room Number</p></label>
                        <input name="room" value={member.room} onChange={(e) => handleTeamMemberChange(index, e)} placeholder={`Team member ${index + 1} room number`} className="w-full h-12 rounded-lg p-3 border mb-4 text-lg"/>
                        {errors[`teamMember${index}Room`] && <p className="text-red-500 text-sm">{errors[`teamMember${index}Room`]}</p>}
                    </div>
                ))}
                <button type="submit" className="w-full h-12 rounded-lg bg-white border text-lg font-medium">Next</button>
            </form>
        </div>
    )
}
export default Form;