const EMAIL_REGEX = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,3}$/i;
const numberPattern = /^[0-9]*$/;
const negative = /^[1-9]\d*$/;
// const nombreRepuesto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ][a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,68}(?: [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{4,68})*[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/;

// VALIDACION PARA EL CODIGO DE COMPRAS
const codigoCompraValidacion = /^[a-zA-Z0-9]{6,}$/


export const EmailRequired = {
  required: "Campo requerido",
  pattern: {
    value: EMAIL_REGEX,
    message: "Email es invalido",
  },
};

export const EmailCliente = {
  pattern: {
    value: EMAIL_REGEX,
    message: "Email es invalido",
  },
};


export const PasswordRequire = {
  required: "Campo requerido",
  minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" },
  maxLength: { value: 12, message: "La contraseña no puede tener más de 12 caracteres" },
  validate: (value) => /^[^\s]+$/.test(value) || "La contraseña no puede contener espacios",
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
    value: 10,
    message: "El maximo de caracteres es de 12"
  },
  minLength: {
    value: 7,
    message: "El minimo de caracteres es de 7"
  }
};



export const nombre_RepuestoValidacion = {
  required: "Campo requerido",
  validate: (value) => /^(?! +$)[A-Za-z0-9\s]+$/.test(value.trim()) || "No se permite solo espacio",
  maxLength: { value: 50, message: "Maximo 50 caracteres"},
  minLength: { value: 4, message: "Minimo 4 caracteres"}
};

export const codeCompra = {
  required: "Campo requerido",
  pattern: {
    required: 'Campo requerido',
    value: codigoCompraValidacion,
    message: "Ingrese un codigo correcto",
  },
};




export const NegativeRequired = {
  required: "Campo requerido",
  pattern: {
    value: negative,
    message: "Solo numeros mayores a cero ",
  },
};

export const NombreRequired = {
  required: "Campo requerido",
};

export const NombreRepuestoRequired = {
  required: "Campo requerido",
  validate: (value) => /^(?! +$)[A-Za-z0-9\s]+$/.test(value.trim()) || "No se permite solo espacio",
  maxLength: { value: 50, message: "Maximo 50 caracteres"},
  minLength: { value: 4, message: "Minimo 4 caracteres"}
};



export const fecha = {
  required: "Campo requerido",
  message: "Solo puedes ingresar una fecha del año actual"
};



export const RepuestoRequired = {
  required: "Campo requerido ",
  message: "Campo requerido ¿"
};

export const ClienteRequired = {
  required: "El cliente es requerido",
};

export const EstadoRequired = {
  required: "Campo requerido",
};

export const MecanicoRequired = {
  required: "El mecanico es requerido",
};

// Estas validaciones fueron hechas por Sara
export const DireccionRequired = {
  required: "Campo requerido",
  validate: (value) => /^(?! +$)[A-Za-z0-9\s#-]+$/.test(value.trim()) || "Ingrese una dirección valida",
  maxLength: { value: 70, message: "Máximo 70 caracteres"},
  minLength: { value: 10, message: "Mínimo 10 caracteres"}
};

export const NombreMeRequired = {
  required: "Campo requerido",
  validate: (value) => /^[A-Za-z\s]+$/.test(value.trim()) || "Ingresa un nombre valido",
  maxLength: { value: 75, message: "El maximo de caracteres es de 75"},
  minLength: { value: 6, message: "Ingresa el nombre completo, minimo 6 caracteres"}
};

export const NombreMaRequired = {
  required: "Campo requerido",
  validate: (value) => /^(?! +$)[A-Za-z0-9\s]+$/.test(value.trim()) || "Ingresa un nombre valido",
  maxLength: { value: 50, message: "Maximo 50 caracteres"},
  minLength: { value: 4, message: "Minimo 4 caracteres"}
};

export const PasaporteRequired = {
  required: "Campo requerido",
  validate: (value) => /^(?=(.*[A-Za-z]){4})(?=(.*\d){4})[A-Za-z0-9\s]+$/.test(value.trim()) || "Debe contener al menos 4 letras y 4 números",
  maxLength: { value: 16, message: "Máximo 16 caracteres" },
  minLength: { value: 8, message: "Mínimo 8 caracteres" }
};

//-----------------------------------------------------------



