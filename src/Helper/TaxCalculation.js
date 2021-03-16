class TaxCalculation {

    calculateTax(price, tax) {
        let priceTax = (price * tax) / 100;

        return priceTax;
    }

    totalWithTax(quantity, unitPrice) {
        let totalPriceWithTax = quantity * unitPrice;

        return totalPriceWithTax;
    }
}

export default new TaxCalculation();