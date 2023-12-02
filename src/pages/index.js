import { useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
// Import other components if needed

const now = new Date();

const Page = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [apiResponseCount, setApiResponseCount] = useState(0);
  const [distinctSaleNamesCount, setDistinctSaleNamesCount] = useState(0); // State for distinct sale names count
  const [chartData, setChartData] = useState([]);
  const [productsCount, setProductsCount] = useState(0); // State for products count

  const [latestSales, setLatestSales] = useState([]);

  const [latestOrders, setLatestOrders] = useState([]);


  const [monthlySales, setMonthlySales] = useState({});

  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [distinctSalesData, setDistinctSalesData] = useState([]);
const [nameOfSalesList, setNameOfSalesList] = useState([]);
  const [totalAmountList, setTotalAmountList] = useState([]);

  const [quantities, setQuantities] = useState([]);
  const [prices, setPrices] = useState([]);
  const [productNames, setProductNames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/sales2/products-summary'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();

        // Extracting quantities, prices, and product names
        const extractedQuantities = data.map(product => product.quantity);
        const extractedPrices = data.map(product => product.totalPrice);
        const extractedProductNames = data.map(product => product.productName);

        setQuantities(extractedQuantities);
        setPrices(extractedPrices);
        setProductNames(extractedProductNames);
        console.log(extractedQuantities);
        console.log(extractedPrices);
        console.log(extractedProductNames);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, show error message, etc.
      }
    }

    fetchData();
  }, []);



  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();

          // Log the fetched sales data
          console.log('Fetched Sales Data:', data);

          // Process the fetched data to get distinct sales data
          const distinctSales = {};

          data.forEach((sale) => {
            if (!distinctSales.hasOwnProperty(sale.nameOfSales)) {
              distinctSales[sale.nameOfSales] = sale.amountOfTheProduct;
            } else {
              distinctSales[sale.nameOfSales] += sale.amountOfTheProduct;
            }
          });

          const distinctSalesArray = Object.keys(distinctSales).map((saleName) => ({
            nameOfSales: saleName,
            totalAmount: distinctSales[saleName],
          }));

          // Separate nameOfSales and totalAmount into different arrays
          const names = distinctSalesArray.map((sale) => sale.nameOfSales);
          const amounts = distinctSalesArray.map((sale) => sale.totalAmount);

          // Set the state variables with distinct sales data
          setNameOfSalesList(names);
          setTotalAmountList(amounts);

          // Log the distinct sales data separately
          console.log('Name of Sales:', names);
          console.log('Total Amounts:', amounts);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSalesData();
  }, []);

  
  useEffect(() => {
    const fetchMonthlySalesData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();
  
          // Process the fetched data to get sales per month
          const salesByMonth = data.reduce((acc, sale) => {
            const saleDate = new Date(sale.createdAt);
            const monthYear = `${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`;
  
            if (!acc[monthYear]) {
              acc[monthYear] = 0;
            }
            acc[monthYear] += sale.amountOfTheProduct; // Assuming 'amountOfTheProduct' contains the sale amount
  
            return acc;
          }, {});
  
          // Create an array of objects with name and data properties
          const chartSeriesData = Object.entries(salesByMonth).map(([monthYear, totalSales]) => ({
            name: monthYear,
            data: totalSales,
          }));
  
          // Sort the chartSeriesData by date in ascending order
          chartSeriesData.sort((a, b) => {
            const dateA = new Date(a.name);
            const dateB = new Date(b.name);
            return dateA - dateB;
          });
  
          // Prepare the array of monthly sales data starting from 1/2023 with missing months filled with 0 sales
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();
          const monthlyDataList = [];
  
          for (let year = 2023; year <= currentYear; year++) {
            const lastMonth = year === currentYear ? currentMonth : 12;
  
            for (let month = 1; month <= lastMonth; month++) {
              const monthYear = `${month}/${year}`;
              const foundMonth = chartSeriesData.find(item => item.name === monthYear);
  
              if (foundMonth) {
                monthlyDataList.push(foundMonth.data);
              } else {
                monthlyDataList.push(0);
              }
            }
          }
  
          // Set the monthly sales data array with 0 for missing months
          setMonthlySalesData(monthlyDataList);
  
          // Log the fetched monthly sales data array
          console.log('Monthly Sales Data:', monthlyDataList);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchMonthlySalesData();
  }, []);


  const formatNumber = (number) => {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1000000) {
      return (number / 1000).toFixed(1) + 'K';
    } else if (number < 1000000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else {
      return (number / 1000000000).toFixed(1) + 'B';
    }
  };

  const formattedSalesData = monthlySalesData.map(dataPoint => formatNumber(dataPoint));

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();

          // Process the fetched data to get sales per month
          const salesByMonth = data.reduce((acc, sale) => {
            const saleDate = new Date(sale.createdAt);
            const monthYear = `${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`;

            if (!acc[monthYear]) {
              acc[monthYear] = 0;
            }
            acc[monthYear] += sale.amountOfTheProduct; // Assuming 'amountOfTheProduct' contains the sale amount

            return acc;
          }, {});

          // Set the monthly sales data
          setMonthlySales(salesByMonth);

          // Display monthly sales in the console
          console.log('Monthly Sales:', salesByMonth);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSalesData();
  }, []);

  // Existing JSX and UI components


