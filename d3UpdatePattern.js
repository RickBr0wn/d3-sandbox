/**
|--------------------------------------------------
| 
|  The d3 Update Pattern
| 
|--------------------------------------------------
*/

const update = data => {

  // 1. Update scales (domains) if they rely on our data
  xAxisScaled.domain(data.map(item => item.name)) /* Can be any axis */

  // 2. Join the updated elements to the elements
  const rects = graph.selectAll('rect').data(data)

  // 3. Remove unwanted (if any) shapes using the exit selection
  rects.exit.remove()

  // 4. Update the current shapes in the DOM
  rects.attr(...etc)

  // 5. Append the enter selection to the DOM
  rects.enter().append('rect').attr(...etc)

}