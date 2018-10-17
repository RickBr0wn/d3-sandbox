/**
|--------------------------------------------------
| Using linear
|--------------------------------------------------
*/

// Select the svg container first
const svg = d3.select('svg')

d3.json('planets.json')
  .then(data => {
    // Grab any avaiable 'circles' elements from 
    // the DOM and push the 'data' to it
    const circles = svg.selectAll('circle')
      .data(data)

    // Add attributes to 'circles' already in the DOM
    circles
      .attr('cy', 200)
      .attr('cx', data => data.distance)
      .attr('r', data => data.radius)
      .attr('fill', data => data.fill)
    
    // Append the 'enter selection' to the DOM
    circles.enter()
      .append('circle')
      .attr('cy', 200)
      .attr('cx', data => data.distance)
      .attr('r', data => data.radius)
      .attr('fill', data => data.fill)

  })