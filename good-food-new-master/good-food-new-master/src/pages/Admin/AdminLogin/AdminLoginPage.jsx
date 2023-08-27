import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { AuthContext } from "../../../context/auth-context";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import Modal from "../../../UI/Modal";

export default function AdminLoginPage() {

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { error, sendRequest } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const adminLoginHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/admin/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(responseData[0].id, responseData[0].token, responseData[0]);
      navigate("/admin/dashboard");
    } catch (err) {}
  };

  return (
    <div className="admin-login__container">
      {error && <Modal open={!!error} error={error} />}
      <div className="row w-100 p-2">
        <div className="col-xs-12 col-lg-4 px-4 center">
          <h1 className="fw-bold mb-2 text-center">Welcome Back</h1>
          <h6 className="mb-5 text-center">Please enter your details</h6>
          <form onSubmit={adminLoginHandler} className="w-100">
            <Input
              element="input"
              id="email"
              type="email"
              label="Email"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address"
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(3)]}
              errorText="Please enter a valid password, at least 6 characters"
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
            Sign in
          </Button>
          </form>
        </div>
        <div className="col-xs-12 col-lg-8 center">
        <lottie-player src="https://assets8.lottiefiles.com/private_files/lf30_m6j5igxb.json"  background="transparent"  speed="1"  style={{width: "500px", height: "500px"}}  loop  autoplay></lottie-player>
        </div>
      </div>
    </div>
  );
}
