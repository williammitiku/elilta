import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};

export const OverviewLatestOrders = (props) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Top Customers" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name Of The Shop
                </TableCell>
                <TableCell>
                  Phone Number
                </TableCell>
               
                <TableCell>
                  Sold By
                </TableCell>
                <TableCell sortDirection="desc">
                  Amount of  Product
                </TableCell>
              </TableRow>
            </TableHead>
           
<TableBody>
  {orders
    .slice() // Create a copy of the original array to avoid mutating the original
    .sort((a, b) => {
      // Sort the orders based on amountOfTheProduct in descending order
      if (a.amountOfTheProduct > b.amountOfTheProduct) {
        return -1; // b should come before a in the sorted order
      }
      if (a.amountOfTheProduct < b.amountOfTheProduct) {
        return 1; // b should come after a in the sorted order
      }
      return 0; // a and b are considered equal
    })
    .slice(0, 7) // Take only the top 10 rows after sorting
    .map((order) => (
      <TableRow key={order._id} hover>
        <TableCell>{order.nameOfTheShop}</TableCell>
        <TableCell>{order.phoneNumber}</TableCell>
        <TableCell>{order.nameOfSales}</TableCell>
        <TableCell>
          <SeverityPill color={statusMap[order.amountOfTheProduct]}>
            {order.amountOfTheProduct}
          </SeverityPill>
        </TableCell>
      </TableRow>
    ))}
</TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
