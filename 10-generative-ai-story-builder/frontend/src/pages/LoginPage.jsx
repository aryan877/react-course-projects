import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Link, useNavigate } from "react-router-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <LogIn
          className="h-5 w-5 text-primary-500 group-hover:text-primary-400"
          aria-hidden="true"
        />
      </span>
      {pending ? "Signing in..." : "Sign in"}
    </motion.button>
  );
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      try {
        await login(email, password);
        navigate("/create");
        return null;
      } catch (err) {
        return (
          err.response?.data?.error ||
          "Login failed. Please check your credentials."
        );
      }
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              start your 14-day free trial
            </Link>
          </p>
        </motion.div>
        <form action={submitAction} className="mt-8 space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <fieldset disabled={isPending} className="group">
            <div className="rounded-md shadow-sm -space-y-px group-disabled:opacity-50">
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </fieldset>

          <div>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
