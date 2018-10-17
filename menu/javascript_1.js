/**
|--------------------------------------------------
| 
|  Using 'linear scale' on the Y axis
|  and 'band scale' on the X axis
| 
|  // Find the smallest number from the dataset
|  const minValueInDataSet = d3.min(data, item => item.orders)
|
|  // Find the largest number from the dataset
|  const maxValueInDataSet = d3.max(data, item => item.orders)
|
|  // Find the lowest and the highest numbers from the dataset
|  const minAndMaxValuesInDataSet = d3.extent(data, item => item.orders)
| 
|--------------------------------------------------
*/

// Select the svg/canvas container first
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600)

// Create margins and dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100}
const graphWidth = 600 - margin.left - margin.right
const graphHeight = 600 - margin.top - margin.bottom

// Add attributes to the 'graph' group ('g') of elements
const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create the 'group' ('g') for the x axis
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

// Create the 'group' ('g') for the y axis
const yAxisGroup = graph.append('g')

// Scales
// Scale the 'Y axis'
const yAxisScaled = d3.scaleLinear()
  .range([graphHeight, 0])

// Scale the X axis
const xAxisScaled = d3.scaleBand()
  .range([0, 500])
  .paddingInner(0.05)
  .paddingOuter(0.05)

// Create both the x & y axis
const xAxis = d3.axisBottom(xAxisScaled)

// Ticks on x & y axis
const yAxis = d3.axisLeft(yAxisScaled)
  .ticks(3)
  .tickFormat(data => data + ' orders')

// Rotate all of the 'text' elements (x & y axis)
xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'grey')

// Update function
const update = data => {
  // Step 1 of the update function
  // Find the largest number from the dataset
  const maxValueInDataSet = d3.max(data, item => item.orders)
  // Scale the 'Y axis'
  yAxisScaled.domain([0, maxValueInDataSet])
  // Scale the X axis
  xAxisScaled.domain(data.map(item => item.name))

  // Step 2 of the update function
  // Join the data to some 'rects'
  const rects = graph.selectAll('rect')
    .data(data)

  // Step 3 of the update function
  // Remove the exit selection
  rects.exit().remove()

  // Step 4 of the update function
  // Update the current shapes in the DOM
  rects
    .attr('width', xAxisScaled.bandwidth)
    .attr('height', data => graphHeight - yAxisScaled(data.orders))
    .attr('fill', 'orange')
    .attr('x', data => xAxisScaled(data.name))
    .attr('y', data => yAxisScaled(data.orders))

  // Step 5 of the update function
  // Append the 'enter selection' to the DOM
  rects.enter()
    .append('rect')
      .attr('width', xAxisScaled.bandwidth)
      .attr('height', 0)
      .attr('fill', 'orange')
      .attr('x', data => xAxisScaled(data.name))
      .attr('y', graphHeight)
      .transition().duration(500)
        .attr('y', data => yAxisScaled(data.orders))
        .attr('height', data => graphHeight - yAxisScaled(data.orders))

  // Show the x & y axis
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)

}

// Create an empty 'changes' array to use with the 'update()'
let data = []

// Obtain & read the firestore database
database.collection('dishes').onSnapshot(res => {
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

// database.collection('dishes')
//   .get()
//   .then(res => {
//     let data = []
//     res.docs.forEach(doc => data.push(doc.data()))
    
//     // The important update() method
//     update(data)

//     // Loop the update()
//     // Updating data using the d3 interval method
//     d3.interval(() => {
//       data[0].orders += Math.floor(Math.random()*50)
//       data[1].orders += Math.floor(Math.random()*50)
//       data[2].orders += Math.floor(Math.random()*50)
//       data[3].orders += Math.floor(Math.random()*50)
//       update(data)
//     }, 1000)

//     // Removing data using the d3 interval method
//     d3.interval(() => {
//       data.pop()
//       update(data)
//     }, 3000)

// })