// Can try serving the html to see the outcome

const margin = {top:60, right:60, bottom:60, left:60},
width = 900 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom

const histHeight = 100
const plotHeight = 200
const parseDate = d3.timeParse('%Y-%m-%d-%H')
// const formatMonth = d3.timeFormat('%Y-%m-%d')
const formatMonth = d3.timeFormat('%b')



const startDate = new Date('2019-01-01 00:00:00')
const endDate = new Date('2020-12-30 00::00:00')
const dateArray = d3.timeMonths(startDate, endDate)


d3.json("../../../data/chart-by-country/ar.json", function(error, data){
  let daily_data = generate_daily(data);
  console.log(daily_data);
  let month_data = generate_month(daily_data);
  console.log(month_data);

  // let day_min = d3.min(daily_data, d => d.duration)
  // let day_max = d3.max(daily_data, d => d.duration)

  const weekScale = d3.scaleLinear()
    .domain([0, 4])
    .range([0, plotHeight])
  const rScale = d3.scaleLinear()
    .domain([d3.min(month_data, d => d.duration), d3.max(month_data, d => d.duration)])
    .range([3, plotHeight / 12])


  const x = d3.scaleTime()
    .domain([d3.min(daily_data, d => d.date), d3.max(daily_data, d => d.date)])
    .range([0, width])
    .clamp(true)

  const y = d3.scaleLinear()
    .domain([d3.min(daily_data, d => d.duration), d3.max(daily_data, d => d.duration)])
    .range([histHeight, 0])

  const colors = d3.scaleQuantize()
    .domain([d3.min(daily_data, d => d.duration), d3.max(daily_data, d => d.duration)])
    .range(["#9E0142", "#D53E4F", "#F46D43", "#FDAE61", "#FEE08B", "#E6F598", "#ABDDA4", "#66C2A5", "#3288BD", "#5E4FA2", "#74C67A", "#99D492", "#BFE1B0", "#DEEDCF"]);

  const dailyYAxis = d3.axisLeft(y).ticks(5);
  const weeklyYAxis = d3.axisLeft(weekScale).ticks(4).tickFormat(function(d) { return 'Week ' + (d + 1); });

  const svg = d3.select('#vis')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + plotHeight + margin.top + margin.bottom)

  const hist = svg.append('g')
    .attr('class', 'histogram')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  const slider = svg.append('g')
    .attr('class', 'slider')
    .attr('transform', `translate(${margin.left}, ${margin.top + histHeight})`)

  const plot = svg.append('g')
    .attr('class', 'plot')
    .attr('transform', `translate(${margin.left}, ${margin.top + histHeight + 50})`)

  svg.append("g")
    .attr('transform', `translate(${margin.left - 15}, ${margin.top})`)
    .call(dailyYAxis);
  svg.append("g")
    .attr('transform', `translate(${margin.left - 15}, ${margin.top + histHeight + 50})`)
    .call(weeklyYAxis)

  // svg.append("text")
  //   // .attr("transform", "rotate(-90)")
  //   .attr("y", histHeight + margin.top + 40)
  //   .attr("x", 15)
  //   .attr("dy", "1em")
  //   .style("text-anchor", "middle")
  //   .text("Week");  



  drawHistogram(daily_data)
  drawPlot(month_data)
  drawSlider()

  function drawHistogram(data) {
    const bar = hist.selectAll(".rectbar")
      .data(data)
      .enter()
      .append('g')
      .append("rect")
      .attr('class', 'rectbar')
      .style("fill", d => colors(d.duration))
      .attr("x", function(d) { return x(d.date); })
      .attr("width", width / 730)
      .attr("y", function(d) { return y(d.duration); })
      .attr("height", function(d) { return histHeight - y(d.duration); });
  }
  
  function drawSlider() {
    slider.append('rect')
      .attr('class', 'drag-bar')
      .attr('x',  0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', 10)
      .attr('fill', '#dcdcdc')
      .attr('rx', 4)
      .attr('ry', 4)
  
  
    slider.append('g', '.track-overlay')
      .attr('class', 'ticks')
      .attr('transform', 'translate(0, 18)')
      .selectAll('text')
      .data(x.ticks(24))
      .enter()
      .append('text')
      .attr('x', x)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .text(d => formatMonth(d))
  
    handle = slider.append('circle', '.track-overlay')
      .attr('class', 'handle')
      .attr('r', 9)
      .attr('cy', 5)
  
    slider.append('rect')
      .attr('class', 'drag-layer')
      .attr('x', 0)
      .attr('y', -35)
      .attr('width', width)
      .attr('height', 70)
      .attr('fill', 'transparent')
      .call(
        d3.drag().on('start drag', update)
      )
  }
  
  function drawPlot(data) {
    const weeklydots = plot.selectAll('.weeklydots')
      .data(data, d => d.duration)
  
      weeklydots.exit().remove()
  
      weeklydots.enter()
      .append('circle')
      .attr('class', 'weeklydots')
      .attr('cx', d => x(d.date))
      .attr('cy', d => weekScale(d.week))
      .attr('fill', d => colors(d.duration / 7))
      .attr('stroke', d => colors(d.duration / 7))
      .attr('opacity', 0.8)
      .attr('r', d => rScale(d.duration))
      .transition()
      .duration(400)
      .attr('r', d => rScale(d.duration)*1.7)
      .transition()
      .attr('r', d => rScale(d.duration))
  
      weeklydots.exit().remove()
  }
  
  function update() {
    const h = x.invert(d3.event.x)
    handle.attr('cx', x(h))
  
    const newData = month_data.filter(d => d.date < h)
    drawPlot(newData)
  
    // console.log(h);
    d3.selectAll('.rectbar')
      .attr('style', d => {
        return d.date < h ? 'fill: ' + colors(d.duration) : 'fill: #eaeaea';
      })
  }
  
});

function generate_daily(dataset) {
  let data = [];
  let sum = 0;
  let prev_date = dataset[0].date;
  for (i = 0; i < dataset.length; i += 1) {
    if (dataset[i].date == prev_date) {
      sum += dataset[i].duration * dataset[i].streams_count / 3600000;
    } else {
      data.push({'date': parseDate(prev_date+'-0'), 'duration': sum});
      sum = 0
      prev_date = dataset[i].date;
    }
  }
  return data;
}
// [{duration: x, week: 4, month: Date},]
function generate_month(dataset) {
  let data = [], week_count = 0, sum = 0, cur_month = dataset[0].date;
  // console.log(cur_month);
  for(i = 0; i < dataset.length; i+=1) {
    if (cur_month.getMonth() != dataset[i].date.getMonth()) {
      cur_month = dataset[i].date;
      week_count = 0;
    }  

    if (dataset[i].date.getDay() != 6) {
      sum += dataset[i].duration;
    } else {
      data.push({'duration':sum, 'week': week_count, 'date': cur_month});
      sum = 0;
      week_count += 1;
    }
  }
  return data;
}
