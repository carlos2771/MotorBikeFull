const EMAIL_REGEX = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,3}$/i;
const numberPattern = /^[0-9]*$/;

// VALIDACIÓN PARA CANTIDADES
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



// VALIDACIÓN PARA VALIDAR EL NOMBRE DEL REPUESTO
export const NombreRepuestoRequired = {
  required: "Requerido",
  validate: (value) => {
    if (!value.trim()) {
      return "Este campo no puede estar vacío";
    }
    return /^[A-Za-z0-9\s.,()_\-¡!@#$%^&*;:'"+=\/\\<>?[\]{}|`~]{4,50}$/.test(value) || "Solo se permiten letras, números y algunos caracteres especiales";
  },
  maxLength: { value: 50, message: "Máximo 50 caracteres" },
  minLength: { value: 4, message: "Mínimo 4 caracteres" }
}


// VALIDACIÓN PARA VALIDAR EL NOMBRE DEL REPUESTO
export const NombreProveedor = {
  required: "Requerido",
  validate: (value) => {
    if (!value.trim()) {
      return "Valor incorrecto";
    }
    return /^[A-Za-z0-9\s.,()_-]{4,50}$/.test(value) || "Valor incorrecto";
  },
  maxLength: { value: 50, message: "Máximo 50 " },
  minLength: { value: 4, message: "Mínimo 4" }
}

// VALIDACIÓN PARA VALIDAR LA CANTIDAD DEL REPUESTO
export const NegativeRequired = {
  required: "Requerido",
  validate: (value) => /^[1-9]\d*$/.test(value) || "Valor incorrecto",
  maxLength: { value: 50, message: "Máximo 50" },
  minLength: { value: 1, message: "Mínimo 4" }
};

// export const PasswordRequire = {
//   required: "Campo requerido",
//   minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
//   maxLength: { value: 15, message: "La contraseña no puede tener más de 15 caracteres" },
  
// };

export const PasswordRequire = {
  required: "Campo requerido",
  minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
  maxLength: { value: 15, message: "La contraseña no puede tener más de 15 caracteres" },
  validate: (value) => {
    if (!value.trim()) {
      return "La contraseña no puede estar vacía ni contener solo espacios.";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,15}$/.test(value)) {
      return "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (puede ser '.', ',' o '@$!%*?&').";
    }
    return true;
  }
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
    message: "Debe contener solo numeros",
  },
  maxLength: {
    value: 10,
    message: "El maximo de caracteres es de 10"
  },
  minLength: {
    value: 7,
    message: "El minimo de caracteres es de 7"
  },
  validate: {
    noLeadingZero: value => {
      if (value.charAt(0) === '0') {
        return "La cédula no puede empezar con cero";
      }
      return true;
    }
  }
};



export const nombre_RepuestoValidacion = {
  required: "Campo requerido",
  validate: (value) => /^(?! +$)[A-Za-z0-9\s\/]+$/.test(value.trim()) || "No se permite solo espacio",
  maxLength: { value: 50, message: "Máximo 50 caracteres" },
  minLength: { value: 4, message: "Mínimo 4 caracteres" }
};



export const codeCompra = {
  required: "Campo requerido",
  pattern: {
    required: 'Campo requerido',
    value: codigoCompraValidacion,
    message: "Ingrese un codigo correcto",
  },
};





export const NombreRequired = {
  required: "Campo requerido",
};

export const placaValidators = {
  required: "Placa requerida",
  pattern: {
    value: /^[a-zA-Z0-9]+$/,
    message: "La placa solo puede contener letras y números"
  },
  minLength: {
    value: 5,
    message: "La placa debe tener al menos 5 caracteres"
  },
  maxLength: {
    value: 6,
    message: "La placa no puede tener más de 6 caracteres"
  }
};







export const fecha = {
  required: "Campo requerido",
  message: "Solo puedes ingresar una fecha del año actual"
};



export const RepuestoRequired = {
  required: "Requerido ",
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
  maxLength: { value: 70, message: "Máximo 70 caracteres" },
  minLength: { value: 10, message: "Mínimo 10 caracteres" }
};

export const NombreMeRequired = {
  required: "Campo requerido",
  validate: (value) => /^[A-Za-z\s]+$/.test(value.trim()) || "Ingresa un nombre valido",
  maxLength: { value: 35, message: "El maximo de caracteres es de 35" },
  minLength: { value: 6, message: "Ingresa el nombre completo, minimo 6 caracteres" }
};

export const NombreMaRequired = {
  required: "Campo requerido",
  validate: (value) => /^(?! +$)[A-Za-z0-9\s]+$/.test(value.trim()) || "Ingresa un nombre valido",
  maxLength: { value: 50, message: "Maximo 50 caracteres" },
  minLength: { value: 2, message: "Minimo 2 caracter" }
};

// export const PasaporteRequired = {
//   required: "Campo requerido",
//   validate: (value) => /^(?=(.*[A-Za-z]){4})(?=(.*\d){4})[A-Za-z0-9\s]+$/.test(value.trim()) || "Debe contener al menos 4 letras y 4 números",
//   maxLength: { value: 16, message: "Máximo 16 caracteres" },
//   minLength: { value: 8, message: "Mínimo 8 caracteres" }
// };

export const CedulaExtRequired = {
  required: "Campo requerido",
  pattern: {
    value: numberPattern,
    message: "Debe contener solo numeros",
  },
  maxLength: {
    value: 12,
    message: "El maximo de caracteres es de 12"
  },
  minLength: {
    value: 6,
    message: "El minimo de caracteres es de 6"
  }
};
export const NumeroRequired = {
  pattern: {
    value: numberPattern,
    message: "Debe contener solo numeros y positivos",
  },
};

//-----------------------------------------------------------



export const NombreRolRequired = {
  required: "Campo requerido",
  validate: (value) => /^[A-Za-z\s]+$/.test(value.trim()) || "Ingresa un nombre valido",
  maxLength: { value: 35, message: "El maximo de caracteres es de 35" },
  minLength: { value: 6, message: "Ingresa el nombre completo, minimo 6 caracteres" }
};