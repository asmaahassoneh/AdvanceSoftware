const con = require('../config/db');  
const { checkAdmin } = require('../middleware/auth');
const { setupPDF, getChartImage } = require('../services/pdfService');


  const createUserSummaryReport = async (req, res) => {
    try {
      if (!checkAdmin(req, res)) return;
  
      const roles = ['admin', 'donor', 'sponsor', 'volunteer'];
      const counts = {};
  
      for (const r of roles) {
        const result = await con.query('SELECT COUNT(*) FROM users WHERE role = $1', [r]);
        counts[r] = parseInt(result.rows[0].count);
      }
  
      const chartData = {
        type: 'pie',
        data: {
          labels: roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)),
          datasets: [{
            data: roles.map(r => counts[r]),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }]
        }
      };
  
      const chartImage = await getChartImage(chartData);
      const pdfDoc = setupPDF(res, 'UserSummaryReport.pdf');
  
      pdfDoc.fontSize(20).text('User Summary Report', { align: 'center' }).moveDown();
      roles.forEach(r => {
        pdfDoc.fontSize(12).text(`${r.charAt(0).toUpperCase() + r.slice(1)}s: ${counts[r]}`);
      });
      pdfDoc.moveDown();
      pdfDoc.image(chartImage, { fit: [400, 300], align: 'center' });
      pdfDoc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Could not generate report' });
    }
  };
  
  const createOrphanageReport = async (req, res) => {
    try {
      if (!checkAdmin(req, res)) return;
  
      const totalRes = await con.query('SELECT COUNT(*) FROM orphanages');
      const verifiedRes = await con.query('SELECT COUNT(*) FROM orphanages WHERE verified = true');
      const unverifiedRes = await con.query('SELECT COUNT(*) FROM orphanages WHERE verified = false');
  
      const total = parseInt(totalRes.rows[0].count);
      const verified = parseInt(verifiedRes.rows[0].count);
      const unverified = parseInt(unverifiedRes.rows[0].count);
  
      const chartData = {
        type: 'pie',
        data: {
          labels: ['Verified', 'Unverified'],
          datasets: [{
            data: [verified, unverified],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        }
      };
  
      const chartImage = await getChartImage(chartData);
      const pdfDoc = setupPDF(res, 'OrphanageReport.pdf');
  
      pdfDoc.fontSize(20).text('Orphanage Report', { align: 'center' }).moveDown();
      pdfDoc.fontSize(12).text(`Total Orphanages: ${total}`);
      pdfDoc.text(`Verified: ${verified}`);
      pdfDoc.text(`Unverified: ${unverified}`).moveDown();
      pdfDoc.image(chartImage, { fit: [400, 300], align: 'center' });
      pdfDoc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Could not generate orphanage report' });
    }
  };
  
  const createOrphanStatisticsReport = async (req, res) => {
    try {
      if (!checkAdmin(req, res)) return;
  
      const totalRes = await con.query('SELECT COUNT(*) FROM orphans');
      const totalOrphans = parseInt(totalRes.rows[0].count);
  
      const ageGroups = {
        '0-5': await con.query('SELECT COUNT(*) FROM orphans WHERE age BETWEEN 0 AND 5'),
        '6-10': await con.query('SELECT COUNT(*) FROM orphans WHERE age BETWEEN 6 AND 10'),
        '11-15': await con.query('SELECT COUNT(*) FROM orphans WHERE age BETWEEN 11 AND 15'),
        '16+': await con.query('SELECT COUNT(*) FROM orphans WHERE age >= 16'),
      };
  
      const eduRes = await con.query(`
        SELECT education_status, COUNT(*) 
        FROM orphans 
        GROUP BY education_status
      `);
      const eduStats = eduRes.rows;
  
      const healthRes = await con.query(`
        SELECT health_status, COUNT(*) 
        FROM orphans 
        GROUP BY health_status
      `);
      const healthStats = healthRes.rows;
  
      const ageChart = {
        type: 'bar',
        data: {
          labels: Object.keys(ageGroups),
          datasets: [{
            label: 'Orphans by Age Group',
            data: Object.values(ageGroups).map(r => parseInt(r.rows[0].count)),
            backgroundColor: '#36A2EB'
          }]
        }
      };
  
      const eduChart = {
        type: 'pie',
        data: {
          labels: eduStats.map(r => r.education_status || 'Unknown'),
          datasets: [{
            data: eduStats.map(r => parseInt(r.count)),
            backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        }
      };
  
      const healthChart = {
        type: 'pie',
        data: {
          labels: healthStats.map(r => r.health_status || 'Unknown'),
          datasets: [{
            data: healthStats.map(r => parseInt(r.count)),
            backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#17a2b8']
          }]
        }
      };
  
      const ageImage = await getChartImage(ageChart);
      const eduImage = await getChartImage(eduChart);
      const healthImage = await getChartImage(healthChart);
  
      const pdfDoc = setupPDF(res, 'OrphanStatisticsReport.pdf');
  
      pdfDoc.fontSize(20).text('Orphan Statistics Report', { align: 'center' }).moveDown();
      pdfDoc.fontSize(12).text(`Total Orphans: ${totalOrphans}`).moveDown();
  
      pdfDoc.addPage().fontSize(16).text('Age Distribution', { align: 'center' }).moveDown();
      pdfDoc.image(ageImage, { fit: [450, 250], align: 'center' });
  
      pdfDoc.addPage().fontSize(16).text('Education Status Distribution', { align: 'center' }).moveDown();
      pdfDoc.image(eduImage, { fit: [450, 250], align: 'center' });
  
      pdfDoc.addPage().fontSize(16).text('Health Status Distribution', { align: 'center' }).moveDown();
      pdfDoc.image(healthImage, { fit: [450, 250], align: 'center' });
  
      pdfDoc.end();
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Could not generate orphan statistics report' });
    }
  };
  
  const createSponsorshipReport = async (req, res) => {
    try {
        if (!checkAdmin(req, res)) return;
  
      const totalRes = await con.query('SELECT COUNT(*) FROM sponsorships');
      const total = parseInt(totalRes.rows[0].count);
  
      const statusRes = await con.query(`
        SELECT status, COUNT(*) FROM sponsorships GROUP BY status
      `);
      const statusCounts = {};
      for (const row of statusRes.rows) {
        statusCounts[row.status || 'unknown'] = parseInt(row.count);
      }
  
      const amountRes = await con.query(`
        SELECT SUM(amount) AS total_amount, AVG(amount) AS avg_amount FROM sponsorships
      `);
      const totalAmount = parseFloat(amountRes.rows[0].total_amount || 0).toFixed(2);
      const avgAmount = parseFloat(amountRes.rows[0].avg_amount || 0).toFixed(2);
  
      const chartData = {
        type: 'pie',
        data: {
          labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#28a745', '#ffc107', '#dc3545']
          }]
        }
      };
  
      const chartImage = await getChartImage(chartData);
      const pdfDoc = setupPDF(res, 'SponsorshipReport.pdf');
  
      pdfDoc.fontSize(20).text('Sponsorship Report', { align: 'center' }).moveDown();
      pdfDoc.fontSize(12).text(`Total Sponsorships: ${total}`);
      pdfDoc.text(`Total Amount Sponsored: $${totalAmount}`);
      pdfDoc.text(`Average Sponsorship Amount: $${avgAmount}`).moveDown();
  
      Object.entries(statusCounts).forEach(([status, count]) => {
        pdfDoc.text(`${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`);
      });
  
      pdfDoc.moveDown();
      pdfDoc.image(chartImage, { fit: [400, 300], align: 'center' });
  
      pdfDoc.end();
    } catch (error) {
      console.error('Sponsorship Report error:', error);
      res.status(500).json({ error: 'Could not generate sponsorship report' });
    }
  };

  
  module.exports = {
    createUserSummaryReport,
    createOrphanageReport,
    createOrphanStatisticsReport,
    createSponsorshipReport,
  };
