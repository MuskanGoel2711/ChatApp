export const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };
  
  export const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };
  
  export const validateName = (text: string) => {
    const nameRegex = /^[A-Za-z]{3,}$/;
    return nameRegex.test(text);
  };
  
  export const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[0-9]{5,13}$/;
    return phoneRegex.test(number);
  };