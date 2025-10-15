import { useSelector } from "react-redux"

const RegistrationPage = () => {
  const userInfo = useSelector(state => state.auth.userInfo);

  console.log(userInfo);
  return (
    <div>This is from registration page</div>
  )
}

export default RegistrationPage