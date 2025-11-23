import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import https from 'https';
import zlib from 'zlib';

// Cache for options chain data (1 minute cache)
const optionsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minute

const NSE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.nseindia.com/option-chain',
  'Origin': 'https://www.nseindia.com',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

async function fetchNSEOptionsChain(symbol: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`;
    
    const req = https.get(url, { headers: NSE_HEADERS }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`NSE API returned status ${res.statusCode}`));
        return;
      }
      
      let decompressor;
      const encoding = res.headers['content-encoding'];
      
      if (encoding === 'br') {
        decompressor = zlib.createBrotliDecompress();
      } else if (encoding === 'gzip') {
        decompressor = zlib.createGunzip();
      } else if (encoding === 'deflate') {
        decompressor = zlib.createInflate();
      } else {
        decompressor = null;
      }
      
      let data = '';
      const stream = decompressor ? res.pipe(decompressor) : res;
      
      stream.on('data', (chunk) => {
        data += chunk.toString();
      });
      
      stream.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error: any) {
          reject(new Error(`Failed to parse NSE response: ${error.message}`));
        }
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

export const optionsChainRouter = router({
  // Get full options chain for a symbol
  getOptionsChain: publicProcedure
    .input(z.object({
      symbol: z.enum(['NIFTY', 'BANKNIFTY']).default('NIFTY'),
    }))
    .query(async ({ input }) => {
      const cacheKey = `options_chain_${input.symbol}`;
      const cached = optionsCache.get(cacheKey);
      
      // Return cached data if still valid
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`[${new Date().toISOString()}] Returning cached options chain for ${input.symbol}`);
        return cached.data;
      }
      
      try {
        console.log(`[${new Date().toISOString()}] Fetching fresh options chain for ${input.symbol}...`);
        const data = await fetchNSEOptionsChain(input.symbol);
        
        // Cache the data
        optionsCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        
        return data;
      } catch (error) {
        console.error(`Error fetching options chain for ${input.symbol}:`, error);
        throw new Error(`Failed to fetch options chain for ${input.symbol}`);
      }
    }),

  // Get specific option data (premium and expiry) for a list of recommendations
  getOptionDataForRecommendations: publicProcedure
    .input(z.object({
      recommendations: z.array(z.object({
        instrument: z.enum(['NIFTY', 'BANKNIFTY']),
        strikePrice: z.number(),
        optionType: z.enum(['CE', 'PE']),
        expiryDate: z.string(),
      })),
    }))
    .query(async ({ input }) => {
      const results: {
        instrument: string;
        strikePrice: number;
        optionType: string;
        expiryDate: string;
        currentPremium: number | null;
        actualExpiryDate: string | null;
      }[] = [];

      // Group recommendations by instrument to minimize API calls
      const groupedRecs = input.recommendations.reduce((acc, rec) => {
        if (!acc[rec.instrument]) {
          acc[rec.instrument] = [];
        }
        acc[rec.instrument].push(rec);
        return acc;
      }, {} as Record<string, typeof input.recommendations>);

      for (const instrument in groupedRecs) {
        try {
          // Fetch the full options chain data
          const chainData = await fetchNSEOptionsChain(instrument);
          const records = chainData.records.data;
          const expiryDates = chainData.records.expiryDates;

          for (const rec of groupedRecs[instrument]) {
            let currentPremium: number | null = null;
            let actualExpiryDate: string | null = null;

            // Find the record matching the strike price and expiry date
            const record = records.find((r: any) => r.strikePrice === rec.strikePrice && r.expiryDate === rec.expiryDate);

            if (record) {
              const optionKey = rec.optionType === 'CE' ? 'CE' : 'PE';
              const optionData = record[optionKey];

              if (optionData) {
                currentPremium = optionData.lastPrice;
                actualExpiryDate = optionData.expiryDate; // This is the accurate date from NSE
              }
            }

            results.push({
              instrument: rec.instrument,
              strikePrice: rec.strikePrice,
              optionType: rec.optionType,
              expiryDate: rec.expiryDate,
              currentPremium,
              actualExpiryDate,
            });
          }
        } catch (error) {
          console.error(`Error processing options for ${instrument}:`, error);
          // Push null results for the instrument if the API call fails
          for (const rec of groupedRecs[instrument]) {
            results.push({
              instrument: rec.instrument,
              strikePrice: rec.strikePrice,
              optionType: rec.optionType,
              expiryDate: rec.expiryDate,
              currentPremium: null,
              actualExpiryDate: null,
            });
          }
        }
      }

      return results;
    }),

  // Get options chain for specific expiry
  getOptionsByExpiry: publicProcedure
    .input(z.object({
      symbol: z.enum(['NIFTY', 'BANKNIFTY']).default('NIFTY'),
      expiryDate: z.string(), // Format: "25-Nov-2025"
    }))
    .query(async ({ input }) => {
      const cacheKey = `options_chain_${input.symbol}`;
      const cached = optionsCache.get(cacheKey);
      
      let optionsData;
      
      // Try to use cached data first
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        optionsData = cached.data;
      } else {
        try {
          optionsData = await fetchNSEOptionsChain(input.symbol);
          optionsCache.set(cacheKey, {
            data: optionsData,
            timestamp: Date.now(),
          });
        } catch (error: any) {
          if (cached) {
            optionsData = cached.data;
          } else {
            throw new Error(`Failed to fetch options chain: ${error.message}`);
          }
        }
      }
      
      // Filter by expiry date
      if (optionsData.records && optionsData.records.data) {
        const filteredData = optionsData.records.data.filter((item: any) => 
          item.expiryDate === input.expiryDate
        );
        
        return {
          ...optionsData,
          records: {
            ...optionsData.records,
            data: filteredData,
          },
        };
      }
      
      return optionsData;
    }),

  // Get ATM options for quick reference
  getATMOptions: publicProcedure
    .input(z.object({
      symbol: z.enum(['NIFTY', 'BANKNIFTY']).default('NIFTY'),
    }))
    .query(async ({ input }) => {
      const cacheKey = `options_chain_${input.symbol}`;
      const cached = optionsCache.get(cacheKey);
      
      let optionsData;
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        optionsData = cached.data;
      } else {
        try {
          optionsData = await fetchNSEOptionsChain(input.symbol);
          optionsCache.set(cacheKey, {
            data: optionsData,
            timestamp: Date.now(),
          });
        } catch (error: any) {
          if (cached) {
            optionsData = cached.data;
          } else {
            throw new Error(`Failed to fetch options chain: ${error.message}`);
          }
        }
      }
      
      if (!optionsData.records) {
        throw new Error('No records found in options chain data');
      }
      
      const underlyingValue = optionsData.records.underlyingValue;
      const atmStrike = Math.round(underlyingValue / 50) * 50;
      
      // Get nearest expiry data for ATM strike
      const atmData = optionsData.records.data.find((item: any) => 
        item.strikePrice === atmStrike
      );
      
      return {
        underlyingValue,
        atmStrike,
        timestamp: optionsData.records.timestamp,
        expiryDates: optionsData.records.expiryDates,
        atmCall: atmData?.CE || null,
        atmPut: atmData?.PE || null,
      };
    }),

  // Get available expiry dates
  getExpiryDates: publicProcedure
    .input(z.object({
      symbol: z.enum(['NIFTY', 'BANKNIFTY']).default('NIFTY'),
    }))
    .query(async ({ input }) => {
      const cacheKey = `options_chain_${input.symbol}`;
      const cached = optionsCache.get(cacheKey);
      
      let optionsData;
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        optionsData = cached.data;
      } else {
        try {
          optionsData = await fetchNSEOptionsChain(input.symbol);
          optionsCache.set(cacheKey, {
            data: optionsData,
            timestamp: Date.now(),
          });
        } catch (error: any) {
          if (cached) {
            optionsData = cached.data;
          } else {
            throw new Error(`Failed to fetch options chain: ${error.message}`);
          }
        }
      }
      
      return {
        symbol: input.symbol,
        expiryDates: optionsData.records?.expiryDates || [],
        underlyingValue: optionsData.records?.underlyingValue || 0,
        timestamp: optionsData.records?.timestamp || new Date().toISOString(),
      };
    }),
});
