// Create the 'svg'
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', 1060)
  .attr('height', 800)

// Create a 'graph' group
const graph = svg.append('g')
  .attr('transform', 'translate(50, 50)') // to give a 50px margin

const stratify = d3.stratify()
.id(dataObj => dataObj.name)
.parentId(dataObj => dataObj.parent)

const rootNode = stratify(data)
  .sum(dataObj => dataObj.amount)

// Call the pack
const pack = d3.pack()
  .size([960, 700])
  .padding(5)

const bubbleData = pack(rootNode).descendants()

// create an ordinal scale
const colour = d3.scaleOrdinal(['#d1c4e9', '#b39ddb', '#9575cd'])

// Join data and add group for each node
const nodes = graph.selectAll('g')
  .data(bubbleData)
  .enter()
  .append('g')
  // Returns an array of nodes entered into the DOM (groups)
  .attr('transform', dataObj => `translate(${dataObj.x}, ${dataObj.y})`)

console.log(nodes)

// Add a circle to each group
nodes.append('circle')
  .attr('r', dataObj => dataObj.r)
  .attr('stroke', 'white')
  .attr('stroke-width', 2)
  .attr('fill', dataObj => colour(dataObj.depth))
  .attr('opacity', 0.5)

// Add text to each group
// nodes.filter(dataObj => !dataObj.children)
nodes // Unfiltered to show all dataset titles
  .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy','0.3em')
    .attr('fill', '#333')
    .attr('opacity', 0.8)
    .style('font-size', dataObj => (dataObj.value * 5))
    .text(dataObj => dataObj.data.name)