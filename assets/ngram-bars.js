// set the dimensions and margins of the graph
const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom, padding = 25;

// unigrams - append the svg object
const unigrams_svg = d3.select("#unigrams-chart")
  .append("svg")
    .attr("width", width + 300 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${100}, ${margin.top})`);

// bigrams - append the svg object
const bigrams_svg = d3.select("#bigrams-chart")
  .append("svg")
    .attr("width", width + 50 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${150}, ${margin.top})`);

// trigrams - append the svg object
const trigrams_svg = d3.select("#trigrams-chart")
  .append("svg")
    .attr("width", width + 100 +  margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${200}, ${margin.top})`);

d3.csv("./data/ngrams.csv").then( function(data) {


// UNIGRAMS 
//********************************************

  //data
  var unigram_data = data
    .filter( x => x.type == "unigram");

  unigram_data
    .sort(function(a,b){
      return [1] - b[1];
    })

    console.log(unigram_data[0].count)

  // X axis
  const unigram_x = d3.scaleLinear()
    .domain([0, unigram_data[0].count])
    .range([ 0, width*1.5]);

  unigrams_svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(unigram_x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const unigram_y = d3.scaleBand()
    .range([ 0, height ])
    .domain(unigram_data.map(d => d.ngram))
    .padding(.1);

  unigrams_svg.append("g")
    .call(d3.axisLeft(unigram_y))
    .style("font-size", "12px");

//Bars
  var uni_bars = unigrams_svg.selectAll("myRect")
                  .data(unigram_data)
                  .join("rect")
                  .attr("x", unigram_x(0) )
                  .attr("y", d => unigram_y(d.ngram))
                  .attr("width", d => unigram_x(d.count))
                  .attr("height", unigram_y.bandwidth())
                  .attr("fill", "transparent")
                  .attr("stroke", "#000")
                  .append("title")
                  .text(function(d){
                    return d.ngram + " : " + parseInt(d.count).toLocaleString('en');
                  })



// BIGRAMS
//********************************************

//data
  var bigram_data = data
    .filter( x => x.type == "bigrams");

  bigram_data
    .sort(function(a,b){
      return a[1] - b[1];
    })

  // X axis
  const bigram_x = d3.scaleLinear()
    .domain([0, bigram_data[0].count])
    .range([ 0, width]);

  bigrams_svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(bigram_x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const bigram_y = d3.scaleBand()
    .range([ 0, height ])
    .domain(bigram_data.map(d => d.ngram))
    .padding(.1);

  bigrams_svg.append("g")
    .call(d3.axisLeft(bigram_y))
    .style("font-size", "12px");

//Bars
  var bi_bars = bigrams_svg.selectAll("myRect")
                .data(bigram_data)
                .join("rect")
                .attr("x", bigram_x(0) )
                .attr("y", d => bigram_y(d.ngram))
                .attr("width", d => bigram_x(d.count))
                .attr("height", bigram_y.bandwidth())
                .attr("fill", "transparent")
                .attr("stroke", "#000")
                .append("title")
                .text(function(d){
                  return d.ngram + " : " + parseInt(d.count).toLocaleString('en');
                })

// TRIGRAMS
//********************************************

//data
  var trigram_data = data
    .filter( x => x.type == "trigrams");

  trigram_data
    .sort(function(a,b){
      return a[1] - b[1];
    })

  // X axis
  const trigram_x = d3.scaleLinear()
    .domain([0, trigram_data[0].count])
    .range([ 0, width/1.5]);
  trigrams_svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(trigram_x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const trigram_y = d3.scaleBand()
    .range([ 0, height ])
    .domain(trigram_data.map(d => d.ngram))
    .padding(.1);
  trigrams_svg.append("g")
    .call(d3.axisLeft(trigram_y))
    .style("font-size", "12px");

//Bars
  var tri_bars = trigrams_svg.selectAll("myRect")
              .data(trigram_data)
              .join("rect")
              .attr("x", trigram_x(0) )
              .attr("y", d => trigram_y(d.ngram))
              .attr("width", d => trigram_x(d.count))
              .attr("height", trigram_y.bandwidth())
              .attr("fill", "transparent")
              .attr("stroke", "#000")
              .append("title")
              .text(function(d){
                return d.ngram + " : " + parseInt(d.count).toLocaleString('en');
              })
});