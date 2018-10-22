/**
|--------------------------------------------------
| Graph configuration
|--------------------------------------------------
*/
// Line Graph dimensions & margin
const margin = { top: 40, right: 20, bottom: 50, left: 50 }
const graphWidth = 560 - (margin.right + margin.left)
const graphHeight = 400 - (margin.right + margin.left)

// Configure the canvas size, and append an 'svg'
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', graphWidth + (margin.left + margin.right))
    .attr('height', graphHeight + (margin.top + margin.bottom))

// Append a 'graph' onto the previously created 'svg' and set its dimensions
const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Scales
const x = d3.scaleTime().range([0, graphWidth])
const y = d3.scaleLinear().range([graphHeight, 0])

// Axis groups
const xAxisGroup = graph.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g')
  .attr('class', 'y-axis')

// d3 line path generator
const line = d3.line()
  .x(function(d){ return x(new Date(d.date)) })
  .y(function(d){ return y(d.distance) })

// Line path elements
const path = graph.append('path')

/**
|--------------------------------------------------
| The update function
|--------------------------------------------------
*/
const update = data => {
  // Filter the data array
  data = data.filter(item => item.activity == activity)
  
  // Sort data based on date object
  data.sort((a, b) => new Date(a.date) - new Date(b.date))

  // Set the scale domains
  x.domain(d3.extent(data, d => new Date(d.date)))
  y.domain([0, d3.max(data, d => d.distance)])

  // Update path data
  // When using a line, you must pass an array into the data method
  path.data([data])
    .attr('fill', 'none')
    .attr('stroke', '#00bfa5')
    .attr('stroke-width', 2)
    .attr('d', line)

  // Create circles for objects
  const circles = graph.selectAll('circle')
    .data(data)

  // Remove unwanted points (the 'exit selection')
  circles.exit().remove()

  // Update current 'circles'
  circles
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.distance))

  // Add new 'points' to the 'enter selection'
  // cx & cy are the x & y axis
  circles.enter()
    .append('circle')
      .attr('r', 4)
      .attr('cx', d => x(new Date(d.date)))
      .attr('cy', d => y(d.distance))
      .attr('fill', '#ccc')

  graph.selectAll('circle')
    .on('mouseover', handleMouseOver)
    .on('mouseleave', handleMouseOut)
    .on('mouseclick', handleClick)

  // Create Axis
  const xAxis = d3.axisBottom(x)
    .ticks(4)
    // %b = abbreviated month
    // %d = abbreviated day
    .tickFormat(d3.timeFormat('%b %d'))

  const yAxis = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => d + 'm ')

  // Call Axis
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

  // Rotate the x Axis
  xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')

}

/**
|--------------------------------------------------
| Data and Firestore
|--------------------------------------------------
*/
let data = []

db.collection('activities').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = {...change.doc.data(), id: change.doc.id}
    
    switch(change.type) {
      case 'added':
        data.push(doc)
        break
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id)
        data[index] = doc
        break
      case 'removed':
        data = data.filter(item => item.id !== doc.id)
        break
      default: 
        break
    }
  })
  update(data)
})

/**
|--------------------------------------------------
| Event handlers
|--------------------------------------------------
*/
const handleMouseOver = (data, index, array) => {
  d3.select(array[index])
    .transition().duration(100)
    .attr('r', 8)
    .attr('fill', '#fff')
  
}

const handleMouseOut = (data, index, array) => {
  d3.select(array[index])
    .transition().duration(100)
    .attr('r', 4) 
}

const handleClick = data => {
  const id = data.data.id
  database.collection('activities').doc(id).delete()
}