import { useState } from "react";
import { AuthLayout } from "../../components/Layouts/AuthLayout";
import style from "./auth.module.css";
import image from "../../assets/images/signInImg.jpg";
import { Link, Navigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { loader, toast } from "../../utils";
import { Button } from "../../components/Buttons/Button";
import { Input } from "../../components/Inputs/Input";
import { useQueryParams } from "../../hooks/useQueryParams";
import { InputErrorMsg } from "../../components/common/InputErrorMsg";
import { passwordReset } from "../../services/authApis";

export const SetNewPassword = () => {
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const token = useQueryParams("token");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password to validate confirmPassword
  const passwordValue = watch("password");

  async function setPassword(data) {
    try {
      console.log(data);
      const body = {
        password: data.password,
        token: token,
      };
      loader.start();
      await passwordReset(body);
      toast.success("Password reset successfully");
      setIsPasswordReset(true);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      loader.stop();
    }
  }

  if (!token) {
    return <Navigate to={"/"} />;
  }

  return (
    <AuthLayout
      img={image}
      heading={isPasswordReset ? "Password Reset" : "Set new password"}
      subHeading={
        isPasswordReset
          ? "Your password has been successfully reset"
          : "Your password must be different to previously used passwords"
      }
    >
      <div className={style.forgot_password_con}>
        {isPasswordReset ? (
          <div></div>
        ) : (
          <form
            onSubmit={handleSubmit(setPassword, () =>
              toast.error("Please enter valid inputs")
            )}
          >
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                  message:
                    "Password must be at least 6 characters long, include at least one uppercase letter, one number, and one special character (@$!%*?&)",
                },
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    value={value}
                    onChange={onChange}
                    className="mt-[32px]"
                    required
                    error={!!errors?.password}
                    placeholder="Enter New Password"
                    // label={'Enter New Password'}
                    label={
                      <span style={{ color: "white" }}>Enter New Password</span>
                    }
                  />
                );
              }}
            />
            <InputErrorMsg> {errors?.password?.message}</InputErrorMsg>

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    value={value}
                    onChange={onChange}
                    className="mt-[32px]"
                    required
                    // label={"Confirm Password"}
                    label={
                      <span style={{ color: "white" }}>Confirm Password</span>
                    }
                    error={!!errors?.confirmPassword}
                    placeholder="Re-enter New Password"
                  />
                );
              }}
            />
            <InputErrorMsg> {errors?.confirmPassword?.message}</InputErrorMsg>

            <Button className="mt-[24px]" type="submit" fullWidth primary>
              Reset Password
            </Button>
          </form>
        )}
        <Link to={"/"}>
          <div className={`${style.login_text}`}>Login</div>
        </Link>
      </div>
    </AuthLayout>
  );
};
