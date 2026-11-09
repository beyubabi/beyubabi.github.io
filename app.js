/** Bayode: responsive navigation, tiered scope estimator, region-aware prices and theme controls. */
(function(){
"use strict";
var appearance=document.getElementById("appearance"),media=window.matchMedia("(prefers-color-scheme: dark)");
function updateAppearanceIcon(mode){
 var holder=document.getElementById("appearance-icon");if(!holder)return;
 var icons={light:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>',dark:'<svg viewBox="0 0 24 24"><path d="M20.5 14.2A8.7 8.7 0 0 1 9.8 3.5 8.8 8.8 0 1 0 20.5 14.2Z"/></svg>',system:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>'};
 holder.innerHTML=icons[mode]||icons.system;holder.setAttribute("title",mode.charAt(0).toUpperCase()+mode.slice(1)+" appearance");
}
function updateBrowserColor(){var mode=appearance?appearance.value:"system",dark=mode==="dark"||(mode==="system"&&media.matches),themeColor=document.getElementById("theme-color");if(themeColor)themeColor.content=dark?"#0c1211":"#f7f8f5";updateAppearanceIcon(mode)}
if(appearance){appearance.value=document.documentElement.dataset.theme||"system";appearance.addEventListener("change",function(){document.documentElement.dataset.theme=appearance.value;try{localStorage.setItem("bayode-appearance",appearance.value)}catch(e){}updateBrowserColor()});if(media.addEventListener)media.addEventListener("change",updateBrowserColor);else if(media.addListener)media.addListener(updateBrowserColor)}
var rates={USD:1},rateSource="loading",rateUpdated="",currencySelects=Array.from(document.querySelectorAll(".currency-select")),currencySelect=document.getElementById("currency"),currencyHints=Array.from(document.querySelectorAll(".currency-hint")),requestedCurrency="USD";
function detectCurrency(){var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}if(tz==="Africa/Lagos")return "NGN";if(tz==="Africa/Accra")return "GHS";if(tz==="Europe/London")return "GBP";var lang=(navigator.language||"").toLowerCase();if(lang.endsWith("-ng"))return "NGN";if(lang.endsWith("-gh"))return "GHS";if(lang.endsWith("-gb"))return "GBP";return "USD"}
try{requestedCurrency=localStorage.getItem("bayode-currency")||detectCurrency()}catch(e){requestedCurrency=detectCurrency()}if(!["USD","GBP","NGN","GHS"].includes(requestedCurrency))requestedCurrency="USD";currencySelects.forEach(function(s){s.value="USD"});
function currentCurrency(){return currencySelect&&Number.isFinite(rates[currencySelect.value])?currencySelect.value:"USD"}
function formatMoney(amount,code,plus){var c=code&&Number.isFinite(rates[code])?code:"USD",value=Number(amount)*rates[c],formatted=new Intl.NumberFormat(undefined,{style:"currency",currency:c,maximumFractionDigits:0}).format(value);return (plus?"+":"")+formatted}
function updateRateHint(){var c=currentCurrency(),message="";if(rateSource==="loading")message="Exchange rates loading · temporarily showing USD";else if(rateSource==="fallback")message="Exchange rates unavailable · showing USD only";else if(c==="USD")message="Amounts shown in USD · indicative conversions available";else{var rate=new Intl.NumberFormat(undefined,{maximumSignificantDigits:7}).format(rates[c]),dateText="";if(rateUpdated){var d=new Date(rateUpdated);if(!isNaN(d.getTime()))dateText=" · updated "+d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}message="Approx. rate: 1 USD = "+rate+" "+c+dateText}currencyHints.forEach(function(h){h.textContent=message})}
function refreshStaticPrices(){document.querySelectorAll(".currency-amount[data-usd]").forEach(function(el){el.textContent=formatMoney(el.dataset.usd,currentCurrency(),el.dataset.plus==="true")})}
function setCurrencyOptions(){currencySelects.forEach(function(select){Array.from(select.options).forEach(function(option){option.disabled=!Number.isFinite(rates[option.value])});select.value=rateSource==="available"&&Number.isFinite(rates[requestedCurrency])?requestedCurrency:"USD"})}
var service=document.getElementById("service"),products=document.getElementById("products"),platform=document.getElementById("platform"),extras=Array.from(document.querySelectorAll('input[name="extra"]')),estimate=document.getElementById("estimate"),note=document.getElementById("estimate-note"),productCount=document.getElementById("product-count");
/* Suggested tier prices in USD; optional extras are added on top. */
var priceTiers=[
 {max:50,build:450,migration:650,improvement:350},
 {max:100,build:600,migration:650,improvement:350},
 {max:250,build:800,migration:850,improvement:450},
 {max:500,build:1100,migration:1100,improvement:600},
 {max:1000,build:1500,migration:1500,improvement:null}
];
function getTier(count){return priceTiers.find(function(tier){return count<=tier.max})||priceTiers[priceTiers.length-1]}
function tierLabel(count){var tier=getTier(count),min=priceTiers.indexOf(tier)===0?1:priceTiers[priceTiers.indexOf(tier)-1].max+1;return min.toLocaleString()+"–"+tier.max.toLocaleString()+" products"}
function updateScope(){
 if(!service||!estimate)return;
 var serviceKey=service.value,count=products?Math.max(1,Number(products.value)||1):1,tier=getTier(count),base=tier[serviceKey],selected=extras.filter(function(e){return e.checked}),extraTotal=selected.reduce(function(sum,e){return sum+(Number(e.value)||0)},0),code=currentCurrency(),isCustom=base===null,total=(base||0)+extraTotal;
 if(productCount)productCount.textContent=count.toLocaleString();
 estimate.textContent=isCustom?"Custom quote":formatMoney(total,code);
 var tierText=tierLabel(count);
 if(note){note.textContent=isCustom?"For more than 500 products, please request a custom improvement quote. Your product count is included in the scope.":"Suggested "+tierText+" tier: "+formatMoney(base,code)+" base"+(extraTotal?" + "+formatMoney(extraTotal,code)+" selected extras":"")+". Currency conversion is indicative; the final fee is confirmed in writing."}
 var names={build:"new store build",improvement:"storefront improvement sprint",migration:"migration to Shopify"},message="Hi Bayode, I need a "+names[serviceKey]+" project. Current platform: "+(platform?platform.value:"Not specified")+". Products: "+count+" ("+tierText+"). Extras: "+(selected.length?selected.map(function(e){return e.dataset.label}).join(", "):"None selected")+". "+(isCustom?"Please send a custom quote.":"Indicative estimate: "+formatMoney(total,code)+" ("+tierText+" tier; approximate conversion). Please confirm the scope and final fee."),scopeLink=document.getElementById("scope-link");
 if(scopeLink)scopeLink.href="https://wa.me/2348126679348?text="+encodeURIComponent(message)
}
currencySelects.forEach(function(select){select.addEventListener("change",function(){if(!Number.isFinite(rates[select.value])){setCurrencyOptions();return}requestedCurrency=select.value;currencySelects.forEach(function(other){other.value=requestedCurrency});try{localStorage.setItem("bayode-currency",requestedCurrency)}catch(e){}updateRateHint();refreshStaticPrices();updateScope()})});
function applyRates(next,updated){rates=next;rateSource="available";rateUpdated=updated||"";setCurrencyOptions();refreshStaticPrices();updateRateHint();updateScope()}
try{var saved=JSON.parse(localStorage.getItem("bayode-usd-rates")||"null");if(saved&&saved.at>Date.now()-12*60*60*1000&&saved.rates)applyRates(saved.rates,saved.updated)}catch(e){}
fetch("https://open.er-api.com/v6/latest/USD",{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("rate request failed");return r.json()}).then(function(data){if(data.result!=="success"||!data.rates)throw new Error("rate data unavailable");var wanted={USD:1,GBP:data.rates.GBP,NGN:data.rates.NGN,GHS:data.rates.GHS};if(Object.keys(wanted).some(function(k){return !Number.isFinite(wanted[k])}))throw new Error("one or more rates unavailable");var updated=data.time_last_update_utc||new Date().toISOString();applyRates(wanted,updated);try{localStorage.setItem("bayode-usd-rates",JSON.stringify({at:Date.now(),rates:wanted,updated:updated}))}catch(e){}}).catch(function(){if(rateSource==="loading"){rates={USD:1};rateSource="fallback";setCurrencyOptions();updateRateHint();refreshStaticPrices();updateScope()}});
if(service&&products&&platform)[service,products,platform].concat(extras).forEach(function(el){el.addEventListener("input",updateScope);el.addEventListener("change",updateScope)});
document.querySelectorAll("[data-service]").forEach(function(link){link.addEventListener("click",function(){if(service){service.value=link.dataset.service;updateScope()}})});document.querySelectorAll(".faq-list details").forEach(function(item){item.addEventListener("toggle",function(){if(item.open)document.querySelectorAll(".faq-list details").forEach(function(other){if(other!==item)other.open=false})})});
var backToTop=document.getElementById("back-to-top");if(backToTop){function toggleBackToTop(){backToTop.classList.toggle("is-visible",window.scrollY>360)}window.addEventListener("scroll",toggleBackToTop,{passive:true});toggleBackToTop()}
setCurrencyOptions();updateRateHint();refreshStaticPrices();updateScope();updateBrowserColor();
})();
