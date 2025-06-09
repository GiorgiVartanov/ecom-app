import { useState } from "react"
import { useForm } from "react-hook-form"

import useAuthStore from "../../store/useAuthStore"

import { signIn, signUp } from "../../api/auth.api"

import Modal from "../common/Modal"
import Input from "../common/Input"
import Button from "../common/Button"

const AuthModal = ({ title, isOpen, onClose, className }) => {
  const [selectedTab, setSelectedTab] = useState("signUp")

  const [isLoading, setIsLoading] = useState(false)

  const setAuth = useAuthStore((state) => state.setAuth)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    reset: resetSignIn,
    formState: { errors: errorsSignIn },
  } = useForm()

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUp,
    formState: { errors: errorsSignUp },
  } = useForm()

  const onSignInSubmit = async (data) => {
    setIsLoading(true)

    try {
      const response = await signIn(data)
      const { token, user } = response.data

      setAuth({
        user,
        token,
      })

      resetSignIn()

      onClose()
    } catch (error) {
      console.error("Sign In failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpSubmit = async (data) => {
    setIsLoading(true)

    try {
      const response = await signUp(data)
      const { token, user } = response.data

      setAuth({
        user,
        token,
      })

      resetSignUp()

      onClose()
    } catch (error) {
      console.error("Sign Up failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderSignIn = () => (
    <form
      onSubmit={handleSubmitSignIn(onSignInSubmit)}
      className="space-y-4 h-full flex flex-col"
    >
      <Input
        label="Email"
        type="email"
        {...registerSignIn("email", { required: "Email is required" })}
        error={errorsSignIn.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...registerSignIn("password", { required: "Password is required" })}
        error={errorsSignIn.password?.message}
      />
      <Button
        disabled={isLoading}
        type="submit"
        className="w-full mt-4"
      >
        {isLoading ? "Loading..." : "Sign In"}
      </Button>
    </form>
  )

  const renderSignUp = () => (
    <form
      onSubmit={handleSubmitSignUp(onSignUpSubmit)}
      className="space-y-4 h-full flex flex-col"
    >
      <Input
        label="Name"
        type="text"
        maxLength={20}
        {...registerSignUp("name", {
          required: "Name is required",
          maxLength: { value: 20, message: "Name must be at most 20 characters" },
        })}
        error={errorsSignUp.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...registerSignUp("email", {
          required: "Email is required",
        })}
        error={errorsSignUp.email?.message}
      />
      <Input
        label="Password"
        type="password"
        maxLength={50}
        {...registerSignUp("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
          maxLength: { value: 50, message: "Password must be at most 50 characters" },
        })}
        error={errorsSignUp.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        maxLength={50}
        {...registerSignUp("confirmPassword", { required: "Password Confirmation is required" })}
        error={errorsSignUp.confirmPassword?.message}
      />
      <Button
        disabled={isLoading}
        type="submit"
        className="w-full mt-4"
      >
        {isLoading ? "Loading..." : "Sign Up"}
      </Button>
    </form>
  )

  return (
    <Modal
      title={title}
      isOpen={isLoggedIn ? false : isOpen}
      onClose={onClose}
      className={className}
    >
      <div className="flex">
        <Button
          disabled={isLoading}
          onClick={() => {
            setSelectedTab("signUp")
          }}
          className={`link w-full py-4 border-t-2 transition-colors duration-300 ease-in-out ${
            selectedTab === "signUp"
              ? "text-primary border-t-primary border-r-primary"
              : "border-t-transparent border-r-transparent"
          }`}
        >
          Sign Up
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => {
            setSelectedTab("signIn")
          }}
          className={`link w-full py-4 border-t-2 transition-colors duration-300 ease-in-out ${
            selectedTab === "signIn"
              ? "text-primary border-t-primary border-l-primary"
              : "border-t-transparent border-l-transparent"
          }`}
        >
          Sign In
        </Button>
      </div>
      <div className="p-4 flex-1">{selectedTab === "signUp" ? renderSignUp() : renderSignIn()}</div>
    </Modal>
  )
}

export default AuthModal
