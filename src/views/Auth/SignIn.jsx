import React from "react";
import style from "./auth.module.css";
import { AuthLayout } from "../../components/Layouts/AuthLayout";
import image from "../../assets/images/signInImg.jpg";
import { Input } from "../../components/Inputs/Input";
import { Button } from "../../components/Buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { login } from "../../services/authApis";
import { Link, useNavigate } from "react-router";
import { loader, toast } from "../../utils";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiOutlineEyeInvisible } from "react-icons/ai";

export const SignIn = () => {
  const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      loader.start();
      let res = await login(data);
      localStorage.setItem("refreshToken", res?.data?.data?.refreshToken);
      localStorage.setItem("token", res?.data?.data?.token);
      localStorage.setItem("userData", JSON.stringify(res?.data?.data));
      navigate("/dashboard");
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      loader.stop();
    }
  };

  return (
    <AuthLayout
      img={image}
      heading={"Sign in to your account"}
      subHeading={"Welcome back! Please enter your details."}
    >
      <div className={style.signIn_container}>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Controller
            name="email"
            control={control}
            defaultValue={null}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <Input
                  value={value}
                  onChange={onChange}
                  className="mt-[32px]"
                  required
                  error={!!errors?.email}
                  placeholder="Enter your e-mail"
                  label={<span style={{ color: "white" }}>Email</span>}
                />
              );
            }}
          />
                    <Controller
            name="password"
            control={control}
            defaultValue={null}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <div className="relative mt-[20px]">
                  <Input
                    value={value}
                    error={errors?.password}
                    onChange={onChange}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter Password"
                    label={<span style={{ color: "white" }} >Password</span>}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-10 cursor-pointer text-gray-700"
                  >
                    {showPassword ? (
                      <MdOutlineRemoveRedEye className="" />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </span>
                </div>
              );
            }}
          />

          <Button className="mt-[24px]" type="submit" fullWidth primary>
            Log In
          </Button>
        </form>

        <Link to={"/forgotPassword"}>
          <div className={style.forgot_password_text}>Forgot Password </div>
        </Link>
      </div>
    </AuthLayout>
  );
};
