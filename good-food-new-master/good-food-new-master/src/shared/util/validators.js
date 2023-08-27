const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_EMAIL = "EMAIL";
const VALIDATOR_TYPE_FILE = "FILE";

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val) => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_MAX = (val) => ({ type: VALIDATOR_TYPE_MAX, val: val });
export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
  }
  return isValid;
};

export const validateCreditCard = () => {
  let ccNumberInput = document.querySelector(".cc-number-input"),
    ccNumberPattern = /^\d{0,16}$/g,
    ccNumberSeparator = " ",
    ccNumberInputOldValue,
    ccNumberInputOldCursor,
    ccExpiryInput = document.querySelector(".cc-expiry-input"),
    ccExpiryPattern = /^\d{0,4}$/g,
    ccExpirySeparator = "/",
    ccExpiryInputOldValue,
    ccExpiryInputOldCursor,
    ccCVCInput = document.querySelector(".cc-cvc-input"),
    ccCVCPattern = /^\d{0,3}$/g,
    mask = (value, limit, separator) => {
      var output = [];
      for (let i = 0; i < value.length; i++) {
        if (i !== 0 && i % limit === 0) {
          output.push(separator);
        }

        output.push(value[i]);
      }

      return output.join("");
    },
    unmask = (value) => value.replace(/[^\d]/g, ""),
    checkSeparator = (position, interval) =>
      Math.floor(position / (interval + 1)),
    ccNumberInputKeyDownHandler = (e) => {
      let el = e.target;
      ccNumberInputOldValue = el.value;
      ccNumberInputOldCursor = el.selectionEnd;
    },
    ccNumberInputInputHandler = (e) => {
      let el = e.target,
        newValue = unmask(el.value),
        newCursorPosition;

      if (newValue.match(ccNumberPattern)) {
        newValue = mask(newValue, 4, ccNumberSeparator);

        newCursorPosition =
          ccNumberInputOldCursor -
          checkSeparator(ccNumberInputOldCursor, 4) +
          checkSeparator(
            ccNumberInputOldCursor +
              (newValue.length - ccNumberInputOldValue.length),
            4
          ) +
          (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

        el.value = newValue !== "" ? newValue : "";
      } else {
        el.value = ccNumberInputOldValue;
        newCursorPosition = ccNumberInputOldCursor;
      }

      el.setSelectionRange(newCursorPosition, newCursorPosition);

      highlightCC(el.value);
    },
    highlightCC = (ccValue) => {
      let ccCardType = "",
        ccCardTypePatterns = {
          amex: /^3/,
          visa: /^4/,
          mastercard: /^5/,
          disc: /^6/,

          genric: /(^1|^2|^7|^8|^9|^0)/,
        };

      for (const cardType in ccCardTypePatterns) {
        if (ccCardTypePatterns[cardType].test(ccValue)) {
          ccCardType = cardType;
          break;
        }
      }

      let activeCC = document.querySelector(".cc-types__img--active"),
        newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

      if (activeCC) activeCC.classList.remove("cc-types__img--active");
      if (newActiveCC) newActiveCC.classList.add("cc-types__img--active");
    },
    ccExpiryInputKeyDownHandler = (e) => {
      let el = e.target;
      ccExpiryInputOldValue = el.value;
      ccExpiryInputOldCursor = el.selectionEnd;
    },
    ccExpiryInputInputHandler = (e) => {
      let el = e.target,
        newValue = el.value;

      newValue = unmask(newValue);
      if (newValue.match(ccExpiryPattern)) {
        newValue = mask(newValue, 2, ccExpirySeparator);
        el.value = newValue;
      } else {
        el.value = ccExpiryInputOldValue;
      }
    };

  ccNumberInput.addEventListener("keydown", ccNumberInputKeyDownHandler);
  ccNumberInput.addEventListener("input", ccNumberInputInputHandler);

  ccExpiryInput.addEventListener("keydown", ccExpiryInputKeyDownHandler);
  ccExpiryInput.addEventListener("input", ccExpiryInputInputHandler);
};
