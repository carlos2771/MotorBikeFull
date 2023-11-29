import React, { useEffect, useState } from 'react';
import { useClientes } from '../context/ClientContext';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

export default function Detalle({ id }) {
  const [open, setOpen] = useState(false);
  const [clienteGet, setClienteGet] = useState(null);
  const { getCliente } = useClientes();

  const handleOpen = async () => {
    try {
      const cliente = await getCliente(id);
      setClienteGet(cliente);
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className='px-2 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500'>
       <Button onClick={handleOpen} style={{ color: 'white', textTransform: 'none',  }}>Detalle</Button>
      <Modal
        open={open} 
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-700 shadow-lg shadow-blue-600/40 p-14">
          {clienteGet && (
            <div>
              <p className="">{clienteGet.nombre_cliente}</p>
              <p className="">{clienteGet.sexo}</p>
              <p className="">{clienteGet.email_cliente}</p>
              <p className="">{clienteGet.telefono_cliente}</p>
              <p className="">{clienteGet.cedula}</p>
              {/* Agrega aquí el resto de la información que deseas mostrar */}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
