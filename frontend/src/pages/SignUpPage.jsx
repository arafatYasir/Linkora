import { useState } from "react"
import { Link } from "react-router-dom"
import { useAddUserMutation } from "../../api/authApi";
import { FiLock, FiUser } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import CustomInput from "../components/common/CustomInput";
import CustomSelect from "../components/common/CustomSelect";
import GenderBtn from "../components/signup/GenderBtn";
import { toast } from "react-toastify"

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
  const [formError, setFormError] = useState({});
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
    setFormError({});

    // Temp error
    let tempError = {};

    // First name validation
    if (formData.firstname.trim() === "") {
      tempError.firstname = "First name is required";
    }
    else if (formData.firstname[0] !== formData.firstname[0].toUpperCase()) {
      tempError.firstname = "Name must start with uppercase letter";
    }

    // Last name validation
    if (formData.lastname.trim() === "") {
      tempError.lastname = "Last name is required";
    }
    else if (formData.lastname[0] !== formData.lastname[0].toUpperCase()) {
      tempError.lastname = "Name must start with uppercase letter";
    }

    // Email validation
    if (formData.email.trim() === "") {
      tempError.email = "Email is required";
    }
    else if (!emailRegex.test(formData.email)) {
      tempError.email = "Invalid email format";
    }

    // Password validation
    if (formData.password.trim() === "") {
      tempError.password = "Password is required";
    }
    else if (formData.password.length < 8) {
      tempError.password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if (formData.confirmPassword.trim() === "") {
      tempError.confirmPassword = "Confirm password is required";
    }
    else if (formData.confirmPassword !== formData.password) {
      tempError.confirmPassword = "Passwords do not match";
    }

    // Gender validation
    if (formData.gender.trim() === "") {
      tempError.gender = "Gender is required";
    }
    else if (!formData.gender.includes("Male", "Female", "Other")) {
      tempError.gender = "Invalid gender";
    }

    // Day validation
    if (formData.day === "") {
      tempError.day = "Day is required";
    }
    else if (formData.day < 1 || formData.day > 31) {
      tempError.day = "Invalid day";
    }

    // Month validation
    if (formData.month === "") {
      tempError.month = "Month is required";
    }
    else if (formData.month < 1 || formData.month > 12) {
      tempError.month = "Invalid month";
    }

    // Year validation
    if (formData.year === "") {
      tempError.year = "Year is required";
    }
    else if (formData.year < 1925 || formData.year > new Date().getFullYear()) {
      tempError.year = "Invalid year";
    }

    // 18 years old validation
    const today = new Date();
    const birthDate = new Date(formData.year, formData.month - 1, formData.day);
    let calculateAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculateAge--;
    }

    if (calculateAge < 18) {
      tempError.age = "You must be at least 18 years old";
    }

    // Checking if any error exists. If any exists then return else let the user signup
    if (Object.keys(tempError).length > 0) {
      setFormError(tempError);
      return;
    }

    try {
      // Reset form errors
      setFormError({});
      
      // Creating the user if everything is ok
      const signUpMutation = await addUser(formData).unwrap();
      toast.success(signUpMutation.message);

      setFormData({
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
    }
    catch (e) {
      toast.error(e.data.error);
    }
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
              <div>
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
                {/* Error Message */}
                {formError?.firstname && <p className="text-red-400 text-sm mt-1.5">{formError?.firstname}</p>}
              </div>

              {/* ---- Last Name ---- */}
              <div>
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
                {/* Error Message */}
                {formError?.lastname && <p className="text-red-400 text-sm mt-1.5">{formError?.lastname}</p>}
              </div>
            </div>

            {/* ---- Email Field ---- */}
            <div>
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
              {/* Error Message */}
              {formError?.email && <p className="text-red-400 text-sm mt-1.5">{formError?.email}</p>}
            </div>

            {/* ---- Password Field ---- */}
            <div>
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
              {/* Error Message */}
              {formError?.password && <p className="text-red-400 text-sm mt-1.5">{formError?.password}</p>}
            </div>

            {/* ---- Confirm Password Field ---- */}
            <div>
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
              {/* Error Message */}
              {formError?.confirmPassword && <p className="text-red-400 text-sm mt-1.5">{formError?.confirmPassword}</p>}
            </div>

            {/* ---- Date of Birth ---- */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Date of Birth</label>
              <div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
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
                    {/* Error Message */}
                    {formError?.day && <p className="text-red-400 text-sm mt-1.5">{formError?.day}</p>}
                  </div>

                  <div>
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
                    {/* Error Message */}
                    {formError?.month && <p className="text-red-400 text-sm mt-1.5">{formError?.month}</p>}
                  </div>

                  <div>
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
                    {/* Error Message */}
                    {formError?.year && <p className="text-red-400 text-sm mt-1.5">{formError?.year}</p>}
                  </div>
                </div>

                {/* Error Message */}
                {formError?.age && <p className="text-red-400 text-sm mt-1.5">{formError?.age}</p>}
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
              {/* Error Message */}
              {formError?.gender && <p className="text-red-400 text-sm mt-1.5">{formError?.gender}</p>}
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