import barcode from 'barcode';

const generateBarcode = (data) => {
  try {
    const code128 = barcode('code128', {
      data: data,
      width: 400,
      height: 100,
    });
    return code128.getBase64();
  } catch (err) {
    console.error(err);
    throw new Error('Barcode generation failed');
  }
};
export default generateBarcode;