export type InvoiceLineInput={description:string;quantity:number;unitPrice:number};
export type InvoiceLineCalculated=InvoiceLineInput&{unitPricePaise:number;lineTotalPaise:number};
export type InvoiceTotals={lines:InvoiceLineCalculated[];subtotalPaise:number;discountPaise:number;taxPaise:number;totalPaise:number};

function assertSafePaise(value:number):number{
 if(!Number.isSafeInteger(value)||value<0)throw new Error("Monetary value exceeds the safe paise range");
 return value;
}

export function toPaise(amount:number):number{
 if(!Number.isFinite(amount)||amount<0)throw new Error("Invalid amount");
 return assertSafePaise(Math.round((amount+Number.EPSILON)*100));
}
export function fromPaise(amount:number|null|undefined):number{return Number(((amount??0)/100).toFixed(2));}
export function calculateInvoiceTotals(items:InvoiceLineInput[],taxRate:number,discountRate:number):InvoiceTotals{
 if(!Array.isArray(items)||items.length===0)throw new Error("At least one invoice item is required");
 if(!Number.isFinite(taxRate)||taxRate<0||taxRate>100||!Number.isFinite(discountRate)||discountRate<0||discountRate>100)throw new Error("Invalid tax or discount rate");
 const lines=items.map(item=>{
  if(typeof item.description!=="string"||!item.description.trim()||!Number.isFinite(item.quantity)||item.quantity<=0)throw new Error("Invalid invoice item");
  const unitPricePaise=toPaise(item.unitPrice);
  const lineTotalPaise=assertSafePaise(Math.round(item.quantity*unitPricePaise));
  return {...item,unitPricePaise,lineTotalPaise};
 });
 const subtotalPaise=assertSafePaise(lines.reduce((sum,item)=>assertSafePaise(sum+item.lineTotalPaise),0));
 const discountPaise=assertSafePaise(Math.round(subtotalPaise*discountRate/100));
 const taxPaise=assertSafePaise(Math.round((subtotalPaise-discountPaise)*taxRate/100));
 const totalPaise=assertSafePaise(subtotalPaise-discountPaise+taxPaise);
 return {lines,subtotalPaise,discountPaise,taxPaise,totalPaise};
}
