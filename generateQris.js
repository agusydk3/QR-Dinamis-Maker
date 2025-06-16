const qrcode = require('qrcode');
const fs = require('fs');
const { pad, toCRC16 } = require('./lib/index');

// Data QRIS yang telah ditentukan
const qrisCode = "REDACTED_QRIS";

/**
 * Fungsi untuk menghasilkan QRIS dengan nominal yang diberikan
 * @param {number} nominal - Nominal yang akan digunakan untuk QRIS
 * @returns {Promise<string>} - Base64 URL dari QR code yang dihasilkan
 */
async function generateQris(nominal) {
  try {
    let adjustedNominal = parseInt(nominal, 10);

    if (isNaN(adjustedNominal) || adjustedNominal < 0) {
      throw new Error('Nilai nominal tidak valid');
    }

    let qris2 = qrisCode.slice(0, -4);
    let replaceQris = qris2.replace('010211', '010212');
    let pecahQris = replaceQris.split('5802ID');
    let uang = '54' + pad(adjustedNominal.toString().length) + adjustedNominal;

    uang += '5802ID';

    let output = pecahQris[0].trim() + uang + pecahQris[1].trim();
    output += toCRC16(output);

    const url = await qrcode.toDataURL(output, { errorCorrectionLevel: 'H' });
    return url;
  } catch (error) {
    throw new Error('Error processing QRIS code: ' + error.message);
  }
}

// Ekspor fungsi generateQris
module.exports = {
  generateQris
};

/*
(async () => {
  try {
    const nominal = "7700"; // Contoh nominal
    const qrCodeUrl = await generateQris(nominal);

    console.log('QR Code berhasil dihasilkan:');

    // Convert base64 to PNG and save
    const base64Data = qrCodeUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFile('qris.png', base64Data, 'base64', (err) => {
      if (err) {
        console.error('Error saving QR code:', err);
        process.exit(1);
      }
      console.log('QR Code saved as qris.png');
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
*/