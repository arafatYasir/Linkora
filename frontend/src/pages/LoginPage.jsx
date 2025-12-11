/* frontend/src/pages/LoginPage.jsx */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";
import { FiLock } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import CustomInput from "../components/common/CustomInput";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState({});
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError({});

    let tempError = {};

    // Email validation
    if (formData.email.trim() === "") {
      tempError.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempError.email = "Invalid email format";
    }

    // Password validation
    if (formData.password.trim() === "") {
      tempError.password = "Password is required";
    }

    if (Object.keys(tempError).length > 0) {
      setFormError(tempError);
      return;
    }

    try {
      const res = await loginUser(formData).unwrap();
      
      // Dispatch user data to Redux store
      dispatch(setUser(res));
      localStorage.setItem("userInfo", JSON.stringify(res));
      
      toast.success("Login successful!");
      setFormData({ email: "", password: "" });
      navigate("/"); // Redirect to home after login
    } catch (e) {
      toast.error(e?.data?.error || "Login failed");
    }
  };

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
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Welcome back! Please login to your account.
          </p>
        </div>

        {/* ---- Card Container ---- */}
        <div className="rounded-lg p-6 shadow-lg bg-surface border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ---- Email Field ---- */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                  <MdOutlineMailOutline size={22} />
                </div>
                <CustomInput
                  type="email"
                  value={formData.email}
                  setValue={(value) =>
                    setFormData((prev) => ({ ...prev, email: value }))
                  }
                  placeholder="Email address"
                  paddingX="40px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />
              </div>
              {formError?.email && (
                <p className="text-error text-sm mt-1.5">{formError?.email}</p>
              )}
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
                  setValue={(value) =>
                    setFormData((prev) => ({ ...prev, password: value }))
                  }
                  placeholder="Password"
                  paddingX="40px"
                  paddingY="12px"
                  backgroundColor="var(--color-bg)"
                  width="100%"
                />
              </div>
              {formError?.password && (
                <p className="text-error text-sm mt-1.5">{formError?.password}</p>
              )}
            </div>

            {/* ---- Forgot Password Link ---- */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* ---- Submit Button ---- */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-5 rounded-lg font-semibold text-white bg-gradient-primary transition-[var(--transition-default)] ${
                isLoading
                  ? "bg-primary-hover/80 cursor-not-allowed opacity-70"
                  : "bg-primary-hover cursor-pointer opacity-100"
              } active:scale-98 hover:bg-primary-hover/80`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* ---- Sign Up Link ---- */}
          <p
            className="text-center mt-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;