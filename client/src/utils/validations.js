const EMAIL_REGEX = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,3}$/i;
const numberPattern = /^[0-9]*$/;
const negative = /^[1-9]\d*$/;
// const nombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;


export const EmailRequired = {
  required: "Campo requerido",
  pattern: {
    value: EMAIL_REGEX,
    message: "Email es invalido",
  },
};

export const PasswordRequire = {
  required: "Campo requerido",
  minLength: {
    value: 6,
    message: "Password debe tener minimo 6 caracteres",
  },
};

export const TelefonoRequired = {
  required: "Campo requerido",
  maxLength: {
    value: 10,
    message: "El máximo de digitos es de 10",
  },
  minLength: {
    value: 7,
    message: "El telefono debe tener entre 7 y 10 digitos"
  },
  pattern: {
    value: numberPattern,
    message: "Telefono solo contiene numeros",
  },
};
export const CedulaRequired = {
  required: "Campo requerido",
  pattern: {
    value: numberPattern,
    message: "Cedula solo contiene numeros ",
  },
  maxLength: {
    value: 12,
    message: "El maximo de caracteres es de 12"
  },
  minLength: {
    value: 8,
    message: "El minimo de caracteres es de 8"
  }
};


export const NegativeRequired = {
  required: "Campo requerido",
  pattern: {
    value: negative,
    message: "Solo numeros positivos ",
  },
};

export const NombreRequired = {
  required: "Campo requerido",
};


export const RepuestoRequired = {
  required: "Campo requerido ",
};

export const ClienteRequired = {
  required: "Campo requerido ",
};

export const EstadoRequired = {
  required: "Campo requerido",
};

export const MecanicoRequired = {
  required: "Campo requerido",
};
