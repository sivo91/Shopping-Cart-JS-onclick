
  const output = document.querySelector('.products')
  const cartContent = document.querySelector('.cart-content')
  const cartTotal = document.querySelector('.cart-total')
  const navbarBasket = document.querySelector('.cart-icon-item')
  const closeCart = document.querySelector('.close-btn')
  const navBasket = document.querySelector('.cart-icon-box')
  const clearTotal = document.querySelector('.clear-cart')
  const search = document.querySelector('.input')
  const form = document.querySelector('aside')
  const category = document.querySelector('.category')
  const metals = document.querySelector('.metals')
  const priceInput = document.querySelector('.form-range')
  const priceValue = document.querySelector('.range-value')
  const detailBox = document.querySelector('.detail')
  const detailCloseBtn = document.querySelector('.detail-close')
  const detailIcon = document.querySelector('.detail-icon')


  let cart = JSON.parse(localStorage.getItem("CART")) || []
  updateCart()
  let products = []
  
  // starter :]
  const init = async(e) => {
  const res = await fetch('./data.json')
  const data = await res.json()
  products.push(...data)
  
  displayProducts(products)
  e.preventDefault()
}


// DISPLAY PRODUCT FROM JSON DATA
 function displayProducts(products){

   products.forEach(product => {
    const {id, imgs, name, price} = product
     output.innerHTML += `
        <div class="card">
        <img src="${imgs}" alt="img">
        <div class="icons">
          <i class="bi bi-search icon-product detail-icon"
          onclick="detailOfProduct(${id})"></i> 
          <i class="bi bi-cart2 icon-product product-basket"  onclick="addToCart(${id})"></i>
        </div>
        <div class="card-body">
          <p class="card-title text-center">${name}</p>
          <p class="text-center">$${priceFormat(price)}</p>
        </div>
      </div>
     `
   })
}

// PRICE FORMAT
function priceFormat(price){
  return price / 100
}

 // SELECT BTN ON PRODUCT AND ADD TO CART
function addToCart(id){
  
  if(cart.some(item => item.id === id)) {
    alert('product already in cart!')
  } else {
    openCart()
    const item = products.find( product => product.id === id)
    cart.push({
      ...item,
      amount:1
    })
    console.log(cart)
  }
  
  updateCart()
}

function openCart(){
  document.querySelector('.sidebar').style.transform = "translateX(0%)";
}

// UPDATE CART
function updateCart() {
  addProductToCart()   
  subtotal()

  localStorage.setItem("CART", JSON.stringify(cart))
}

function subtotal(){
 let totalPrice = 0,
     totalItems = 0

     cart.forEach((item)=> {
      totalPrice += item.price * item.amount
      totalItems+= item.amount
      cartTotal.innerHTML = `$${totalPrice.toFixed(2) / 100}`
      navbarBasket.innerHTML = `${totalItems}`
     })
}

// ADD PRODUCT TO CART
function addProductToCart() {

   cartContent.innerHTML = '' // clear cart element

   cart.forEach((item) => {
    cartContent.innerHTML += `
      <div class="cart-item">
         <img src="${item.imgs}" class="cart-img" alt="img">
          <div class="cart-describe ps-5">
            <h5>${item.name}</h5>
            <h6>$${priceFormat(item.price)}</h6>
            <span class="remove-cart-item" onclick="removeItem(${item.id})" >remove</span>
          </div>
          <div class="control-cart-item">
            <i class="bi bi-caret-up-square cart-arrow cart-arrow-up" onclick="changeAmountOfProduct('plus', ${item.id})" ></i>
            <p class="amount-item">${item.amount}</p>
            <i class="bi bi-caret-down-square cart-arrow cart-arrow-down" onclick="changeAmountOfProduct('minus', ${item.id})" ></i>
          </div>
      </div>
    `
   })
}


// CHANGE PRODUCT AMOUNT IN CART
function changeAmountOfProduct(action, id) {
  cart = cart.map((item)=> {
    
       let currentAmount = item.amount

      if(item.id === id) {
        if(action === "minus" && currentAmount > 1){
          currentAmount--
        } else if (action === 'plus' && currentAmount < item.instock) {
          currentAmount++
        }
      }

     return {
      ...item,
       amount: currentAmount
     }
   })

   updateCart()
}

