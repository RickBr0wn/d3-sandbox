/**
|--------------------------------------------------
| 
|   The 'this' key word in the arrow function implicitly returns the 
|   value to the attribute ('width', 'height' and 'fill' in this example).
| 
|   Whereas using the 'function(data, index, arrayOfElements) {}' method
|   will bind the 'this' key word to the 'rect' element (in this example)
| 
|   The workaround to apply the arrow function to the parent element is:
| 
|     arrayOfElements[index]
| 
|--------------------------------------------------
*/

const data = [
  {width: 200, height: 100, fill: 'purple'},
  {width: 100, height: 60, fill: 'pink'},
  {width: 50, height: 30, fill: 'red'}
]

const svg = d3.select('svg')

const rects = svg.selectAll('rect')
  .data(data)

// Add attributes to 'rects' that are already in the DOM
rects
  .attr('width', (data, index, arrayOfElements) => data.width)
  .attr('height', (data, index, arrayOfElements) => data.height)
  .attr('fill', (data, index, arrayOfElements) => data.fill)

  // Append the 'enter selection' to the DOM
rects.enter()
  .append('rect')
  .attr('width', (data, index, arrayOfElements) => data.width)
  .attr('height', (data, index, arrayOfElements) => data.height)
  .attr('fill', (data, index, arrayOfElements) => data.fill)

console.log(rects)