/** Bayode: reference-matched static website interactions. */
(function(){
"use strict";
var appearance=document.getElementById("appearance"),media=window.matchMedia("(prefers-color-scheme: dark)");
appearance.value=document.documentElement.dataset.theme||"system";
function updateBrowserColor(){var mode=appearance.value,dark=mode==="dark"||(mode==="system"&&media.matches);document.getElementById("theme-color").content=dark?"#0c1211":"#f7f8f5"}
appearance.addEventListener("change",function(){document.documentElement.dataset.theme=appearance.value;try{localStorage.setItem("bayode-appearance",appearance.value)}catch(e){}updateBrowserColor()});
if(media.addEventListener)media.addEventListener("change",updateBrowserColor);else if(media.addListener)media.addListener(updateBrowserColor);
var service=document.getElementById("service"),products=document.getElementById("products"),platform=document.getElementById("platform"),extras=Array.from(document.querySelectorAll('input[name="extra"]')),estimate=document.getElementById("estimate"),note=document.getElementById("estimate-note");
function updateScope(){
 var build=service.value==="build",total=service.value==="migration"?650:350,selected=extras.filter(function(e){return e.checked});
 selected.forEach(function(e){total+=Number(e.value)});
 document.getElementById("product-count").textContent=products.value;
 estimate.textContent=build?"Custom quote":"$"+total.toLocaleString("en-US");
 note.textContent=(build?"Your store is scoped around your products, pages and required features.":"Starting price for an agreed scope. Catalogue complexity may change the final fee.")+" Third-party fees and naira invoicing are agreed in writing.";
 var names={build:"new store build",improvement:"storefront improvement",migration:"migration to Shopify"};
 var message="Hi Bayode, I need a "+names[service.value]+" project. Current platform: "+platform.value+". Products: "+products.value+". Extras: "+(selected.length?selected.map(function(e){return e.dataset.label}).join(", "):"None selected")+". "+(build?"Please send a custom quote.":"Indicative estimate: $"+total+". Please confirm the scope and final fee.");
 document.getElementById("scope-link").href="https://wa.me/2348126679348?text="+encodeURIComponent(message)
}
[service,products,platform].concat(extras).forEach(function(el){el.addEventListener("input",updateScope);el.addEventListener("change",updateScope)});
document.querySelectorAll("[data-service]").forEach(function(link){link.addEventListener("click",function(){service.value=link.dataset.service;updateScope()})});
document.querySelectorAll(".faq-list details").forEach(function(item){
item.addEventListener("toggle",function(){if(item.open)document.querySelectorAll(".faq-list details").forEach(function(other){if(other!==item)other.open=false})})
});updateScope();updateBrowserColor()
})()
