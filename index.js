// DOM elements
const btns = document.querySelectorAll('button')
const form = document.querySelector('form')
const formActivity = document.querySelector('form span')
const input = document.querySelector('input')
const error = document.querySelector('.error')

// Event Listeners
let activity = 'cycling'

btns.forEach(btn => {
  btn.addEventListener('click', e => {
    // Get activity (from HTML lines 32-35 'data-activity')
    activity = e.target.dataset.activity

    // Remove and add active class
    btns.forEach(btn => btn.classList.remove('active'))
    e.target.classList.add('active')

    // Set the id of input field
    input.setAttribute('id', activity)

    // Set the text of form span
    formActivity.textContent = activity

  })
})

// Form submit
form.addEventListener('submit', e => {
  // Prevent the default 'submit' event (page refresh)
  e.preventDefault()

  const distance = parseInt(input.value)
  if(distance) {
    db.collection('activities').add({
      distance,
      activity,
      date: new Date().toString()
    }).then(() => {
      error.textContent = ''
      input.value = ''
    })
  } else {
    error.textContent = 'Please enter a valid distance!'
    input.value = ''
  }
})