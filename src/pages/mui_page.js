import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
//import EditDocumentIcon from "@mui/icons-material/EditDocument";
import EditDocumentIcon from '@mui/icons-material/Edit';
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Table column definitions
 */
const columns = [
    { id: "id", label: "Order ID", minWidth: 50, align: "center" },
    { id: "name", label: "Customer Name", minWidth: 110, align: "left" },
    { id: "created_at", label: "Created At", minWidth: 90, align: "center" },
    { id: "fulfillment_status", label: "Fulfillment Status", minWidth: 90, align: "center" },
    { id: "payment_status", label: "Payment Status", minWidth: 90, align: "center" },
    { id: "total_price", label: "Total Price", minWidth: 100, align: "right" },
    { id: "edit", label: "Edit", minWidth: 80, align: "center" },
];

/**
 * Row factory
 */
function createData(
    id,
    name,
    created_at,
    fulfillment_status,
    payment_status,
    total_price
) {
    return {
        id,
        name,
        created_at,
        fulfillment_status,
        payment_status,
        total_price,
    };
}

export default function MuiPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    /**
     * Fetch orders
     */
    useEffect(() => {
        fetch("http://localhost:4000/api/orders/all")
            .then((res) => res.json())
            .then((result) => {
                //console.log("Fetched orders:", result);
                setOrders(result.data || []);
            })
            .catch(console.error);
    }, []);

    
    const rows = useMemo(() => {
        return orders.map((order) =>
            createData(
                `${order.name}-${order.id.substring(20, 34)}`,
                order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : order.billingAddress
                        ? `${order.billingAddress.firstName} ${order.billingAddress.lastName}`
                        : "Guest",
                new Date(order.createdAt).toLocaleString("en-US", {
                    timeZone: "America/Los_Angeles",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                }),
                order.displayFulfillmentStatus || "-",
                order.displayFinancialStatus || "-",
                parseFloat(order.totalPriceSet?.shopMoney?.amount || 0).toFixed(2)
            )
        );
    }, [orders]);

    /**
     * Filter rows based on search query
     */
    const filteredRows = useMemo(() => {
        if (!searchQuery) return rows;

        return rows.filter((row) =>
            columns.some((column) => {
                // Skip the edit column
                if (column.id === "edit") return false;
                
                const value = row[column.id];
                return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [rows, searchQuery]);

    /**
     * Pagination handlers
     */
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    
    const handleEdit = (row) => {
        console.log("Edit clicked for row:", row);
        navigate(`/order/${row.id.substring(6, 20)}`)
        // openEditDialog(row)
    };

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
            
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader aria-label="orders table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{ minWidth: column.minWidth, fontWeight: "bold" }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow hover key={row.id}>
                                    {columns.map((column) => {
                                        if (column.id === "edit") {
                                            return (
                                                <TableCell key={column.id} align="center">
                                                    <Tooltip title="Edit order">
                                                        <IconButton onClick={() => handleEdit(row)}>
                                                            <EditDocumentIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            );
                                        }
                                        

                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {row[column.id]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                rowsPerPageOptions={[10, 25, 50]}
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}