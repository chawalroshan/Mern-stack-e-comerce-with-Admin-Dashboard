import Button from '@mui/material/Button';
import React, { useContext } from 'react';
import { FaPlus } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { FiEdit, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import SearchBox from '../../components/SearchBox/SearchBox';
import { MyContext } from '../../App';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const columns = [
  { id: 'userImg', label: 'User Image', minWidth: 80 },
  { id: 'UserName', label: 'User Name', minWidth: 150 },
  { id: 'userEmail', label: 'User Email', minWidth: 170 },
  { id: 'userPhone', label: 'User Phone Number', minWidth: 170 },
  { id: 'createdAt', label: 'Created At', minWidth: 150 }, // New column
];

const Users = () => {
  const context = useContext(MyContext);

  return (
    <div className="card my-4 shadow-md bg-white p-5 rounded-md">
      <div className='flex items-center justify-between px-5 py-3 mt-3'>
        <h2 className='text-[18px] font-bold'>
          Users List <span className='font-normal text-gray-500 text-[14px]'>Material UI Table</span>
        </h2>

        <div className='w-[40%]'>
          <SearchBox />
        </div>
      </div>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox {...label} size='small' />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7].map((row, idx) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                <TableCell padding="checkbox">
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell>
                  <img
                    src='https://randomuser.me/api/portraits/men/75.jpg'
                    alt='User'
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                  />
                </TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <FiMail className='text-gray-500 text-[16px]' />
                    <span>john.doe@example.com</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <FiPhone className='text-gray-500 text-[16px]' />
                    <span>+91-9876543210</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <FiCalendar className='text-gray-500 text-[16px]' />
                    <span>2025-08-03</span>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Tooltip title="Edit User" placement='top'>
                      <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                        <FiEdit style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="View User" placement='top'>
                      <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                        <FaRegEye style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete User" placement='top'>
                      <Button sx={{ minWidth: 30, width: 30, height: 30, borderRadius: '50%', background: '#fefefe', p: 0 }}>
                        <FaRegTrashCan style={{ fontSize: 20, color: 'rgba(0,0,0,0.8)' }} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='flex items-center justify-center mt-5'>
        <Pagination count={10} color="primary" />
      </div>
    </div>
  );
};

export default Users;
