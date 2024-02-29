import React, { useEffect, useState } from 'react';
import { useClientes } from '../context/ClientContext';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
export default function Detalle({ id, metodo, children }) {
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
      <Button onClick={handleOpen} style={{ color: 'white', textTransform: 'none' }}> <FontAwesomeIcon icon={faCircleInfo} /></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-3/4 bg-slate-700 shadow-lg shadow-blue-600/40 p-6 rounded-lg overflow-y-auto flex flex-col justify-center items-center">
          {children}

          <div className="flex justify-end">
            <button className="px-5 py-1 mt-4 text-sm rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>

      </Modal>

    </div>
  );
}
