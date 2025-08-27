import { useState } from "react";
import image from "../../assets/images/signInImg.jpg";
import style from "./auth.module.css";
import { AuthLayout } from "../../components/Layouts/AuthLayout";
import { Button } from "../../components/Buttons/Button";
import { Input } from "../../components/Inputs/Input";
import { Controller, useForm } from "react-hook-form";
import { loader, toast } from "../../utils";
import { Link } from "react-router";
import { forgotPassword } from "../../services/authApis";

export const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email_address: "",
    },
  });

  const email_address = watch("email_address");

  async function handleforgotPassword(data) {
    try {
      console.log(data);
      loader.start();
      let res = await forgotPassword(data);
      if (res?.data?.message) {
        toast.success(res.data.message);
      }

      setIsEmailSent(true);
      // let res=await ()
      setIsEmailSent(true);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      loader.stop();
    }
  }

  return (
    <AuthLayout
      img={image}
      heading={isEmailSent ? "Check your email" : "Forgot password?"}
      subHeading={
        isEmailSent
          ? "We sent a password reset link to"
          : "No worries, we'll send you reset instructions."
      }
    >
      <div className={style.forgot_password_con}>
        {isEmailSent ? (
          <div>
            <div className={style.email_text}>{email_address}</div>
            <div className={`${style.didnot_text}`}>
              Didn't receive the email?
              <span className={style.resend_text}>Click to resend</span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleforgotPassword, () =>
              toast.success("Please enter valid email")
            )}
          >
            <Controller
              name="email_address"
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
                    error={!!errors?.email_address}
                    placeholder="Enter your e-mail"
                    label={<span style={{ color: "white" }}>Email</span>}
                  />
                );
              }}
            />

            <Button className="mt-[24px]" type="submit" fullWidth primary>
              Reset
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