useEffect(() => {
  const fetchLatestOrders = async () => {
    try {
      const response = await fetch('https://nodewithsql.onrender.com/salesNew');
      if (response.ok) {
        const data = await response.json();
        setLatestOrders(data);
      } else {
        throw new Error('Failed to fetch orders data');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  fetchLatestOrders();
}, []);



  useEffect(() => {
    const fetchLatestSales = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();

          // Sort the sales data by date in descending order
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Get the last six sales
          const lastSixSales = data.slice(0, 5);

          setLatestSales(lastSixSales);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLatestSales();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();

          // Process the fetched data to get sales per month
          const salesByMonth = data.reduce((acc, sale) => {
            const saleDate = new Date(sale.createdAt);
            const monthYear = `${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`;

            if (!acc[monthYear]) {
              acc[monthYear] = 0;
            }
            acc[monthYear] += sale.amountOfTheProduct; // Assuming 'amountOfTheProduct' contains the sale amount

            return acc;
          }, {});

          // Convert salesByMonth object to the required chartSeries format
          const chartSeriesData = Object.keys(salesByMonth).map((monthYear) => ({
            name: monthYear,
            data: salesByMonth[monthYear],
          }));

          // Set the chartData state with the processed data
          setChartData(chartSeriesData);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSalesData();
  }, []);

  
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();

          // Extract distinct sale names and count occurrences
          const distinctNames = new Set(data.map(sale => sale.nameOfSales));
          const count = distinctNames.size;

          setDistinctSaleNamesCount(count); // Set the count of distinct sale names
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSalesData();
  }, []);


  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/salesNew');
        if (response.ok) {
          const data = await response.json();
          const totalAmount = data.reduce((total, sale) => total + sale.amountOfTheProduct, 0);
          setTotalSales(totalAmount);
          setApiResponseCount(data.length);
          console.log(apiResponseCount);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSalesData();
  }, []);

  
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await fetch('https://nodewithsql.onrender.com/products');
        if (response.ok) {
          const data = await response.json();
          
          // Set the products count received from the response
          setProductsCount(data.length);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductsData();
  }, []);

  return (
    <>
      <Head>
        <title>Elilta Trading | Overview</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Other components */}
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={`$${(totalSales / 1000).toFixed(1)}K`} // Display total sales in K format
              />
            </Grid>
            <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              difference={16}
              positive={false}
              sx={{ height: '100%' }}
              value={`${apiResponseCount}`}
            />
          </Grid>
            {/* Other components */}
            <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTasksProgress
              sx={{ height: '100%' }}
              value={distinctSaleNamesCount}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value={productsCount}
            />
          </Grid> 
          <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'Sales',
                  data: formattedSalesData  
                },
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
                 chartSeries={prices}
                 labels={productNames}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewLatestProducts
              products={latestSales}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestOrders
              orders={latestOrders}
              sx={{ height: '100%' }}
            />
          </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
