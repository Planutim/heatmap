//title #title
//x-axis #x-axis
//#y-axis
//rect.cell
//4 different fill colors
//#description
//data-month,data-year,data-temp for each rect
//data-month, data-year of each cell should be within the range of the data
//my heat map should have cells that align with the corresponding month on the y-axis
//align align
//tick labels with full month name
//tick labels for years b/w 1754 and 2015
//legend #legend

//rect elements
//legend is a heatmeter below chart
//tooltip
const colors = {
  hotter: '#ff3333',
  hot: '#ff6600',
  warm: '#ffff4d',
  neutral: '#ccffcc',
  cool: '#66ffcc',
  colder: '#33ccff',
  cold: '#0099ff',
  coldest: '#0033cc'
}
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
$('body').prepend($('<a href='+url+' target="_blank">JSON</a>'))
const w = 1500;
const h = 600;
const padding = 50;
document.addEventListener('DOMContentLoaded',function(){
  //main svg
  var d3heat = d3.select('body')
  .append('svg')
  .attr('width',w)
  .attr('height',h+100)
  .style('background-color','lightcyan')
  
  d3heat.append('title').text('Title').attr('id','title')
  d3heat.append('text').text('testest').attr('x',w/2).attr('y',20).style('fill','red').style('font-size','25px').style('font-family','Trebuchet MS,sans-serif').attr('id','description')
  
  var colorsArr = Object.entries(colors)
  var d3legend=d3heat.append('g').attr('id','legend')
  d3legend.selectAll('rect')
    .data(colorsArr.reverse())
    .enter()
    .append('rect')
    .attr('width',30)
    .attr('height',30)
    .style('fill',d=>d[1])
    .attr('x',(d,i)=>50*i)
    .attr('y',h+50)
    .append('title')
    .text(d=>d[0])
    
    
  //request for data
  req = new XMLHttpRequest();
  req.open('GET',url,true)
  req.send()
  req.onload=function(){
    jsonFull = JSON.parse(req.responseText)
    json = jsonFull['monthlyVariance'];
    
    //code 
    const xScale = d3.scaleLinear().domain(d3.extent(json,d=>d.year)).range([padding,w-padding])
    const yScale = d3.scaleLinear().domain(d3.extent(json,d=>d.month)).range([h-padding-20,padding-20])
    const yScale2 = d3.scaleLinear()
    //console.log(yScale(10))
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    const tparse =d3.timeParse('%m')
    const tformat = d3.timeFormat('%B')
    yAxis.tickFormat(d=>tformat(tparse(d)))
    xAxis.tickFormat(d=>d.toString())
    
    d3heat.append('g').attr('transform','translate('+0+','+(h-padding+25)+')').attr('id','x-axis').call(xAxis)
    d3heat.append('g').attr('transform','translate('+(padding-3)+','+22+')').attr('id','y-axis').call(yAxis)
    var temp = d3.extent(json,d=>d.year)
    console.log(temp)
    console.log(json.length)
    
    
    var tooltip = d3.select('body').append('div').attr('id','tooltip').attr('width',100).attr('height',60).style('border-radius','10px').style('border','1px solid white').style('position','absolute').style('display','none')
    //rect
    d3heat.selectAll('rect')
    .data(json)
    .enter()
    .append('rect')
    .attr('x',d=>xScale(d.year))
    .attr('y',d=>yScale(d.month))
    .attr('width',5.2)
    .attr('height',44)
    .attr('class','cell')
    .attr('data-month',d=>d.month-1)
    .attr('data-year',d=>d.year)
    .attr('data-temp',d=>d.variance)
    .on('mouseover',function(d){
      tooltip.style('left', (xScale(d.year))+"px").style('top',(yScale(d.month)-120)+'px').style('display','block').attr('data-year',d.year)
      .html('<p>'+tformat(tparse(d.month))+" "+d.year+'</p><p>'+((jsonFull.baseTemperature+d.variance).toFixed(4))+'</p><p>'+d.variance+'</p>')
    })
    .on('mouseout',function(d){
      tooltip.style('display','none')
    })
    .style('fill',d=>{
      
       if(d.variance>1){
         return colors.hotter
       }else if(d.variance>0.3&&d.variance<=0.5){
         return colors.neutral
       }else if(d.variance>0.5&&d.variance<=1)
         return colors.hot
      else if(d.variance>0&&d.variance<=0.3){
         return colors.neutral
       }else if(d.variance<0&&d.variance>-1){
         return colors.cool
       }else{
         return  colors.colder
       }
    })
    //w/(3153/12)
    //h/12
    
    //tooltip
    
  }
})


