const PDFDocument = require('pdfkit');
const axios = require('axios');

const setupPDF = (res, filename) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);
  return doc;
};

const getChartImage = async (chartData) => {
  const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartData))}`;
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
};

module.exports = {
  setupPDF,
  getChartImage,
};
