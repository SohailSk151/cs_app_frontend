import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 100, align: 'left' },
  { id: 'created_at', label: 'Created At', minWidth: 150, align: 'center' },
  { id: 'fulfillment_status', label: 'Fulfillment Status', minWidth: 120, align: 'center' },
  { id: 'payment_status', label: 'Payment Status', minWidth: 120, align: 'center' },
  {
    id: 'total_price',
    label: 'Total Price',
    minWidth: 100,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
];

function createData(
  id,
  name,
  created_at,
  fulfillment_status,
  payment_status,
  total_price
) {
  return { id, name, created_at, fulfillment_status, payment_status, total_price };
}

export default function MuiPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders/all")
      .then((res) => res.json())
      .then((result) => {
        //console.log("result:", result);
        setOrders(result.data || []);
      })
      .catch(console.error);
  }, []);
  //console.log("Orders", orders);
  const rows = orders.map((order) =>
    createData(
      order.name,
      order.billingAddress
        ? `${order.billingAddress.firstName} ${order.billingAddress.lastName}`
        : 'Guest',
      new Date(order.createdAt).toLocaleString(),
      order.displayFulfillmentStatus || '-',
      order.displayFinancialStatus || '-',
      parseFloat(order.totalPriceSet?.shopMoney?.amount || 0)
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
