import { z } from "zod";
import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/authService";
import { useContext } from "react";
import { UserAuthContext } from "../AuthProvider";

const loginUserSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(3),
});

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(UserAuthContext);
  const [error,setError]= useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange", resolver: zodResolver(loginUserSchema) });
  async function handleFormSubmit(data) {
    setError(null);
    try {
      console.log(data);
    
      const response = await loginUser(data);
      const{user,error} = response;
      if (user) {
        login(user);
        navigate("/");
      } else {
        console.log(error);
        setError(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input {...register("email")}></input>
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input {...register("password")}></input>
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          Login
        </button>
      </form>
    </>
  );
}

export default LoginForm;
