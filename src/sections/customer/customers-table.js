import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const CustomersTable = ({ count = 0, onPageChange, onRowsPerPageChange, ...otherProps }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Change default rowsPerPage to 10
  const [salesData, setSalesData] = useState([]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    onPageChange(event, newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    onRowsPerPageChange(event);
  };

  useEffect(() => {
    // Calculate skip and take values for page-based pagination
    const skip = page * rowsPerPage;
    const take = rowsPerPage;

    // Fetch data from the API with pagination parameters
    fetch(`http://nodewithsql.onrender.com/SalesNew?page=${page + 1}&pageSize=${rowsPerPage}`)
      .then(response => response.json())
      .then(data => {
        setSalesData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [page, rowsPerPage]);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name of the Shop</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Name of Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale._id?.$oid}>
                  <TableCell>{sale.nameOfTheShop}</TableCell>
                  <TableCell>{sale.phoneNumber}</TableCell>
                  <TableCell>{sale.nameOfSales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        {...otherProps}
      />
    </Card>
  );
};
