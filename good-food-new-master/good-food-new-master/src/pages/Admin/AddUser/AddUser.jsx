import React from "react";
import "./AddUser.css";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import ImageUpload from "../../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../../shared/util/validators";

import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";

export default function AddUser() {

  const { isLoading, sendRequest } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      username: {
        value: "",
        isValid: false,
      },
      phonenumber: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      menuUrl: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const addNewUserHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", formState.inputs.email.value);
    formData.append("password", formState.inputs.password.value);
    formData.append("username", formState.inputs.username.value);
    formData.append("phonenumber", formState.inputs.phonenumber.value);
    formData.append("role", "provider");
    formData.append("image", formState.inputs.image.value);
    formData.append("menuUrl", formState.inputs.menuUrl.value);

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/register",
        "POST",
        formData,
      );
 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-user__container">
      {isLoading && <LoadingSpinner asOverlay />}
      <h4 className="fw-bold">Add new user (provider)</h4>
      <form onSubmit={addNewUserHandler}>
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
        
      </div>
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
      </div>
      <div className="row">
      <div className="col-lg-12">
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
      <div className="row">
      <div className="col">
        <ImageUpload id="image" onInput={inputHandler} />
        </div>
      </div>
      <Button type="submit" disabled={!formState.isValid}>
            Add user
          </Button>
      </form>
      
    </div>
  );
}
