class XLS {
    constructor (){
        this.XLSX = require('xlsx');
        this.JS_XLSX = require('js-xlsx');
    }

    exportPortfolio (workbook, portfolio) {
        let worksheetData = {};

        _.each(portfolio.positions, (asset, i) => {
            var j = i + 1

            worksheetData['A' + j] = {t: 's', v : asset.ticker}
            worksheetData['B' + j] = {t: 's', v : asset.name}
            worksheetData['C' + j] = {t: 'n', v : asset.value}
        })

        worksheetData['!ref'] = "A1:C" + portfolio.positions.length

        console.log('worksheetData', worksheetData)

        this.XLSX.utils.book_append_sheet(workbook, worksheetData, portfolio.name);
    }

    make(fun, data, p = {}){
        let workbook = this.XLSX.utils.book_new();

        this[fun](workbook, data)

        if (p.save)
            this.XLSX.writeFile(workbook, p.name || 'export.xlsx');

        return workbook
    }
}

export default XLS
