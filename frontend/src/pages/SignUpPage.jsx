import { useState } from "react"
import { Link } from "react-router-dom"
import { useAddUserMutation } from "../../api/authApi";
import { FiLock, FiUser } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import CustomInput from "../components/common/CustomInput";
import CustomSelect from "../components/common/CustomSelect";

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // There will be obviously form validation

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
                  setValue={(value) => setFormData(prev => ({ ...prev, day: value }))}
                  options={Array.from({ length: 31 }, (_, i) => i + 1)}
                  paddingX="12px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />

                <CustomSelect
                  placeholder="Month"
                  value={formData.month}
                  setValue={(value) => setFormData(prev => ({ ...prev, month: value }))}
                  options={Array.from({ length: 12 }, (_, i) => i + 1)}
                  paddingX="12px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />

                <CustomSelect
                  placeholder="Year"
                  value={formData.year}
                  setValue={(value) => setFormData(prev => ({ ...prev, year: value }))}
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
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border transition-all" style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: formData.gender === "Male" ? 'var(--color-primary-hover)' : 'var(--color-border)',
                  boxShadow: formData.gender === "Male" ? 'var(--color-glow-green)' : 'none',
                  color: formData.gender === "Male" ? 'var(--color-primary-hover)' : 'var(--color-text-primary)',
                }}>
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="Male"
                    onChange={handleChange}
                    checked={formData.gender === "Male"}
                    className="appearance-none w-5 h-5 rounded-full border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: formData.gender === "Male" ? 'var(--color-primary-hover)' : 'var(--color-border)',
                      backgroundColor: formData.gender === "Male" ? 'var(--color-primary-hover)' : 'transparent',
                      boxShadow: formData.gender === "Male" ? 'inset 0 0 0 3px var(--color-surface)' : 'none'
                    }}
                  />
                  <span style={{ color: 'var(--color-text-primary)' }}>Male</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border transition-all" style={{
                  backgroundColor: 'var(--color-bg)',
                  borderColor: formData.gender === "Female" ? 'var(--color-primary-hover)' : 'var(--color-border)',
                  boxShadow: formData.gender === "Female" ? 'var(--color-glow-green)' : 'none'
                }}>
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    value="Female"
                    onChange={handleChange}
                    checked={formData.gender === "Female"}
                    className="appearance-none w-5 h-5 rounded-full border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: formData.gender === "Female" ? 'var(--color-primary-hover)' : 'var(--color-border)',
                      backgroundColor: formData.gender === "Female" ? 'var(--color-primary-hover)' : 'transparent',
                      boxShadow: formData.gender === "Female" ? 'inset 0 0 0 3px var(--color-surface)' : 'none'
                    }}
                  />
                  <span style={{ color: 'var(--color-text-primary)' }}>Female</span>
                </label>
              </div>
            </div>

            {/* ---- Submit Button ---- */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-5 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: 'var(--color-gradient-primary)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
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