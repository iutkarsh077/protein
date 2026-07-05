import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/contexts/GlobalContext";
import api from "@/utils/api";

const inputStyles =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useGlobalContext();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await api.post("/api/login", credentials);
      setUser(data.user);
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Could not sign you in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-muted/40">
      <section className="m-auto w-full max-w-md px-6 py-12">
        <div className="rounded-2xl border bg-card p-7 text-card-foreground shadow-sm sm:p-9">
          <Link
            to="/"
            className="mb-10 inline-block text-xl font-semibold tracking-tight"
          >
            VL3
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter your email and password to continue.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputStyles}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
