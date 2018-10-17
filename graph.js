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

/// Update function
const update = data => {
  // Update color scale domain
  color.domain(data.map(item => item.name))

  // Join enhanced (pie) data to path elements
  const paths = graph.selectAll('path')
    .data(pie(data))

  // Handle the exit selection
  paths.exit().remove()

  // Handle the current DOM path updates
  paths.attr('d', arcPath)

  paths.enter()
    .append('path')
      .attr('class', 'arc')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('fill', data => color(data.data.name))
      .transition().duration(750)
        .attrTween('d', arcTweenEnter)
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
  