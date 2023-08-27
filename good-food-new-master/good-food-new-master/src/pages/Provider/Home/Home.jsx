import React, { useState } from "react";
import "./Home.css";

import Input from "../../../shared/components/FormElements/Input";
import Button from "../../../shared/components/FormElements/Button";
import SuccessModal from "../../../UI/SuccessModal";

import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";

import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { useAuth } from "../../../hooks/auth-hook";

export default function Home() {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { userId } = useAuth();

  const [formState, inputHandler, setFormData] = useForm(
    {
      type: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [activeCategory, setActiveCategory] = useState("food");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleCloseModal = () => setOpenSuccessModal(false);

  const foodOptions = (
    <Input
      id="category"
      class="form-select"
      label="Select food type"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please select a valid type"
      onInput={inputHandler}
    >
      <option defaultValue value="fast_food">
        Fast Food
      </option>
      <option value="arabian food">Arabian Food</option>
      <option value="indian food">Indian Food</option>
      <option value="healthy food">Healthy Food</option>
      <option value="Italain food">Italain Food</option>
    </Input>
  );

  const sweetOptions = (
    <Input
      id="category"
      class="form-select"
      label="Select sweet type"
      validators={[VALIDATOR_REQUIRE()]}
      errorText="Please select a valid type"
      onInput={inputHandler}
    >
      <option defaultValue value="ice_cream">
        Ice Cream
      </option>
      <option value="Donats">Donats</option>
    </Input>
  );

  const handleActiveCategory = (category) => {
    setActiveCategory(category);
  };

  const createSurpriseBag = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/providers/add-new-service",
        "POST",
        JSON.stringify({
          serviceType: formState.inputs.type.value,
          serviceCategory: formState.inputs.category.value,
          providerId: userId
        }),
        {
          "Content-Type": "application/json",
        }
      );

      if(responseData["serviceAdded"]) {
        setOpenSuccessModal(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="provider-home__container">
      <SuccessModal open={openSuccessModal} close={handleCloseModal}>
        <h4>Service has been added successfully</h4>
        <lottie-player src="https://assets8.lottiefiles.com/packages/lf20_jbrw3hcz.json"  background="transparent"  speed="1"  style={{width: "300px", height: "300px"}}  loop autoplay></lottie-player>
      </SuccessModal>
     <div className="d-flex gap-2">
     <img width="28" height="28" src="https://img.icons8.com/fluency/28/gift--v2.png" alt="gift--v2"/>
      <h4 className="fw-bold mb-4">Add new surprise bag</h4>
     </div>
      <form onSubmit={createSurpriseBag}>
        <Input
          id="type"
          class="form-select"
          label="Select bag type"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please select a valid type"
          onInput={inputHandler}
          handleActiveCategory={handleActiveCategory}
        >
          <option defaultValue value="food">
            Food
          </option>
          <option value="sweet">Sweet</option>
        </Input>
        {activeCategory === "food" ? foodOptions : sweetOptions}
        <Button type="submit" disabled={!formState.isValid}>
          Create Surprise Bag
        </Button>
      </form>
    </div>
  );
}