//REMOVE PRODUCT FROM CART
function removeItem (id){
 cart = cart.filter((item) => item.id !== id)
 updateCart()
}


// CLOSE CART VIA CLOSE BTN IN CART
closeCart.addEventListener('click', () => {
  document.querySelector('.sidebar').style.transform = "translateX(100%)";
})

// OPEN CART VIA NAV BASKET
navBasket.addEventListener('click', () => {
  document.querySelector('.sidebar').style.transform = "translateX(0%)";
})

// CLEAR CART TOTAL BTN
  clearTotal.addEventListener('click', () => {
     if(cart.length > 0) {
      cartTotal.innerHTML = 0
      cartContent.innerHTML = ''
      navbarBasket.innerHTML = 0
      cart = []
     }
     updateCart()
})


 // SEARCH INPUT
form.addEventListener('keyup', () => {
 
  const value = search.value
  console.log(value)

  if(value) {
    const newStore = products.filter((item) => {
      let { name } = item
      //console.log(name)
      name = name.toLowerCase()
      if(name.startsWith(value)) {
        return item
      }
    })
    console.log(newStore)
    // boha jeho treba najskor vycistit okno
    document.querySelector('.products').innerHTML = ''
    displayProducts(newStore)
    if(newStore.length < 1) {
    document.querySelector('.products').innerHTML = `<h3 class="mt-5 text-center text-danger"> Product not Found </h3>`
    }
  } else {
    displayProducts(products)
  }

})

// COMPANIES SELECTION
category.addEventListener('click', e => {
 //const companies = ['all', ...new Set(products.map(item => item.name))]
 //console.log(companies)

  let current = e.target
  let x = current.textContent
  console.log(x) 
  
 let comp = []

  if(x === 'All'){
    comp = [...products]
  } else {
    comp = products.filter((item => item.category === x))
  }

  document.querySelector('.products').innerHTML = ''
  displayProducts(comp)
})


// METALS SELECTION
metals.addEventListener('click', e => {
  let current = e.target
  let x = current.textContent.toLowerCase()
  //console.log(x)

   let gold = []
   let silver = []
   if(x === 'gold'){

    gold = products.filter(item => item.metal === x)
    document.querySelector('.products').innerHTML = ''
    displayProducts(gold)

   } else {
    silver = products.filter(item => item.metal === x)
    document.querySelector('.products').innerHTML = ''
    displayProducts(silver)
   }

   
   

})

// SEARCH PRICE INPUT
function searchPrice(){
  let maxPrice = products.map(item => item.price)
  //console.log(maxPrice)
  maxPrice = Math.max(...maxPrice)
  maxPrice = Math.ceil(maxPrice / 100)
  priceInput.value = maxPrice
  priceInput.max = maxPrice
  priceInput.min = 0
  


  priceInput.addEventListener('input', () => {

    let price = parseInt(priceInput.value)
    priceValue.textContent = `Value: $${price}`

  //console.log(price , typeof price)
  let data = products.filter(item => item.price / 100 <= price)
  
  document.querySelector('.products').innerHTML = ''
  displayProducts(data)

  if(data.length < 1) {
  document.querySelector('.products').innerHTML = `<h3 class="mt-5 text-danger"> Product no found </h3>`
  }

  })
}

searchPrice()

// OPEN DETAIL IMAGE
function detailOfProduct(id){
  console.log(id)

  let image = products.find(item => item.id === id)
  console.log(image)
  
  if(id === image.id) {
    detailBox.innerHTML = `
      <i class="bi bi-x-octagon-fill detail-close" onclick="closeDetailImg()"></i>
      <img src="${image.imgs}" alt="img">
    `
    detailBox.style.display = 'block'
    
  }
}

// CLOSE DETAIL IMG
function closeDetailImg() {
    detailBox.style.display = 'none'
}


window.addEventListener('DOMContentLoaded', init)







