import { BN } from "bn.js";

function defaultBalanceFormat(num) {
    let formater = new Intl.NumberFormat('en-US',
    {style: 'decimal', 
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
    return formater.format(num);
}
function defaultTxsValueFormat(num) {
  let formater = new Intl.NumberFormat('en-US',
  {style: 'decimal', 
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});
  return formater.format(num);
}

function calcGasFee(gasprice, gaslimit) {
  let gaspricebn = new BN(gasprice, 10);
  let gaslimitbn = new BN(gaslimit, 10);
  let gasfee = gaspricebn.mul(gaslimitbn);
  return gasfee.toString(10);
}
function sortList(data=[],fn) {
  for (let i = 0; i < data.length - 1; i++){
      for (let j = 0; j < data.length - 1 - i; j++) {
          let c = data[j];
          let n = data[j + 1];
          let r = fn(c, n)
          if (r){
            data[j] = n;
            data[j + 1] = c;
          }
      }
  }
  return data;
}
export {
    defaultBalanceFormat,
    defaultTxsValueFormat,
    calcGasFee,
    sortList,
}