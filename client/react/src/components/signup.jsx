import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import api from "@/utils/api";

const benefits = [
  "A simple, focused workspace",
  "Secure access to your account",
  "Everything you need in one place",
];

const inputStyles =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("details");
  const [accountDetails, setAccountDetails] = useState(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const details = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/api/send-otp", {
        name: details.name,
        email: details.email,
      });
      setAccountDetails(details);
      setEmail(details.email);
      setStep("verification");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Could not send the verification code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    if (otp.length !== 6 || !accountDetails || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/api/signup", {
        ...accountDetails,
        otp,
      });
      navigate("/login");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Could not create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const returnToDetails = () => {
    setOtp("");
    setError("");
    setStep("details");
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-neutral-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl"
        />

        <Link
          to="/"
          className="relative z-10 w-fit text-xl font-semibold tracking-tight"
        >
          VL3
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/60">
            Get started today
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Build something worth remembering.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/60">
            Create your account and turn your ideas into real, meaningful work.
          </p>

          <ul className="mt-10 space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-white/10">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-white/40">
          Designed to keep you moving forward.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 inline-block text-xl font-semibold tracking-tight lg:hidden"
          >
            VL3
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {step === "details" ? "Create an account" : "Verify your email"}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              {step === "details" ? "Join us today" : "Enter your code"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {step === "details"
                ? "Enter your details below to create your account."
                : `We sent a 6-digit verification code to ${email}.`}
            </p>
          </div>

          {step === "details" ? (
            <form className="space-y-5" onSubmit={handleAccountSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  className={inputStyles}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputStyles}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  className={inputStyles}
                  required
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    Sending code...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div className="space-y-3">
                <label htmlFor="verification-code" className="text-sm font-medium">
                  Verification code
                </label>
                <InputOTP
                  id="verification-code"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="w-full"
                  aria-label="Six-digit verification code"
                  autoFocus
                >
                  <InputOTPGroup className="grid w-full grid-cols-6">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="size-12 w-full text-base"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={otp.length !== 6 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Verify OTP
                    <ArrowRight aria-hidden="true" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={returnToDetails}
                disabled={isSubmitting}
              >
                <ArrowLeft aria-hidden="true" />
                Change account details
              </Button>
            </form>
          )}

          {step === "details" && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Signup;
