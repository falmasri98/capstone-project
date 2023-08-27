import React from "react";
import "./AddNewAdmin.css";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../../shared/util/validators";

import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";

export default function AddNewAdmin() {

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
    },
    false
  );

  const addNewAdminHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/admin/add-new-admin",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          username: formState.inputs.username.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-admin__container">
      {isLoading && <LoadingSpinner asOverlay />}
      <h4 className="fw-bold">Add new Admin</h4>
      <form onSubmit={addNewAdminHandler}>
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
      <Button type="submit" disabled={!formState.isValid}>
            Add New Admin
          </Button>
      </form>
      
    </div>
  );
}
