

"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Case Problem 3

      Author: Larry Stanfield
      Date:   11/26/2020
   
   Filename: rb_build.js

*/

var pizzaPrice = {
  size12:11,
  size14:13,
  size16:16,
  stuffed:3,
  pan:2,
  doubleSauce:1.5,
  doubleCheese:1.5,
  topping:1.5
}

function cart(){
  this.totalCost = 0;
  this.items = [];
}

cart.prototype.calcCartTotal = function(){    
    this.totalCost = 0;
    for( var item in this.items){
      this.totalCost = this.totalCost + this.items[item].calcItemCost();
    }

    return this.totalCost;
}

function foodItem(){
      this.price;
      this.qty;
}

function pizza(){
  this.size;
  this.crust;
  this.doubleSauce;
  this.doubleCheese;
  this.toppings = [];
}

function topping(){
  this.name;
  this.side;
}



  foodItem.prototype.calcItemCost = function(){
    return this.price * this.qty;
  };
  foodItem.prototype.addToCart = function(cart){
    cart.items.push(this);
  };
  foodItem.prototype.removeFromCart = function(cart){
    var self = this;
    cart.items.forEach(function(item, index){
        if(Object.is(item,self)){
            cart.items.splice(index, 1);
        }
    });
  }

 pizza.prototype    = new foodItem();
 topping.prototype  = new foodItem();

 pizza.prototype.addTopping = function(topping){
    this.toppings.push(topping);
 }

 pizza.prototype.calcPizzaPrice = function(){
    var self = this;
    self.price;

    for( var pp in pizzaPrice){
        if( 'size' + self.size == pp){
            console.log(pizzaPrice[pp]);
            self.price = pizzaPrice[pp];
        }
    }
    self.price += (self.crust == 'stuffed' || self.crust == 'pan') ? pizzaPrice[self.crust] : 0;
    self.price += (self.doubleSauce)? pizzaPrice.doubleSauce : 0;
    self.price += (self.doubleCheese)? pizzaPrice.doubleCheese : 0;
    if(self.toppings.length){
        self.toppings.forEach(function(topping,index){
            self.price += topping.qty * pizzaPrice.topping;
        });
    }
    return self.price;
 }


