const https = require('https');
const fs = require('fs');
const path = require('path');

const ASSET_DOMAINS = {
  'ADANI_ENTERPRISES': 'adanienterprises.com',
  'ADANI_PORTS': 'adaniports.com',
  'APOLLO HOSPITALS': 'apollohospitals.com',
  'ASIAN PAINTS': 'asianpaints.com',
  'AXIS_BANK': 'axisbank.com',
  'BAJAJ AUTO': 'bajajauto.com',
  'BAJAJ_FINANCE': 'bajajfinserv.in',
  'BAJAJ_FINSERV': 'bajajfinserv.in',
  'BHARAT PETROLEUM': 'bharatpetroleum.in',
  'BHARTI_AIRTEL': 'airtel.in',
  'BRITANNIA': 'britannia.co.in',
  'CIPLA': 'cipla.com',
  'COAL INDIA': 'coalindia.in',
  'DIVIS LAB': 'divislabs.com',
  'EICHER MOTOTRS': 'eichermotors.com',
  'GRASIM': 'grasim.com',
  'HCL_TECHNOLOIES': 'hcltech.com',
  'HDFC_BANK': 'hdfcbank.com',
  'HDFC_LIFE': 'hdfclife.com',
  'HERO MOTOCORP': 'heromotocorp.com',
  'HINDALCO': 'hindalco.com',
  'HINDUSTAN UNILEVER': 'hul.co.in',
  'ICICI_BANK': 'icicibank.com',
  'INDUS INDUSTRIES': 'indusind.com',
  'INFOSYS': 'infosys.com',
  'ITC': 'itcportal.com',
  'JSW STEEL': 'jsw.in',
  'KOTAK_MAHINDRA': 'kotak.com',
  'MARUTI SUZUKI': 'marutisuzuki.com',
  'NESTLE': 'nestle.in',
  'NIFTY_50_STOCKS': null,
  'NTPC': 'ntpc.co.in',
  'ONGC': 'ongcindia.com',
  'POWERGRID': 'powergrid.in',
  'RELIANCE': 'ril.com',
  'SBI_BANK': 'onlinesbi.sbi',
  'SBI_LIFE': 'sbilife.co.in',
  'SUN_PHARMA': 'sunpharma.com',
  'TATA CONSULTANCY SERVICES': 'tcs.com',
  'TATA CONSUMER PRODUCTS': 'tataconsumer.com',
  'TATA MOTORS': 'tatamotors.com',
  'TATA STEEL': 'tatasteel.com',
  'TECH_MAHINDRA': 'techmahindra.com',
  'TITAN': 'titancompany.in',
  'ULTRATECH CEMENT': 'ultratechcement.com',
  'UPL': 'upl-ltd.com',
  'WIPRO': 'wipro.com'
};

const LOGO_DIR = path.join(__dirname, '..', 'public', 'logos');

if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

async function downloadLogo(symbol, domain) {
  return new Promise((resolve) => {
    if (!domain) {
      console.log(`Skipping ${symbol} (No domain)`);
      return resolve();
    }
    
    const url = `https://icon.horse/icon/${domain}`;
    const dest = path.join(LOGO_DIR, `${symbol}.png`);
    
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${symbol}.png`);
          resolve();
        });
      } else {
        console.log(`Failed to download ${symbol} from ${domain} (Status: ${res.statusCode})`);
        resolve();
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${symbol}: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  console.log('Starting logo downloads...');
  for (const [symbol, domain] of Object.entries(ASSET_DOMAINS)) {
    await downloadLogo(symbol, domain);
  }
  console.log('Finished downloading logos.');
}

main();
