const EMAIL_REGEX = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
const numberPattern = /^[0-9]*$/;

export const EmailRequired = {
  required: 'Email es requerido',
  pattern: {
    value: EMAIL_REGEX,
    message: 'Email es invalido',
  },
};

export const PasswordRequire = {
  required: 'Password es requerido',
  minLength: {
    value: 6,
    message: 'Password debe tener minimo 6 caracteres',
  },
};

export const TelefonoRequired = {
  required: "Telefono es requerido",
  maxLength:{
    value: 10,
    message: "el telefono solo debe tener 10 digitos"
  },
  pattern: {
    value: numberPattern,
    message: "Telefono solo contiene numeros"
  }
}
export const CedulaRequired = {
  required: "Cedula es requerido",
  pattern: {
    value: numberPattern,
    message: "Telefono solo contiene numeros"
  }
}
export const NombreRequired = {
  required: "Nombre es requerido"
}
