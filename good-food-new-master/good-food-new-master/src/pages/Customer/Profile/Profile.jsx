import React from "react";
import "./Profile.css";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";

import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from "../../../shared/util/validators";

export default function Profile({ fetchUserData, userData }) {
  const { sendRequest } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: true,
      },
      password: {
        value: "",
        isValid: true,
      },
      username: {
        value: "",
        isValid: true,
      },
      phonenumber: {
        value: "",
        isValid: true,
      },
    },
    false
  );

  const userUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/users/update-user-info/${userData.id}`,
        "PATCH",
        JSON.stringify({
          email: formState.inputs.email.value,
          username: formState.inputs.username.value,
          phonenumber: formState.inputs.phonenumber.value,
          password: formState.inputs.password.value
        }),
        {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + auth.token,
        }
      );

      fetchUserData();
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="provider-profile__container">
      {/* <div className="profile-avatar">
        <img
          src={`http://localhost:5000/${userData?.image}`}
          alt={userData?.username}
        />
      </div> */}
      <div className="profile-username mt-4">
        <h3 className="fw-bold">{userData?.username}</h3>
      </div>
      <div className="row w-100 px-4 mt-5">
        <h4 className="fw-bold mb-2">Edit Profile</h4>
        {userData && (
          <form onSubmit={userUpdateSubmitHandler}>
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
                  initialValue={userData.username}
                  initialValid={true}
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
                  initialValue={userData.phonenumber}
                  initialValid={true}
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
                  initialValue={userData.email}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
              <div className="col">
              <Input
                  element="input"
                  id="password"
                  type="password"
                  label="New Password"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter a valid password"
                  initialValue={userData.password}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <Button type="submit" disabled={!formState.isValid}>
            Save Changes
          </Button>
          </form>
        )}
      </div>
    </div>
  );
}
