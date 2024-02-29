import {genId as generateId} from "./genId"

const LOCAL_STORAGE_KEY = 'cart'

const root = document.querySelector("#cards_container")

let card_counter = 1

const cards = []

let cart = {}

const getData = async () => {
    const rsp = await fetch('https://65ca55da3b05d29307e02aa1.mockapi.io/MyDiploma')
    const result = await rsp.json()
    result.forEach(el => {
        const card = generateCard(el)
        drawCard(card)
    })
    
    console.log(cards)
}

const generateCard = (data) => {
    const cardData = {}
    cardData.data = {...data}

    const card = document.createElement('div')
    card.setAttribute('id', data.id)

    cardData.id = card.id

    card.classList.add('card')

    const itemImage = document.createElement('img')
    itemImage.setAttribute('src', data.image + `?id=${card_counter++}`)
    itemImage.classList.add('card_image')

    const button = document.createElement('button')
    button.innerText = 'Add to Cart'
    button.setAttribute('value', 'add')
    button.classList.add('card_button')

    const itemName = document.createElement('span')
    itemName.classList.add('item_name')
    itemName.innerText = data.name

    const itemPrice = document.createElement('span')
    itemPrice.classList.add('item_price')
    itemPrice.innerText = data.price + '$'

    card.appendChild(itemImage)
    card.appendChild(itemName)
    card.appendChild(itemPrice)
    card.appendChild(button)
    
    cards.push(cardData)

    return card
}

const drawCard = (card) => {
    root.appendChild(card)
}

root.addEventListener('click', (e) => {
    let id
    if(!e.target.closest('.card')) return
    else id = e.target.closest('.card').id

    if(e.target.value !== 'add') return

    console.log(id)

    cart[id] === undefined ? cart[id] = 1 : cart[id]++

    console.log(cart[id])

    updateStorage()
})

function updateStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart))
}

window.addEventListener('DOMContentLoaded', receiveStoredData)

function receiveStoredData() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    cart = JSON.parse(data) || []

}

const cart_button = document.querySelector("#cart_button")

cart_button.addEventListener('click', () => {
    document.querySelector("#user_cart").setAttribute("style", "display: flex;")
    const user_cart = document.querySelector("#user_cart")
    let text = ""
    for (const item in cart) {
        console.log(item)
        text += cards.find(el => el.id === item).data.name + "              " + cart[item] + "<br>"
    }

    user_cart.innerHTML = text

    document.querySelector("#overlay").setAttribute("style", "display: block;")
})

document.addEventListener('keydown', (e) => {
    if(e.key === "Escape"){
        document.querySelector("#user_cart").setAttribute("style", "")
        document.querySelector("#overlay").setAttribute("style", "")
    }

    if(e.key === "d"){
        console.log(e.key)
        cart = {}
        updateStorage()
        document.querySelector("#user_cart").innerHTML = ""
    }
})

getData()