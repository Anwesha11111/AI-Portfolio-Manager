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
  return `https://logo.clearbit.com/${domain}`;
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
