const dimensionsOfChart = { height: 300, width: 300, radius: 150 }
const centerOfChart = { x: (dimensionsOfChart.width / 2 + 5), y: (dimensionsOfChart.height / 2 + 5) }

const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', dimensionsOfChart.width + 150)
    .attr('height', dimensionsOfChart.height + 150)

const graph = svg
  .append('g')
    .attr('transform', `translate(${centerOfChart.x} ${centerOfChart.y})`)

const pie = d3.pie()
  .sort(null)
  .value(data => data.cost)

const arcPath = d3.arc()
  .outerRadius(dimensionsOfChart.radius)
  .innerRadius(dimensionsOfChart.radius / 2)

const color = d3.scaleOrdinal(d3['schemeSet3'])

// Legend setup
const legendGroup = svg.append('g')
  .attr('transform', `translate(${dimensionsOfChart.width + 40}, 10)`)

const legend = d3.legendColor()
  .shape('circle')
  .shapePadding(10)
  .scale(color)

// Tooltip setup
const tip = d3.tip()
  .attr('class', 'tip card')
  .html(data => {
    let content = `<div class="name">${data.data.name}</div>`
    content += `<div class="cost">${data.data.cost}</div>`
    content += `<div class="delete">Click slice to delete</div>`
    return content
  })

graph.call(tip)

// Update function
const update = data => {
  // Update color scale domain
  color.domain(data.map(item => item.name))
  
  // Update call legend
  legendGroup.call(legend)
  legendGroup.selectAll('text')
  .attr('fill', '#fff')
  
  // Join enhanced (pie) data to path elements
  const paths = graph.selectAll('path')
  .data(pie(data))
  
  // Handle the exit selection
  paths.exit()
  .transition().duration(750)
  .attrTween('d', arcTweenExit)
  .remove()
  
  // Handle the current DOM path updates
  paths.attr('d', arcPath)
  .transition().duration(750)
  .attrTween('d', arcTweenUpdate)
  
  // the enter selection
  paths.enter()
  .append('path')
  .attr('class', 'arc')
  .attr('stroke', '#fff')
  .attr('stroke-width', 3)
  .attr('fill', data => color(data.data.name))
  .each(function(data) { this._current = data })
  .transition().duration(750)
  .attrTween('d', arcTweenEnter)
  
  // Add event listners
  graph.selectAll('path')
  .on('mouseover', (data, index, array) => {
    handleMouseOver(data, index, array)
    tip.show(data, array[index])
  })
  .on('mouseout', (data, index, array) => {
    handleMouseOut(data, index, array)
    tip.hide(data, array[index])
  })
  .on('click', handleClick)
}

// Data array and firestore
let data = []

database.collection('expenses').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = { ...change.doc.data(), id: change.doc.id }
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

const arcTweenEnter = data => {
  let interpolation = d3.interpolate(data.endAngle-0.1, data.startAngle)
  
  return function(transition) {
    data.startAngle = interpolation(transition)
    return arcPath(data)
  }
}

const arcTweenExit = data => {
  let interpolation = d3.interpolate(data.startAngle, data.endAngle-0.1)
  
  return function(transition) {
    data.startAngle = interpolation(transition)
    return arcPath(data)
  }
}

// Use function keyword to allow use of 'this'
function arcTweenUpdate(data) {
  /// Interpolate between the two objects
  let interpolation = d3.interpolate(this._current, data)
  
  // Update the current prop with the new updated data
  this._current = interpolation(1)
  
  return function(transition) {
    return arcPath(interpolation(transition))  
  }
}

// Event handlers
const handleMouseOver = (data, index, array) => {
  d3.select(array[index])
    .transition('changeSliceFill').duration(300)
      .attr('fill', '#fff')
}

const handleMouseOut = (data, index, array) => {
  d3.select(array[index])
    .transition('changeSliceFill').duration(300)
      .attr('fill', color(data.data.name))
}

const handleClick = data => {
  const id = data.data.id
  database.collection('expenses').doc(id).delete()
}