import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import useAuthStore from "../../store/useAuthStore"
import useAdminStore from "../../store/useAdminStore"
import { signUpSchema, signInSchema } from "../../zod-schemas/auth.schemas"
import { signIn, signUp } from "../../api/auth.api"

import Modal from "../common/Modal"
import Input from "../common/Input"
import Button from "../common/Button"

// famous tech people for placeholder
const famousNames = [
  "Alan Turing",
  "Bill Gates",
  "Grace Hopper",
  "Linus Torvalds",
  "Steve Wozniak",
  "Steve Jobs",
  "Mark Zuckerberg",
  "John Doe",
]

const AuthModal = ({ title, isOpen, onClose, className }) => {
  const [selectedTab, setSelectedTab] = useState("signUp")

  // const [isLoading, setIsLoading] = useState(false)
  const randomName = famousNames[Math.floor(Math.random() * famousNames.length)]

  const setAuth = useAuthStore((state) => state.setAuth)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const setTags = useAdminStore((state) => state.setTags)

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    reset: resetSignIn,
    setError: setSignInError,
    formState: { errors: signInError, isSubmitting: isSignInSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    criteriaMode: "all",
  })

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset: resetSignUp,
    setError: setSignUpError,
    formState: { errors: signUpError, isSubmitting: isSignUpSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    criteriaMode: "all",
  })

  const onSignInSubmit = async (data) => {
    try {
      const response = await signIn(data)
      const { token, user, tags } = response.data

      setAuth({
        user,
        token,
      })

      if (user.role === "ADMIN") {
        setTags(tags)
      }

      resetSignIn()

      onClose()
    } catch (error) {
      console.error("Sign In failed:", error)
      setSignInError("root", { message: error?.response?.data?.error || "sign in failed" })
    } finally {
      resetSignIn()
      resetSignUp()
    }
  }

  const onSignUpSubmit = async (data) => {
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
      setSignUpError("root", { message: error?.response?.data?.error || "sign up failed" })
    } finally {
      resetSignIn()
      resetSignUp()
    }
  }

  const renderSignIn = () => {
    return (
      <form
        onSubmit={handleSubmitSignIn(onSignInSubmit)}
        className="gap-4 h-full flex flex-col"
        noValidate // removes browser's native validation, so validation will be more consistent
        key="signInForm"
      >
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          {...registerSignIn("email")}
          error={signInError.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="password"
          {...registerSignIn("password")}
          error={signInError.password?.message}
        />

        {signInError.root?.message ? (
          <span className="mt-1 text-xs text-red">{signInError.root.message}</span>
        ) : (
          ""
        )}

        <Button
          isPending={isSignInSubmitting}
          type="submit"
          variant="primary"
          className="w-full mt-4"
        >
          Sign In
        </Button>
      </form>
    )
  }

  const renderSignUp = () => {
    return (
      <form
        onSubmit={handleSubmitSignUp(onSignUpSubmit)}
        className="gap-4 h-full flex flex-col"
        noValidate
        key="signUpForm"
      >
        <Input
          label="Name"
          type="text"
          placeholder={randomName}
          maxLength={20}
          {...registerSignUp("name")}
          error={signUpError.name?.message}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          {...registerSignUp("email")}
          error={signUpError.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="password"
          maxLength={50}
          {...registerSignUp("password")}
          error={signUpError.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="password"
          maxLength={50}
          {...registerSignUp("confirmPassword")}
          error={signUpError.confirmPassword?.message}
        />
        {signUpError.root?.message ? (
          <span className="mt-1 text-xs text-red">{signUpError.root.message}</span>
        ) : (
          ""
        )}
        <Button
          isPending={isSignUpSubmitting}
          type="submit"
          variant="primary"
          className="w-full mt-4"
        >
          Sign Up
        </Button>
      </form>
    )
  }

  const renderTabButtons = () => {
    return (
      <div className="flex">
        <Button
          disabled={isSignUpSubmitting || isSignUpSubmitting}
          onClick={() => {
            setSelectedTab("signUp")
          }}
          variant="empty"
          wrapperClassName={`w-full flex-1/2`}
          className={`link transition-smooth py-4 w-full flex-1/2 border-t-2 rounded-none rounded-tl ${
            selectedTab === "signUp"
              ? "text-primary-gradient border-t-primary border-r-primary"
              : "border-t-transparent border-r-transparent"
          }`}
        >
          Sign Up
        </Button>
        <Button
          disabled={isSignUpSubmitting || isSignUpSubmitting}
          onClick={() => {
            setSelectedTab("signIn")
          }}
          variant="empty"
          wrapperClassName={`w-full flex-1/2`}
          className={`link transition-smooth py-4 w-full flex-1/2 border-t-2 rounded-none rounded-tr ${
            selectedTab === "signIn"
              ? "text-primary-gradient border-t-primary border-l-primary"
              : "border-t-transparent border-l-transparent"
          }`}
        >
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <Modal
      title={title}
      isOpen={isLoggedIn ? false : isOpen}
      onClose={onClose}
      className={className}
    >
      {renderTabButtons()}
      <div className="p-4 flex-1">{selectedTab === "signUp" ? renderSignUp() : renderSignIn()}</div>
    </Modal>
  )
}

export default AuthModal
