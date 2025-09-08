const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generateCertificate = async (registrationData) => {
  const { fullName, course, _id, createdAt } = registrationData;
  
  const certificateHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {
                size: A4 landscape;
                margin: 0;
            }
            
            body {
                font-family: 'Times New Roman', serif;
                margin: 0;
                padding: 40px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                height: 100vh;
                box-sizing: border-box;
            }
            
            .certificate {
                background: white;
                border: 20px solid #004080;
                border-image: linear-gradient(45deg, #004080, #0066cc) 1;
                padding: 60px;
                text-align: center;
                height: calc(100% - 120px);
                position: relative;
                box-shadow: 0 0 30px rgba(0,0,0,0.1);
            }
            
            .header {
                margin-bottom: 40px;
            }
            
            .logo {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: #004080;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
            }
            
            .university-name {
                font-size: 24px;
                font-weight: bold;
                color: #004080;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .certificate-title {
                font-size: 48px;
                font-weight: bold;
                color: #004080;
                margin: 40px 0;
                text-transform: uppercase;
                letter-spacing: 3px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            
            .recipient-section {
                margin: 60px 0;
            }
            
            .this-certifies {
                font-size: 20px;
                color: #333;
                margin-bottom: 20px;
            }
            
            .recipient-name {
                font-size: 36px;
                font-weight: bold;
                color: #004080;
                margin: 20px 0;
                text-decoration: underline;
                text-decoration-color: #0066cc;
                text-underline-offset: 10px;
            }
            
            .course-info {
                font-size: 18px;
                color: #333;
                margin: 30px 0;
                line-height: 1.6;
            }
            
            .course-name {
                font-weight: bold;
                color: #004080;
                font-size: 20px;
            }
            
            .footer {
                position: absolute;
                bottom: 40px;
                left: 60px;
                right: 60px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .date-section, .signature-section {
                text-align: center;
            }
            
            .date, .signature-line {
                border-top: 2px solid #004080;
                padding-top: 10px;
                margin-top: 20px;
                font-size: 14px;
                color: #666;
            }
            
            .certificate-id {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 12px;
                color: #666;
            }
            
            .seal {
                position: absolute;
                bottom: 100px;
                right: 100px;
                width: 100px;
                height: 100px;
                border: 3px solid #004080;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 64, 128, 0.1);
                font-size: 12px;
                color: #004080;
                font-weight: bold;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="certificate-id">Certificate ID: JNTUGV-${_id.toString().slice(-8).toUpperCase()}</div>
            
            <div class="header">
                <div class="logo">JNTU</div>
                <div class="university-name">
                    Jawaharlal Nehru Technological University<br>
                    Gurajada Vizianagaram
                </div>
            </div>
            
            <div class="certificate-title">Certificate of Completion</div>
            
            <div class="recipient-section">
                <div class="this-certifies">This is to certify that</div>
                <div class="recipient-name">${fullName}</div>
                <div class="course-info">
                    has successfully completed the<br>
                    <span class="course-name">${course}</span><br>
                    and has demonstrated proficiency in emerging technologies including<br>
                    Artificial Intelligence, Machine Learning, Internet of Things,<br>
                    Cybersecurity, and Quantum Computing.
                </div>
            </div>
            
            <div class="footer">
                <div class="date-section">
                    <div>Date of Issue</div>
                    <div class="date">${new Date().toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                </div>
                
                <div class="signature-section">
                    <div>Director</div>
                    <div class="signature-line">JNTU-GV</div>
                </div>
            </div>
            
            <div class="seal">
                OFFICIAL<br>SEAL
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(certificateHTML, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    await browser.close();
    
    return pdfBuffer;
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw error;
  }
};

module.exports = {
  generateCertificate
};