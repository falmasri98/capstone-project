import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../UI/Modal";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";

export default function UserForm() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          phonenumber: undefined,
          role: undefined,
          image: undefined,
          menuUrl: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: "",
            isValid: false,
          },
          phonenumber: {
            value: "",
            isValid: false,
          },
          role: {
            value: "",
            isValid: false,
          },
          category: {
            value: "",
            isValid: true,
          },
          image: {
            value: "",
            isValid: true,
          },
          menuUrl: {
            value: "",
            isValid: true,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
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
        // navigate(`/${responseData[0].role}/dashboard`);
        navigate("/");
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("username", formState.inputs.username.value);
        formData.append("phonenumber", formState.inputs.phonenumber.value);
        formData.append("role", formState.inputs.role.value);
        formData.append("category", formState.inputs.category.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("menuUrl", formState.inputs.menuUrl.value);

        const responseData = await sendRequest(
          "http://localhost:5000/api/users/register",
          "POST",
          formData
        );

        auth.login(responseData[0].id, responseData[0].token, responseData[0]);
        // navigate(`/${responseData[0].role}/dashboard`);
        navigate("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="w-100" data-aos="fade-up">
        {isLoading && <LoadingSpinner asOverlay />}
        {error && <Modal open={!!error} error={error} />}
        <h2 className="fw-bold mb-4">{!isLoginMode ? "Register" : "Login"}</h2>
        {!isLoginMode && (
          <p>
            Let's get you all set up so you can verify your personal account and
            begin setting up your profile
          </p>
        )}
        {isLoginMode && (
          <p>
            Thank you for get back to Good Food, Good Mood Website, lets access
            our the best recommendation for you.
          </p>
        )}
        <form onSubmit={authSubmitHandler} className="mt-5">
          {!isLoginMode && (
            <div>
              <div className="row d-flex align-items-center justify-content-center">
                <div className="col">
                  <Input
                    element="input"
                    id="username"
                    type="text"
                    label="Username"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter your username"
                    onInput={inputHandler}
                  />
                </div>
                <div className="col">
                  <Input
                    element="input"
                    id="phonenumber"
                    type="text"
                    label="Phone Number"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter your phone number"
                    onInput={inputHandler}
                  />
                </div>
                <div className="col">
                  <Input
                    id="role"
                    class="form-select"
                    label="Which best describe you?"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please select a valid role"
                    onInput={inputHandler}
                  >
                    <option defaultValue>select role</option>
                    <option value="user">User</option>
                    <option value="provider">Provider</option>
                  </Input>
                </div>
              </div>
              {formState.inputs.role.value === "provider" && (
                <div className="row">
                  <div className="col-lg-4">
                    <Input
                      element="input"
                      id="menuUrl"
                      type="text"
                      label="Menu Link"
                      validators={[VALIDATOR_REQUIRE()]}
                      errorText="Please enter a valid link"
                      onInput={inputHandler}
                    />
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col">
                  <Input
                    element="input"
                    id="email"
                    type="email"
                    label="Email"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address"
                    onInput={inputHandler}
                  />
                </div>
                <div className="col">
                  <Input
                    element="input"
                    id="password"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid password, at least 6 characters"
                    onInput={inputHandler}
                  />
                </div>
                {formState.inputs.role.value === "provider" && (
                  <div className="col">
                    <Input
                      id="category"
                      class="form-select"
                      label="Your Category"
                      validators={[VALIDATOR_REQUIRE()]}
                      errorText="Please select a valid category"
                      onInput={inputHandler}
                    >
                      <option defaultValue>select category</option>
                      <option value="food">Food</option>
                      <option value="sweet">Sweet</option>
                    </Input>
                  </div>
                )}
                {formState.inputs.role.value === "provider" && (
                  <div className="col">
                    <ImageUpload id="image" onInput={inputHandler} />
                  </div>
                )}
              </div>
            </div>
          )}
          {isLoginMode && (
            <div>
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
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters"
                onInput={inputHandler}
              />
            </div>
          )}
          {!isLoginMode && (
            <div className="mb-4 mt-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I agree to recieve newsletters and information from Good Food,
                  Good Mood by email and SMS
                </label>
              </div>
              <div id="formHelp" className="form-text mt-2 ms-4">
                By signing up you accept the Good Food, Good Mood{" "}
                <mark className="primary-form-color fw-bold">
                  privacy policy
                </mark>
              </div>
            </div>
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Sign In" : "Create Account"}
          </Button>
          {/* <div className="signUpButton">
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign Up With Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
          </div> */}
        </form>
        <h6 className="fw-bold mt-4 ">
          {!isLoginMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link onClick={switchModeHandler}>
            {!isLoginMode ? "Login" : "Signup"}
          </Link>
        </h6>
        {/* <div className="w-100 d-flex justify-content-end">
          <Switch
            switchModeHandler={switchModeHandler}
            formState={!isLoginMode ? "login" : "signup"}
          />
        </div> */}
      </div>
    </React.Fragment>
  );
}
