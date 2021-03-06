document.querySelector("main").insertAdjacentHTML("beforebegin", '<div id="user-messages"></div>');

export const addSuccessMessage = (message) => {
  if(!message){
    return;
  }

  const messagesContainer = document.getElementById("user-messages");
  messagesContainer.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
  const newMessageElement = messagesContainer.firstChild;
  setTimeout(() => newMessageElement.remove(), 3000);
};


const validateForm = (onSuccess) => (event) => {
  event.preventDefault();
  const inputs = [
    ...Array.from(event.target.querySelectorAll("input")), 
    ...Array.from(event.target.querySelectorAll("select")), 
    ...Array.from(event.target.querySelectorAll("textarea"))
  ];
  const formIsValid = inputs
      .map(validateInput)
      .every(valid => valid);  

  if(formIsValid){
    onSuccess();
    event.target.closest("form").reset();
  }
}

const parseNumberOrDefault = (number, fallback) => {
  if (typeof number === "string") {
    number = parseFloat(number);
  }

  if (typeof number === "number" && !Number.isNaN(number)) {
    return number;
  }

  return fallback;
}

const requiredCheckValue = (value, checked, type) => {
  if(type !== "checkbox"){
    return value;
  }

  if(checked){
    return "checked";
  } else {
    return "";
  }
}

const validateInput = (inputElement) => {
  const {name, value, required, type, checked} = inputElement;
  const numberField = inputElement.getAttribute("data-numberfield");
  const minlength = parseNumberOrDefault(inputElement.getAttribute("data-minlength"), 0);
  const dataLength = parseNumberOrDefault(inputElement.getAttribute("data-length"), 0);
  
  let errorMessages = [];
  if(required){
    errorMessages.push(validateRequired(requiredCheckValue(value, checked, type), name));
  }
  if(numberField){
    errorMessages.push(validateNumbersOnly(value, name));
  }
  if(type === "email"){
    errorMessages.push(validateEmail(value, name));
  }
  if(minlength > 0){
    errorMessages.push(validateMinLength(value, minlength, name));
  }
  if(dataLength > 0){
    errorMessages.push(validateDataLength(value, dataLength, name));
  }


  const errorMessage = errorMessages.join("")
  document.getElementById(`${name}Error`).innerHTML = errorMessage;
  if (errorMessage === ""){
      inputElement.classList.remove("invalid");
      return true;
  } else {
      inputElement.classList.add("invalid");
      return false;
  };
}

const validateRequired = (value, name) => {
  if(!value || value.trim().length === 0){
      return /*template*/`<p>${upperCaseFirst(name)} is required.</p>`
  } else {
      return "";
  }
}

const validateEmail = (value, name) => { 
  const regEx = /\S+@\S+\.\S+/;
  if (!value || regEx.test(value)){
      return "";
  } else {
      return /*template*/`<p>${upperCaseFirst(name)} must contain at least @ and a domain. I.e "test@example.com".</p>`;
  }
}

const validateNumbersOnly = (value, name) => { 
  const regEx = /^\d*$/;
  if (regEx.test(value)){
      return "";
  } else {
      return /*template*/`<p>${upperCaseFirst(name)} may only contain numbers.</p>`;
  }
}

const validateDataLength = (value, dataLength, name) => { 
  if(value.trim().length !== dataLength){
    return /*template*/`<p>${upperCaseFirst(name)} must have ${dataLength} numbers without leading or trailing spaces. Currently has ${value.trim().length}</p>`
} else {
    return "";
  }
}

const validateMinLength = (value, minLength, name) => {
  if(!value || value.trim().length < minLength){
      return /*template*/`<p>${upperCaseFirst(name)} must be at least ${minLength} without leading or trailing spaces.</p>`
  } else {
      return "";
  }
}



const upperCaseFirst = (value) => value.charAt(0).toUpperCase() + value.substr(1);

const validateInputEventHandler = (event) => {
  validateInput(event.target);
}

const addValidationToForm = (formId, onSuccess) => {
  const form = document.getElementById(formId);
  const inputs = [
    ...form.querySelectorAll("input"), 
    ...form.querySelectorAll("select"), 
    ...form.querySelectorAll("textarea")
  ]

  form.addEventListener("submit", validateForm(onSuccess));
  inputs.forEach(input => input.addEventListener("input", validateInputEventHandler));
}

export default addValidationToForm;