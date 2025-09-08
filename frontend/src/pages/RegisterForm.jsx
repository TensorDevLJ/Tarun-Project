import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { global_classnames } from "../utils/classnames";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from "react-hot-toast";

const universities = [
  "JNTU-GV",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IISc Bangalore",
  "University of Delhi",
  "Anna University",
  "VIT Vellore",
  "BHU",
  "Other",
];

const qualifications = [
  "High School / 10th",
  "Intermediate / 12th",
  "Diploma",
  "Bachelor’s Degree",
  "Master’s Degree",
  "PhD",
  "Other",
];

const courses = [
  "IoT Systems and Applications",
  "Fundamentals of Quantum Computing",
  "Principles of Machine Learning & Deep Learning",
  "AI and Its Tools",
  "Applied Cybersecurity and Network Defense",
  "Emerging Technologies (3 months course)",
];

const RegisterForm = ({ API_URL = "http://localhost:4000" }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    category: "",
    contactNumber: "",
    email: "",
    address: "",
    college: "",
    qualification: "",
    course: "",
    paymentDate: "",
    paymentRef: "",
  });

  const [files, setFiles] = useState({
    paymentReceipt: null,
    applicationForm: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) =>
    setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateAll = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    else if (formData.fullName.length < 2) newErrors.fullName = "Full Name must be at least 2 characters";
    else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) newErrors.fullName = "Full Name can only contain letters and spaces";
    
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact Number is required";
    } else if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit Indian mobile number";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.address) newErrors.address = "Address is required";
    else if (formData.address.length < 10) newErrors.address = "Address must be at least 10 characters";
    
    if (!formData.college) newErrors.college = "College/University is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.paymentDate) newErrors.paymentDate = "Payment Date is required";
    
    if (!formData.paymentRef) {
      newErrors.paymentRef = "Payment Reference is required";
    } else if (formData.paymentRef.length < 5) {
      newErrors.paymentRef = "Payment Reference must be at least 5 characters";
    }
    
    if (!files.paymentReceipt) newErrors.paymentReceipt = "Payment Receipt is required";
    if (!files.applicationForm) newErrors.applicationForm = "Application Form is required";
    if (!recaptchaToken) newErrors.recaptcha = "Please complete the reCAPTCHA verification";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      Object.keys(files).forEach((key) => files[key] && form.append(key, files[key]));
      form.append('recaptchaToken', recaptchaToken);

      const res = await axios.post(`${API_URL}/api/register`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Registration submitted successfully! Check your email for confirmation.");
        setMessage("Registration submitted successfully! You will receive a confirmation email shortly.");
        setFormData({
          fullName: "",
          gender: "",
          category: "",
          contactNumber: "",
          email: "",
          address: "",
          college: "",
          qualification: "",
          course: "",
          paymentDate: "",
          paymentRef: "",
        });
        setFiles({ paymentReceipt: null, applicationForm: null });
        setErrors({});
        setRecaptchaToken("");
        setTab(0);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Error submitting form. Please try again.";
      toast.error(errorMessage);
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full p-3 border rounded border-[${global_classnames.container.border}] focus:outline-none focus:ring-2 focus:ring-[#004080]`;
  const inputErrorClass = `w-full p-3 border rounded border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500`;
  const buttonClass = `px-6 py-3 rounded text-[${global_classnames.button.primary.text}] bg-[${global_classnames.button.primary.bg}] hover:bg-[${global_classnames.button.primary.hover}] border-[${global_classnames.button.primary.border}] transition-all`;
  const tabs = ["Profile", "Education", "Payments"];

  return (
    <>
      <Toaster position="top-right" />
    <div className={`max-w-7xl mx-auto p-8 my-4 rounded shadow bg-[${global_classnames.background.secondary}]`}>
      <h1 className={`text-3xl font-bold mb-8 text-[${global_classnames.heading.primary}] `}>
        Emerging & Advanced Technologies Course Registration
      </h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex mb-6 space-x-4">
        {tabs.map((t, idx) => (
          <div
            key={idx}
            onClick={() => setTab(idx)}
            className={`px-4 py-2 rounded-full cursor-pointer font-semibold transition-all
              ${tab === idx ? `bg-[#004080] text-white` : `bg-gray-200 text-gray-600`}`}
          >
            {t}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 0: Profile */}
        {tab === 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? inputErrorClass : inputClass}
              />
              {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
            </div>

            <div className="flex flex-col">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? inputErrorClass : inputClass}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
            </div>

            <div className="flex flex-col">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? inputErrorClass : inputClass}
              />
              {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
            </div>

            <div className="flex flex-col">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={errors.contactNumber ? inputErrorClass : inputClass}
              />
              {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber}</span>}
            </div>

            <div className="flex flex-col">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? inputErrorClass : inputClass}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div className="flex flex-col">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? inputErrorClass : inputClass}
              />
              {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
            </div>
          </div>
        )}

        {/* Tab 1: Education */}
        {tab === 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>College/University *</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={errors.college ? inputErrorClass : inputClass}
              >
                <option value="">Select College/University</option>
                {universities.map((uni, idx) => (
                  <option key={idx} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.college && <span className="text-red-500 text-sm">{errors.college}</span>}
            </div>

            <div className="flex flex-col">
              <label>Highest Qualification *</label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={errors.qualification ? inputErrorClass : inputClass}
              >
                <option value="">Select Qualification</option>
                {qualifications.map((qual, idx) => (
                  <option key={idx} value={qual}>{qual}</option>
                ))}
              </select>
              {errors.qualification && <span className="text-red-500 text-sm">{errors.qualification}</span>}
            </div>

            <div className="flex flex-col">
              <label>Course *</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={errors.course ? inputErrorClass : inputClass}
              >
                <option value="">Select Course</option>
                {courses.map((course, idx) => (
                  <option key={idx} value={course}>{course}</option>
                ))}
              </select>
              {errors.course && <span className="text-red-500 text-sm">{errors.course}</span>}
            </div>
          </div>
        )}

        {/* Tab 2: Payments */}
        {tab === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Payment Date *</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className={errors.paymentDate ? inputErrorClass : inputClass}
              />
              {errors.paymentDate && <span className="text-red-500 text-sm">{errors.paymentDate}</span>}
            </div>

            <div className="flex flex-col">
              <label>Payment Reference Number *</label>
              <input
                type="text"
                name="paymentRef"
                value={formData.paymentRef}
                onChange={handleChange}
                className={errors.paymentRef ? inputErrorClass : inputClass}
              />
              {errors.paymentRef && <span className="text-red-500 text-sm">{errors.paymentRef}</span>}
            </div>

            <div className="flex flex-col">
              <label>Upload Payment Receipt *</label>
              <label className={`flex items-center p-3 border rounded cursor-pointer w-full hover:bg-gray-200 ${errors.paymentReceipt ? "border-red-500" : ""}`}>
                <UploadCloud className="mr-2 text-[#004080]" />
                {files.paymentReceipt ? files.paymentReceipt.name : "Click to upload PDF/Image"}
                <input type="file" name="paymentReceipt" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
              </label>
              {errors.paymentReceipt && <span className="text-red-500 text-sm">{errors.paymentReceipt}</span>}
            </div>

            <div className="flex flex-col">
              <label>Upload Filled Application Form *</label>
              <label className={`flex items-center p-3 border rounded cursor-pointer w-full hover:bg-gray-200 ${errors.applicationForm ? "border-red-500" : ""}`}>
                <UploadCloud className="mr-2 text-[#004080]" />
                {files.applicationForm ? files.applicationForm.name : "Click to upload PDF"}
                <input type="file" name="applicationForm" onChange={handleFileChange} accept=".pdf" className="hidden" />
              </label>
              {errors.applicationForm && <span className="text-red-500 text-sm">{errors.applicationForm}</span>}
            </div>
          </div>
        )}

        {/* reCAPTCHA */}
        {tab === 2 && (
          <div className="mt-6">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onChange={setRecaptchaToken}
              onExpired={() => setRecaptchaToken("")}
            />
            {errors.recaptcha && <span className="text-red-500 text-sm">{errors.recaptcha}</span>}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={() => setTab(Math.max(tab - 1, 0))} className={`${buttonClass} ${tab === 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
            Previous
          </button>

          {tab < 2 ? (
            <button type="button" onClick={() => setTab(Math.min(tab + 1, 2))} className={buttonClass}>
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={submitting}
              className={`${buttonClass} ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </form>
    </div>
    </>
  );
};

export default RegisterForm;
