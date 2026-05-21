export const ASSET_DOMAINS = {
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

export function getLogoUrl(symbol) {
  const domain = ASSET_DOMAINS[symbol];
  if (!domain) return null;
  return `/logos/${symbol}.png`;
}

export function getGradientForSymbol(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 40%), hsl(${h2}, 70%, 20%))`;
}

export const ASSET_DESCRIPTIONS = {
  'ADANI_ENTERPRISES': { desc: 'Flagship company of the Adani Group, focusing on energy, infrastructure, and mining.', marketCap: '₹3.5T', pe: '110.5' },
  'HDFC_BANK': { desc: 'India\'s largest private sector bank by assets and market capitalization.', marketCap: '₹12.1T', pe: '17.2' },
  'RELIANCE': { desc: 'A multinational conglomerate, the largest publicly traded company in India.', marketCap: '₹19.5T', pe: '28.4' },
  'TATA CONSULTANCY SERVICES': { desc: 'Global IT services and consulting firm, part of the Tata Group.', marketCap: '₹14.2T', pe: '31.1' },
  'ICICI_BANK': { desc: 'A leading private sector bank in India offering diversified financial services.', marketCap: '₹7.8T', pe: '18.9' },
  'INFOSYS': { desc: 'A global leader in next-generation digital services and consulting.', marketCap: '₹6.1T', pe: '24.5' },
  'ITC': { desc: 'A diversified conglomerate with presence in FMCG, hotels, packaging, and agri-business.', marketCap: '₹5.4T', pe: '26.8' },
  'SBI_BANK': { desc: 'A Fortune 500 company, the largest public sector banking and financial services body in India.', marketCap: '₹6.8T', pe: '11.4' },
  'BHARTI_AIRTEL': { desc: 'A leading global telecommunications company with operations in 18 countries.', marketCap: '₹7.2T', pe: '48.2' },
  'KOTAK_MAHINDRA': { desc: 'A major Indian private sector bank and financial services provider.', marketCap: '₹3.6T', pe: '21.5' },
  'JSW STEEL': { desc: 'One of India\'s largest steel manufacturing companies.', marketCap: '₹2.1T', pe: '14.8' },
  'AXIS_BANK': { desc: 'India\'s third-largest private sector bank, offering comprehensive financial products.', marketCap: '₹3.2T', pe: '15.6' },
  'BRITANNIA': { desc: 'One of India\'s oldest existing companies and a leading food brand.', marketCap: '₹1.1T', pe: '52.3' }
};

export function getAssetInfo(symbol) {
  if (ASSET_DESCRIPTIONS[symbol]) return ASSET_DESCRIPTIONS[symbol];
  return { 
    desc: `A prominent constituent of the Indian stock market. ${symbol.replace(/_/g, ' ')} operates in its respective sector with significant market presence.`, 
    marketCap: 'Varies', 
    pe: 'Industry Avg' 
  };
}
