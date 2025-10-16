import { useState } from "react"
import { Link } from "react-router-dom"

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="container mx-auto">
      <form className="flex flex-wrap gap-12 items-center min-h-screen">

        <input
          className="px-2 py-2 border mt-5" type="text" placeholder="First Name" name="firstname"
          value={formData.firstname} onChange={handleChange}
        />

        <input
          className="px-2 py-2 border mt-5" type="text" placeholder="Last Name" name="lastname"
          value={formData.lastname} onChange={handleChange}
        />

        <input
          className="px-2 py-2 border mt-5" type="email" placeholder="Your email" name="email"
          value={formData.email} onChange={handleChange}
        />

        <input
          className="px-2 py-2 border mt-5" type="password" placeholder="Password" name="password"
          value={formData.password} onChange={handleChange}
        />

        <input
          className="px-2 py-2 border mt-5" type="password" placeholder="Confirm Password" name="confirmPassword"
          value={formData.confirmPassword} onChange={handleChange}
        />

        <div>
          <input type="radio" name="gender" id="male" value="Male" onChange={handleChange} checked={formData.gender === "Male"} />
          <label htmlFor="male" className="ml-2">Male</label>
        </div>

        <div>
          <input type="radio" name="gender" id="female" value="Female" onChange={handleChange} checked={formData.gender === "Female"} />
          <label htmlFor="female" className="ml-2">Female</label>
        </div>

        <div className="flex gap-x-7">
          <select className="border p-1" name="day" value={formData.day} onChange={handleChange}>
            <option>Day</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>

          <select className="border p-1" name="month" value={formData.month} onChange={handleChange}>
            <option>Month</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>

          <select className="border p-1" name="year" value={formData.year} onChange={handleChange}>
            <option>Year</option>
            <option>2000</option>
            <option>2001</option>
            <option>2002</option>
            <option>2003</option>
          </select>
        </div>

        <button type="submit" className="bg-[dodgerblue] py-3 px-5 rounded ml-5">Create an Account</button>
      </form>

      <p>Already have an account? <Link className="text-[green]">Login</Link></p>
    </div>
  )
}

export default SignUpPage