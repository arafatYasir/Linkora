import { useState } from "react"
import { Link } from "react-router-dom"
import { useAddUserMutation } from "../../api/authApi";
import { FiLock, FiUser } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import CustomInput from "../components/common/CustomInput";
import CustomSelect from "../components/common/CustomSelect";
import GenderBtn from "../components/signup/GenderBtn";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    day: "",
    month: "",
    year: ""
  });
  const [addUser, { isLoading, error }] = useAddUserMutation();
  const [message, setMessage] = useState("");
  let formError = {};
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    // Prevent default behavior
    e.preventDefault();

    // Reset the formError
    formError = {};

    // First name validation
    if(formData.firstname.trim() === "") {
      formError.firstname = "First name is required";
    }
    else if(formData.firstname[0] !== formData.firstname[0].toUpperCase()) {
      formError.firstname = "Name must start with uppercase letter";
    }

    // Last name validation
    if(formData.lastname.trim() === "") {
      formError.lastname = "Last name is required";
    }
    else if(formData.lastname[0] !== formData.lastname[0].toUpperCase()) {
      formError.lastname = "Name must start with uppercase letter";
    }

    // Email validation
    if(formData.email.trim() === "") {
      formError.email = "Email is required";
    }
    else if(!emailRegex.test(formData.email)) {
      formError.email = "Invalid email format";
    }

    // Password validation
    if(formData.password.trim() === "") {
      formError.password = "Password is required";
    }
    else if(formData.password.length < 8) {
      formError.password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if(formData.confirmPassword.trim() === "") {
      formError.confirmPassword = "Confirm password is required";
    }
    else if(formData.confirmPassword !== formData.password) {
      formError.confirmPassword = "Passwords do not match";
    }

    // Gender validation
    if(formData.gender.trim() === "") {
      formError.gender = "Gender is required";
    }
    else if(!formData.gender.includes(["Male", "Female", "Other"])) {
      formError.gender = "Invalid gender";
    }

    // Day validation
    if(formData.day.trim() === "") {
      formError.day = "Day is required";
    }
    else if(formData.day < 1 || formData.day > 31) {
      formError.day = "Invalid day";
    }

    // Month validation
    if(formData.month.trim() === "") {
      formError.month = "Month is required";
    }
    else if(formData.month < 1 || formData.month > 12) {
      formError.month = "Invalid month";
    }

    // Year validation
    if(formData.year.trim() === "") {
      formError.year = "Year is required";
    }
    else if(formData.year < 1925 || formData.year > new Date().getFullYear()) {
      formError.year = "Invalid year";
    }

    // 18 years old validation
    const today = new Date();
    const birthDate = new Date(formData.year, formData.month, formData.day);
    const age = today - birthDate;

    if(age < 18 * 12 * 30 * 24 * 60 * 60 * 1000) {
      formError.age = "You must be at least 18 years old";
    }

    // Checking if any error exists. If any exists then return else let the user signup
    if(Object.keys(formError).length > 0) {
      return;
    }

    // Creating the user if everything is ok
    const signUpMutation = await addUser(formData);

    setMessage(signUpMutation.data.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-bg">
      <div className="w-full max-w-md">
        {/* ---- Header ---- */}
        <div className="text-center mb-8 flex flex-col items-center gap-y-4">
          <div className="flex items-center gap-x-2">
            <img
              className="w-9 h-9"
              src="/images/logo.svg"
              alt="Logo of Linkora"
              loading="lazy"
            />
            <h1 className="text-4xl font-bold text-primary-hover">Linkora</h1>
          </div>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>It's simple. Create a new account and join with us!</p>
        </div>

        {/* ---- Card Container ---- */}
        <div className="rounded-lg p-6 shadow-lg bg-surface border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ---- Name Fields ---- */}
            <div className="grid grid-cols-2 gap-2">
              {/* ---- First Name ---- */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                  <FiUser size={20} />
                </div>
                <CustomInput
                  type="text"
                  value={formData.firstname}
                  setValue={(value) => setFormData(prev => ({ ...prev, firstname: value }))}
                  placeholder="First name"
                  paddingX="40px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />
              </div>

              {/* ---- Last Name ---- */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                  <FiUser size={20} />
                </div>
                <CustomInput
                  type="text"
                  value={formData.lastname}
                  setValue={(value) => setFormData(prev => ({ ...prev, lastname: value }))}
                  placeholder="Last name"
                  paddingX="40px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />
              </div>
            </div>

            {/* ---- Email Field ---- */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <MdOutlineMailOutline size={22} />
              </div>
              <CustomInput
                type="email"
                value={formData.email}
                setValue={(value) => setFormData(prev => ({ ...prev, email: value }))}
                placeholder="Email address"
                paddingX="40px"
                paddingY="12px"
                backgroundColor="var(--color-bg)"
                width="100%"
              />
            </div>

            {/* ---- Password Field ---- */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <FiLock size={20} />
              </div>
              <CustomInput
                type="password"
                value={formData.password}
                setValue={(value) => setFormData(prev => ({ ...prev, password: value }))}
                placeholder="Password"
                paddingX="40px"
                paddingY="12px"
                backgroundColor="var(--color-bg)"
                width="100%"
              />
            </div>

            {/* ---- Confirm Password Field ---- */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                <FiLock size={20} />
              </div>
              <CustomInput
                type="password"
                value={formData.confirmPassword}
                setValue={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                placeholder="Confirm password"
                paddingX="40px"
                paddingY="12px"
                backgroundColor="var(--color-bg)"
                width="100%"
              />
            </div>

            {/* ---- Date of Birth ---- */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Date of Birth</label>
              <div className="grid grid-cols-3 gap-3">
                <CustomSelect
                  placeholder="Day"
                  value={formData.day}
                  onChange={(value) => setFormData(prev => ({ ...prev, day: value }))}
                  options={Array.from({ length: 31 }, (_, i) => i + 1)}
                  paddingX="12px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />

                <CustomSelect
                  placeholder="Month"
                  value={formData.month}
                  onChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
                  options={Array.from({ length: 12 }, (_, i) => i + 1)}
                  paddingX="12px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />

                <CustomSelect
                  placeholder="Year"
                  value={formData.year}
                  onChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
                  options={Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i)}
                  paddingX="12px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />
              </div>
            </div>

            {/* ---- Gender Selection ---- */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                <GenderBtn formData={formData} handleChange={handleChange} gender="Male" />
                <GenderBtn formData={formData} handleChange={handleChange} gender="Female" />
                <GenderBtn formData={formData} handleChange={handleChange} gender="Other" />
              </div>
            </div>

            {/* ---- Submit Button ---- */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-5 rounded-lg font-semibold text-white bg-gradient-primary transition-[var(--transition-default)] ${isLoading ? "bg-primary-hover/80 cursor-not-allowed opacity-70" : "bg-primary-hover cursor-pointer opacity-100"} active:scale-98 hover:bg-primary-hover/80`}
            >
              {isLoading ? "Creating..." : "Create an Account"}
            </button>
          </form>

          {/* ---- Login Link ---- */}
          <p className="text-center mt-6" style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account? <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage