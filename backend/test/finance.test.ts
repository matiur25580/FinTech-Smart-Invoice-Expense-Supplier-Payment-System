import test from "node:test";
import assert from "node:assert/strict";
import {calculateInvoiceTotals,fromPaise,toPaise} from "../src/finance.js";
test("converts rupees to integer paise without floating point drift",()=>{assert.equal(toPaise(0.1),10);assert.equal(toPaise(125.55),12555);assert.equal(fromPaise(12555),125.55);});
test("rejects negative and non-finite monetary values",()=>{for(const value of [-0.01,Number.NaN,Number.POSITIVE_INFINITY])assert.throws(()=>toPaise(value),/Invalid amount/);});
test("calculates subtotal, discount before tax, and total in paise",()=>{const result=calculateInvoiceTotals([{description:"Consulting",quantity:2,unitPrice:100},{description:"Support",quantity:1,unitPrice:50}],18,10);assert.equal(result.subtotalPaise,25000);assert.equal(result.discountPaise,2500);assert.equal(result.taxPaise,4050);assert.equal(result.totalPaise,26550);assert.deepEqual(result.lines.map(x=>x.lineTotalPaise),[20000,5000]);});
test("supports zero tax and zero discount",()=>{const result=calculateInvoiceTotals([{description:"Item",quantity:3,unitPrice:12.34}],0,0);assert.equal(result.totalPaise,3702);});
test("rejects empty invoices, invalid rates, and invalid quantities",()=>{assert.throws(()=>calculateInvoiceTotals([],18,0));assert.throws(()=>calculateInvoiceTotals([{description:"x",quantity:1,unitPrice:1}],101,0));assert.throws(()=>calculateInvoiceTotals([{description:"x",quantity:0,unitPrice:1}],0,0));});