window.addEventListener("load", function() {
   // Preview image of the pizza 
   var pizzaPreviewBox = document.getElementById("previewBox"); 
   // Summary of the pizza order
   var pizzaSummary =  document.getElementById("pizzaSummary");
   // Pizza size selection list
   var pizzaSizeBox = document.getElementById("pizzaSize");
   // Pizza crust selection list
   var pizzaCrustBox = document.getElementById("pizzaCrust");
   // Pizza double sauce checkbox
   var pizzaDoubleSauceBox = document.getElementById("doubleSauce");
   // Pizza double cheese checkbox
   var pizzaDoubleCheeseBox = document.getElementById("doubleCheese");
   // Pizza topping option buttons
   var toppingOptions = document.querySelectorAll("input.topping");
   // Pizza quantity selection list
   var pizzaQuantityBox = document.getElementById("pizzaQuantity");
   // Add to cart button
   var addToCartButton = document.getElementById("addToCart");
   // Order table displaying the items in the shopping cart
   var cartTableBody = document.querySelector("table#cartTable tbody");   
   // Shopping cart total box
   var cartTotalBox = document.getElementById("cartTotal");   
    
   pizzaSizeBox.onchange = drawPizza;
   pizzaCrustBox.onchange = drawPizza;
   pizzaDoubleSauceBox.onclick = drawPizza;   
   pizzaDoubleCheeseBox.onclick = drawPizza; 
   pizzaQuantityBox.onchange = drawPizza;   
   for (var i = 0; i < toppingOptions.length; i++) {
      toppingOptions[i].onclick = drawPizza;
   }


   
   // Function to build the pizza
   function buildPizza(newPizza) {
     newPizza.qty   =   pizzaQuantityBox.selectedValue();
     newPizza.size  =  pizzaSizeBox.selectedValue();
     newPizza.crust = pizzaCrustBox.selectedValue();
     newPizza.doubleSauce = pizzaDoubleSauceBox.checked;
     newPizza.doubleCheese = pizzaDoubleCheeseBox.checked;
     var checkedToppings = document.querySelector( 'input.topping:checked' );
      for (var index = 0; index < checkedToppings.length; index++) {
         if (checkedToppings[i].value !== "none") {
          var myTopping = new topping();
          myTopping.name = checkedToppings[index].name;
          myTopping.side = checkedToppings[index].value;
          if( checkedToppings[index].value == 'full' ){
          myTopping.qty = 1;
           } else { 
            myTopping.qty = 0.5;
           }
          newPizza.addTopping(myTopping);
       }
     };
   }  
   
   var myCart = new cart();
   addToCartButton.onclick = addPizzaToCart;


   // Function to add the built pizza to the shopping cart
   function addPizzaToCart() { 

     var myPizza = new pizza();
     buildPizza(myPizza);
     myPizza.addToCart(myCart);
    
      var pizzaSummary =  document.getElementById("pizzaSummary").textContent;
      var newItemRow       = document.createElement('tr');
      var tdSummary     = document.createElement('td');
      var tdPizzaQty    = document.createElement('td');
      var tdPizzaPrice  = document.createElement('td');
      var tdButton  = document.createElement('td');
      var removeButton  = document.createElement('input');
      tdSummary.textContent         = pizzaSummary;
      tdPizzaQty.textContent       = myPizza.qty;
      tdPizzaPrice.textContent      = myPizza.calcPizzaPrice().toLocaleString();
      removeButton.setAttribute('type', 'button');
      removeButton.setAttribute('name', 'removeButton');
      removeButton.setAttribute('id', 'removeButton');
      removeButton.setAttribute('value', 'X');
      newItemRow.appendChild(tdSummary);
      newItemRow.appendChild(tdPizzaQty);
      newItemRow.appendChild(tdPizzaPrice);
      tdButton.appendChild(removeButton);
      newItemRow.appendChild(tdButton);
    cartTableBody.appendChild(newItemRow);
    cartTotalBox.value = myCart.calcCartTotal();
    console.log(myCart);
    resetDrawPizza();

    removeButton.onclick = function(event){
      myPizza.removeFromCart(myCart);
      cartTableBody.removeChild(event.target.parentElement.parentNode);
      
      cartTotalBox.value = myCart.calcCartTotal();
      console.log(myCart);
    };

   }   
   


   /* Function to draw the pizza image on the page */
   function drawPizza() {
      pizzaPreviewBox.removeChildren();      
      var pizzaDescription = "";
      
      pizzaDescription += pizzaSizeBox.selectedValue() + '" pizza ';
      pizzaDescription += pizzaCrustBox.selectedValue() + ", ";
      if (pizzaDoubleSauceBox.checked) {
         var sauceImg = document.createElement("img");
         sauceImg.src = "rb_doublesauce.png";
         pizzaPreviewBox.appendChild(sauceImg);
         pizzaDescription += "double sauce, ";
      }
      if (pizzaDoubleCheeseBox.checked) {
         var cheeseImg = document.createElement("img");
         cheeseImg.src = "rb_doublecheese.png";
         pizzaPreviewBox.appendChild(cheeseImg);
         pizzaDescription += "double cheese, ";
      } 

      var checkedToppings = document.querySelectorAll("input.topping:checked");    
      for (var i = 0; i < checkedToppings.length; i++) {
         if (checkedToppings[i].value !== "none") {
            
            pizzaDescription += checkedToppings[i].name + "(" + checkedToppings[i].value + "), ";
            var toppingImage = document.createElement("img");
            toppingImage.src = "rb_" + checkedToppings[i].name + ".png";
            pizzaPreviewBox.appendChild(toppingImage);                                  
            
            if (checkedToppings[i].value === "left") {
               toppingImage.style.clip = "rect(0px, 150px, 300px, 0px)";
            }  else if (checkedToppings[i].value === "right") {
               toppingImage.style.clip = "rect(0px, 300px, 300px, 150px)";
            }
      
         }
      }   
      
      pizzaSummary.textContent = pizzaDescription;
   }
   
   // Function to reset the pizza drawing 
   function resetDrawPizza() {
      // Object collection of all topping option buttons with a value of 'none'
      var noTopping = document.querySelectorAll("input.topping[value='none']");
      
      pizzaSizeBox.selectedIndex = 1;
      pizzaCrustBox.selectedIndex = 0;
      pizzaDoubleSauceBox.checked = false;
      pizzaDoubleCheeseBox.checked = false;
      
      for (var i = 0; i < noTopping.length; i++) {
         noTopping[i].checked = true;
      }      
      pizzaSummary.textContent = '14" pizza, thin';
      pizzaPreviewBox.removeChildren();
      pizzaQuantityBox.selectedIndex = 0;
   }
   
});



/*-------------------- Custom Methods --------------------*/

/* Method added to any DOM element that removes all child nodes of element */
HTMLElement.prototype.removeChildren = function() {
   while (this.firstChild) {
      this.removeChild(this.firstChild);
   }   
};

/* Method added to the select element to return the value of the selected option */
HTMLSelectElement.prototype.selectedValue = function() {
   var sIndex = this.selectedIndex;
   return this.options[sIndex].value;
};

