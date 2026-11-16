export type InvoiceLineInput={description:string;quantity:number;unitPrice:number};
export type InvoiceLineCalculated=InvoiceLineInput&{unitPricePaise:number;lineTotalPaise:number};
export type InvoiceTotals={lines:InvoiceLineCalculated[];subtotalPaise:number;discountPaise:number;taxPaise:number;totalPaise:number};
export function toPaise(amount:number):number{if(!Number.isFinite(amount)||amount<0)throw new Error("Invalid amount");return Math.round((amount+Number.EPSILON)*100);}
export function fromPaise(amount:number|null|undefined):number{return Number(((amount??0)/100).toFixed(2));}
export function calculateInvoiceTotals(items:InvoiceLineInput[],taxRate:number,discountRate:number):InvoiceTotals{
 if(!Array.isArray(items)||items.length===0)throw new Error("At least one invoice item is required");
 if(!Number.isFinite(taxRate)||taxRate<0||taxRate>100||!Number.isFinite(discountRate)||discountRate<0||discountRate>100)throw new Error("Invalid tax or discount rate");
 const lines=items.map(item=>{if(!item.description.trim()||!Number.isFinite(item.quantity)||item.quantity<=0)throw new Error("Invalid invoice item");const unitPricePaise=toPaise(item.unitPrice);return {...item,unitPricePaise,lineTotalPaise:Math.round(item.quantity*unitPricePaise)};});
 const subtotalPaise=lines.reduce((sum,item)=>sum+item.lineTotalPaise,0);
 const discountPaise=Math.round(subtotalPaise*discountRate/100);
 const taxPaise=Math.round((subtotalPaise-discountPaise)*taxRate/100);
 return {lines,subtotalPaise,discountPaise,taxPaise,totalPaise:subtotalPaise-discountPaise+taxPaise};
}
