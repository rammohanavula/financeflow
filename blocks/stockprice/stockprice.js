// Function to fetch real-time stock quotes
async function fetchStockQuotes(stockSymbol) {
    const apiKey = '7656f0c60ddb40ef98e99063688dcdd4'; // Replace with your Twelve Data API key
    const url = `https://api.twelvedata.com/quote?symbol=${stockSymbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        return data;
    } catch (error) {
        console.error('Error fetching stock quotes:', error);
        return null; // Return null in case of error
    }
}

// Function to update the UI with fetched stock quotes
function updateStockQuotesUI(stockData) {
    const stockTableElement = document.getElementById('stock-data-table');
    if (stockData) {
        stockTableElement.innerHTML = `
            <thead class="thead-dark">
                <tr>
                    <th>Symbol</th>
                    <th>Current Price</th>
                    <th>Day Low</th>
                    <th>Day High</th>
                    <th>Open</th>
                    <th>Volume</th>
                    <th>52 Week High</th>
                    <th>52 Week Low</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${stockData.symbol}</td>
                    <td>${parseFloat(stockData.close).toFixed(2)}</td>
                    <td>${parseFloat(stockData.low).toFixed(2)}</td>
                    <td>${parseFloat(stockData.high).toFixed(2)}</td>
                    <td>${parseFloat(stockData.open).toFixed(2)}</td>
                    <td>${parseInt(stockData.volume).toLocaleString()}</td>
                    <td>${parseFloat(stockData.fifty_two_week.high).toFixed(2)}</td>
                    <td>${parseFloat(stockData.fifty_two_week.low).toFixed(2)}</td>
                </tr>
            </tbody>
        `;
    } else {
        stockTableElement.innerHTML = '<tr><td colspan="8">Error fetching quote</td></tr>';
    }
}

// Function to decorate the stock data block
export default function decorate(block) {
    const stockSymbol = 'EUR/USD'; // Always fetch EUR/USD stock quote
    const stockTableElement = document.createElement('table');
    stockTableElement.id = 'stock-data-table';
    stockTableElement.className = 'table table-bordered table-striped stock-data-table';
    stockTableElement.innerHTML = '<tr><td colspan="8">Loading...</td></tr>';
    block.appendChild(stockTableElement);

    fetchStockQuotes(stockSymbol).then(stockData => {
        if (stockData) {
            updateStockQuotesUI(stockData);
        } else {
            updateStockQuotesUI(null); // Handle case where stockData is null
        }
    }).catch(error => {
        console.error('Error in fetchStockQuotes:', error);
        updateStockQuotesUI(null); // Update UI in case of fetch error
    });
}
