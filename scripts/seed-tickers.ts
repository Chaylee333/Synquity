import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(__dirname, '../.env.local') });

// This script seeds the database with US equity tickers
// You'll need to set your Supabase credentials

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use service key for admin access

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample of major US tickers - you can expand this list or use an API
const majorTickers = [
  // Mega Cap Tech
  { ticker: 'AAPL', name: 'Apple Inc.', industry: 'Technology', description: 'Designs, manufactures, and markets smartphones, computers, tablets, wearables, and accessories', employees: 161000, founded: 1976 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', industry: 'Technology', description: 'Develops and supports software, services, devices, and solutions worldwide', employees: 221000, founded: 1975 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', industry: 'Technology', description: 'Provides online advertising services, search engine, cloud computing, and software', employees: 190234, founded: 1998 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', industry: 'Consumer Cyclical', description: 'Engaged in e-commerce, cloud computing, digital streaming, and artificial intelligence', employees: 1541000, founded: 1994 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', industry: 'Technology', description: 'Designs graphics processing units for gaming, professional visualization, data centers, and automotive markets', employees: 29600, founded: 1993 },
  { ticker: 'META', name: 'Meta Platforms Inc.', industry: 'Technology', description: 'Develops products that enable people to connect and share through mobile devices and personal computers', employees: 67317, founded: 2004 },
  { ticker: 'TSLA', name: 'Tesla Inc.', industry: 'Automotive', description: 'Designs, develops, manufactures, and sells electric vehicles and energy storage systems', employees: 127855, founded: 2003 },
  
  // Major Financial
  { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.', industry: 'Financial Services', description: 'Engages in insurance and reinsurance, utilities and energy, freight rail transportation, and manufacturing businesses', employees: 383000, founded: 1839 },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', industry: 'Financial Services', description: 'Operates as a financial services company worldwide', employees: 309926, founded: 1799 },
  { ticker: 'V', name: 'Visa Inc.', industry: 'Financial Services', description: 'Operates as a payments technology company worldwide', employees: 26500, founded: 1958 },
  { ticker: 'MA', name: 'Mastercard Inc.', industry: 'Financial Services', description: 'Provides transaction processing and other payment-related products and services', employees: 33400, founded: 1966 },
  { ticker: 'BAC', name: 'Bank of America Corp.', industry: 'Financial Services', description: 'Provides banking and financial products and services', employees: 213000, founded: 1784 },
  { ticker: 'WFC', name: 'Wells Fargo & Company', industry: 'Financial Services', description: 'Provides banking, investment, and mortgage products and services', employees: 238698, founded: 1852 },
  
  // Healthcare
  { ticker: 'UNH', name: 'UnitedHealth Group Inc.', industry: 'Healthcare', description: 'Operates as a diversified health care company', employees: 440000, founded: 1977 },
  { ticker: 'JNJ', name: 'Johnson & Johnson', industry: 'Healthcare', description: 'Researches, develops, manufactures, and sells healthcare products', employees: 152700, founded: 1886 },
  { ticker: 'LLY', name: 'Eli Lilly and Company', industry: 'Healthcare', description: 'Discovers, develops, and markets human pharmaceuticals', employees: 43000, founded: 1876 },
  { ticker: 'ABBV', name: 'AbbVie Inc.', industry: 'Healthcare', description: 'Discovers, develops, manufactures, and sells pharmaceuticals', employees: 50000, founded: 2013 },
  { ticker: 'PFE', name: 'Pfizer Inc.', industry: 'Healthcare', description: 'Discovers, develops, manufactures, and sells biopharmaceutical products', employees: 83000, founded: 1849 },
  
  // Consumer
  { ticker: 'WMT', name: 'Walmart Inc.', industry: 'Consumer Defensive', description: 'Operates retail stores and eCommerce platforms in various formats worldwide', employees: 2100000, founded: 1962 },
  { ticker: 'PG', name: 'Procter & Gamble Co.', industry: 'Consumer Defensive', description: 'Provides branded consumer packaged goods worldwide', employees: 107000, founded: 1837 },
  { ticker: 'KO', name: 'The Coca-Cola Company', industry: 'Consumer Defensive', description: 'Manufactures, markets, and sells various nonalcoholic beverages worldwide', employees: 82500, founded: 1886 },
  { ticker: 'PEP', name: 'PepsiCo Inc.', industry: 'Consumer Defensive', description: 'Manufactures, markets, distributes, and sells beverages and convenient foods', employees: 318000, founded: 1898 },
  { ticker: 'COST', name: 'Costco Wholesale Corp.', industry: 'Consumer Defensive', description: 'Operates membership warehouses', employees: 304000, founded: 1983 },
  { ticker: 'NKE', name: 'Nike Inc.', industry: 'Consumer Cyclical', description: 'Designs, develops, markets, and sells athletic footwear, apparel, equipment, and accessories', employees: 83700, founded: 1964 },
  { ticker: 'MCD', name: "McDonald's Corporation", industry: 'Consumer Cyclical', description: 'Operates and franchises restaurants worldwide', employees: 200000, founded: 1940 },
  
  // Communication Services
  { ticker: 'DIS', name: 'The Walt Disney Company', industry: 'Communication Services', description: 'Operates as an entertainment company worldwide', employees: 223000, founded: 1923 },
  { ticker: 'NFLX', name: 'Netflix Inc.', industry: 'Communication Services', description: 'Provides entertainment services', employees: 12800, founded: 1997 },
  { ticker: 'CMCSA', name: 'Comcast Corporation', industry: 'Communication Services', description: 'Operates as a media and technology company worldwide', employees: 186000, founded: 1963 },
  
  // Semiconductors
  { ticker: 'AVGO', name: 'Broadcom Inc.', industry: 'Technology', description: 'Designs, develops, and supplies semiconductor devices', employees: 20000, founded: 1961 },
  { ticker: 'AMD', name: 'Advanced Micro Devices Inc.', industry: 'Technology', description: 'Operates as a semiconductor company worldwide', employees: 26000, founded: 1969 },
  { ticker: 'INTC', name: 'Intel Corporation', industry: 'Technology', description: 'Designs, manufactures, and sells computer products and technologies', employees: 124800, founded: 1968 },
  { ticker: 'QCOM', name: 'Qualcomm Inc.', industry: 'Technology', description: 'Engages in the development and commercialization of foundational technologies for the wireless industry', employees: 51000, founded: 1985 },
  { ticker: 'TXN', name: 'Texas Instruments Inc.', industry: 'Technology', description: 'Designs and manufactures semiconductors and integrated circuits', employees: 31000, founded: 1930 },
  
  // Software & Cloud
  { ticker: 'CRM', name: 'Salesforce Inc.', industry: 'Technology', description: 'Provides customer relationship management technology', employees: 79390, founded: 1999 },
  { ticker: 'ORCL', name: 'Oracle Corporation', industry: 'Technology', description: 'Provides products and services that address enterprise information technology environments', employees: 164000, founded: 1977 },
  { ticker: 'ADBE', name: 'Adobe Inc.', industry: 'Technology', description: 'Operates as a diversified software company worldwide', employees: 29239, founded: 1982 },
  { ticker: 'CSCO', name: 'Cisco Systems Inc.', industry: 'Technology', description: 'Designs, manufactures, and sells Internet Protocol based networking products', employees: 84900, founded: 1984 },
  
  // Energy
  { ticker: 'XOM', name: 'Exxon Mobil Corporation', industry: 'Energy', description: 'Engages in the exploration and production of crude oil and natural gas', employees: 62000, founded: 1999 },
  { ticker: 'CVX', name: 'Chevron Corporation', industry: 'Energy', description: 'Engages in integrated energy and chemicals operations worldwide', employees: 43846, founded: 1879 },
  
  // Industrial
  { ticker: 'BA', name: 'The Boeing Company', industry: 'Industrials', description: 'Designs, develops, manufactures, sells, services, and supports commercial jetliners', employees: 171000, founded: 1916 },
  { ticker: 'HON', name: 'Honeywell International Inc.', industry: 'Industrials', description: 'Operates as a diversified technology and manufacturing company', employees: 95000, founded: 1906 },
  { ticker: 'UPS', name: 'United Parcel Service Inc.', industry: 'Industrials', description: 'Operates as a package delivery company', employees: 495000, founded: 1907 },
  
  // Fintech & Crypto
  { ticker: 'PYPL', name: 'PayPal Holdings Inc.', industry: 'Financial Services', description: 'Operates a technology platform that enables digital payments', employees: 29900, founded: 1998 },
  { ticker: 'SQ', name: 'Block Inc.', industry: 'Financial Services', description: 'Creates tools to help businesses and individuals participate in the economy', employees: 13000, founded: 2009 },
  { ticker: 'COIN', name: 'Coinbase Global Inc.', industry: 'Financial Services', description: 'Provides financial infrastructure and technology for the cryptoeconomy', employees: 3730, founded: 2012 },
  
  // Data & Analytics
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.', industry: 'Technology', description: 'Builds and deploys software platforms for the intelligence community and defense industry', employees: 3838, founded: 2003 },
  { ticker: 'SNOW', name: 'Snowflake Inc.', industry: 'Technology', description: 'Provides a cloud-based data platform', employees: 6539, founded: 2012 },
  
  // E-commerce & Retail
  { ticker: 'SHOP', name: 'Shopify Inc.', industry: 'Technology', description: 'Provides a commerce platform and services', employees: 11600, founded: 2006 },
  { ticker: 'ABNB', name: 'Airbnb Inc.', industry: 'Consumer Cyclical', description: 'Operates a platform that enables hosts to offer stays and experiences', employees: 6814, founded: 2008 },
  { ticker: 'UBER', name: 'Uber Technologies Inc.', industry: 'Technology', description: 'Develops and operates proprietary technology applications', employees: 32800, founded: 2009 },
  { ticker: 'DASH', name: 'DoorDash Inc.', industry: 'Technology', description: 'Operates a logistics platform that connects merchants and consumers', employees: 8600, founded: 2013 },
  
  // Electric Vehicles
  { ticker: 'RIVN', name: 'Rivian Automotive Inc.', industry: 'Automotive', description: 'Designs, develops, and manufactures electric adventure vehicles', employees: 14000, founded: 2009 },
  { ticker: 'LCID', name: 'Lucid Group Inc.', industry: 'Automotive', description: 'Designs and manufactures electric vehicles', employees: 7200, founded: 2007 },
  { ticker: 'F', name: 'Ford Motor Company', industry: 'Automotive', description: 'Designs, manufactures, markets, and services vehicles', employees: 177000, founded: 1903 },
  { ticker: 'GM', name: 'General Motors Company', industry: 'Automotive', description: 'Designs, builds, and sells trucks, crossovers, cars, and automobile parts', employees: 163000, founded: 1908 },
  
  // Chinese ADRs (popular on US exchanges)
  { ticker: 'BABA', name: 'Alibaba Group Holding Ltd.', industry: 'Consumer Cyclical', description: 'Provides technology infrastructure and marketing reach', employees: 235216, founded: 1999 },
  { ticker: 'BIDU', name: 'Baidu Inc.', industry: 'Technology', description: 'Provides internet search services in China', employees: 38000, founded: 2000 },
  { ticker: 'NIO', name: 'NIO Inc.', industry: 'Automotive', description: 'Designs, develops, manufactures, and sells smart electric vehicles in China', employees: 11863, founded: 2014 },
  { ticker: 'PDD', name: 'PDD Holdings Inc.', industry: 'Consumer Cyclical', description: 'Operates an e-commerce platform', employees: 13000, founded: 2015 },
];

async function seedTickers() {
  console.log('🌱 Starting ticker seeding process...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const ticker of majorTickers) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .upsert(ticker, { onConflict: 'ticker' });

      if (error) {
        console.error(`❌ Error inserting ${ticker.ticker}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Inserted/Updated: ${ticker.ticker} - ${ticker.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception for ${ticker.ticker}:`, err);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📈 Total: ${majorTickers.length}`);
}

seedTickers()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Fatal error:', err);
    process.exit(1);
  });

