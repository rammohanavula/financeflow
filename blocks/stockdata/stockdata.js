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
    const stockTableElement = document.getElementById('stock-table');
    if (stockData) {
        stockTableElement.innerHTML = `
            <thead class="thead-dark">
                <tr>
                    <th>Symbol</th>
                    <th>Name</th>
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
                    <td>${stockData.name}</td>
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
        stockTableElement.innerHTML = '<tr><td colspan="8">Symbol or stock does not exist</td></tr>';
    }
}

// Function to handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('stock-search-input').value.trim().toUpperCase();
    if (searchInput) {
        fetchStockQuotes(searchInput).then(stockData => {
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
}

// Function to handle Enter key press for search
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

// Function to decorate the stock data block
export default function decorate(block) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="stock-search-input" placeholder="Enter stock symbol" />
        <button id="stock-search-button">Search</button>
    `;
    block.appendChild(searchContainer);

    const stockTableWrapper = document.createElement('div');
    stockTableWrapper.className = 'table-responsive'; // Add responsive class
    const stockTableElement = document.createElement('table');
    stockTableElement.id = 'stock-table';
    stockTableElement.className = 'table table-bordered table-striped stockdata-table';
    stockTableElement.innerHTML = '<tr><td colspan="8">Loading...</td></tr>';
    stockTableWrapper.appendChild(stockTableElement);
    block.appendChild(stockTableWrapper);

    document.getElementById('stock-search-button').addEventListener('click', handleSearch);
    document.getElementById('stock-search-input').addEventListener('keypress', handleKeyPress);

    // Initial fetch for default stock symbol
    const defaultStockSymbol = 'EUR/USD';
    fetchStockQuotes(defaultStockSymbol).then(stockData => {
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
