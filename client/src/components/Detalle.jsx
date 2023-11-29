import React, { useEffect, useState } from 'react';
import { useClientes } from '../context/ClientContext';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

export default function Detalle({ id, metodo,children }) {
  const [open, setOpen] = useState(false);
  // const { getCliente } = useClientes();

  const handleOpen = async () => {
    try {
       await metodo(id);

      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className='rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500'>
       <Button onClick={handleOpen} style={{ color: 'white', textTransform: 'none',  }}>Detalle</Button>
      <Modal
        open={open} 
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-slate-700 shadow-lg shadow-blue-600/40 p-14">

              {children}
           
          
        </div>
      </Modal>
    </div>
  );
}
